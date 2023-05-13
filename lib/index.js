/* eslint-disable prefer-named-capture-group */
import {findGrapheme} from './utils.js'
const DEFAULT_LOCALE = new Intl.Segmenter().resolvedOptions().locale

/**
 * @callback EscapeString
 * @param {string} s String to escape
 * @returns {string} Escaped string
 */

/**
 * Identity transform.
 *
 * @type {EscapeString}
 * @private
 */
function noEscape(s) {
  return s
}

/* eslint-disable max-len */
/**
 * @typedef {object} WrapperOptions
 * @prop {number|string} [indent=''] If a string, indent every line with that
 *   string.  If a number, insert that many {@link indentChar}s at the beginning of
 *   each line.  Defaults to `""` (the empty string).
 * @prop {string} [indentChar=SPACE] If {@link indent} is a number, use that many of
 *   this string to indent. Defaults to `" "` (a single space).
 * @prop {boolean} [indentEmpty=false] If the input string is empty, should we
 *   still indent?  Defaults to `false`
 * @prop {boolean} [indentFirst=true] Indent the first line?  Defaults to `true`.
 * @prop {RegExp} [isEmpty=/^\s*$/u] Regular expression to test if a segment
 *   contains nothing but spaces.  Make sure to include '^' at the beginning
 *   and '$' at the end.  Defaults to `/^\s*$/u`.
 * @prop {RegExp} [isNewline]
 *   Regular expression that finds newlines for replacement with
 *   `newlineReplacement`.  Ensure you do not create a regular expression
 *   denial of service
 *   ({@link https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS | ReDoS})
 *   attack.  Make sure the expression has the `\g` modifier.  Defaults to
 *   `/((?![\r\n\v\f\x85\u2028\u2029])\s)*[\r\n\v\f\x85\u2028\u2029]+(\s*)/gu`.
 * @prop {string} [locale] Which locale to use when splitting by words or graphemes?
 *   Defaults to current locale of system, as calculated by the JS
 *   runtime.
 * @prop {string} [newline='\n'] String to insert at the end of every line,
 *   including the last one.  Defaults to `"\n"`.
 * @prop {string} [newlineReplacement=SPACE] For every newline found with
 *   {@link isNewline}, insert this string.  Defaults to `" "` (single space).
 * @prop {boolean} [trim=true] Trim empty space from the end of the input.
 *   Defaults to `true`.
 * @prop {number} [width=80] Maximum number of graphemes per line, *including*
 *   indentation.  Defaults to `80`.
 * @prop {EscapeString} [escape] Function to escape the input string. The
 *   escaping is performed after line breaking, with the intent that in the
 *   final display, those escapes will be replaced appropriately.  Defaults
 *   to an identity transform.
 */
/* eslint-enable max-len */

/**
 * Wrap words, where word boundaries are determined by Intl.Segmenter. Words
 * are wrapped at a given width, where the units of width are
 * {@link https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries | grapheme clusters},
 * NOT characters, code points, or UTF-16 code units.
 */
export class SegmentWrapper {
  /**
   * Noramlized options
   * @type {Required<WrapperOptions>}
   */
  #opts

  /**
   * Chunk by word boundary.  This is highly locale-dependent.
   * @type {Intl.Segmenter}
   */
  #words

  /**
   * Chunk by grapheme cluster.  This shouldn't change much w/ locale.
   * @type {Intl.Segmenter}
   */
  #graphemes

  /**
   * Indent expanded to string
   * @type {string}
   */
  #indent

  /**
   * Length of writable area in graphemes
   * @type {number}
   */
  #width

  /**
   *
   * @param {WrapperOptions} [opts={}]
   */
  constructor(opts = {}) {
    this.#opts = {
      escape: noEscape,
      indent: '',
      indentChar: ' ',
      indentEmpty: false,
      indentFirst: true,
      isEmpty: /^\s*$/u,
      isNewline: /((?![\r\n\v\f\x85\u2028\u2029])\s)*[\r\n\v\f\x85\u2028\u2029]+(\s*)/gu,
      locale: DEFAULT_LOCALE,
      newline: '\n',
      newlineReplacement: ' ',
      trim: true,
      width: 80,
      ...opts,
    }

    this.#words = new Intl.Segmenter(this.#opts.locale, {
      granularity: 'word',
    })

    this.#graphemes = new Intl.Segmenter(this.#opts.locale, {
      granularity: 'grapheme',
    })

    this.#indent = (typeof this.#opts.indent === 'number') ?
      ''.padEnd(this.#opts.indent * this.#opts.indentChar.length, this.#opts.indentChar) :
      this.#opts.indent

    this.#width = this.#opts.width - this.#graphemeCount(this.#indent)
  }

  /**
   * Wrap some text with the configured options
   *
   * @param {string} text Input text
   * @returns {string} Wrapped text
   */
  wrap(text) {
    // Normalize
    text = text.replace(this.#opts.isNewline, this.#opts.newlineReplacement)
    text = this.#opts.escape(text)
    const wordSeg = this.#words.segment(text)
    const graphemeSeg = this.#graphemes.segment(text)
    const words = []
    const graphemes = [...graphemeSeg]

    /**
     * @typedef {object} SegmentInfo
     * @prop {Intl.SegmentData=} prevWord
     * @prop {Intl.SegmentData=} nextWord
     * @prop {boolean} empty
     * @private
     */

    /**
     * @type {Map<number,SegmentInfo>}
     */
    const info = new Map()
    let prevWord = undefined
    let prevWordIndex = -1
    let i = 0
    let needNext = []
    for (const seg of wordSeg) {
      words.push(seg)

      /**
       * @type {SegmentInfo}
       */
      const inf = {
        prevWord,
        empty: !seg.isWordLike && this.#opts.isEmpty.test(seg.segment),
      }

      info.set(seg.index, inf)
      if (!inf.empty) {
        for (const nn of needNext) {
          nn.nextWord = seg
        }
        needNext = []
        prevWord = seg
        prevWordIndex = i
      }
      needNext.push(inf)
      i++
    }

    if (this.#opts.trim) {
      words.splice(prevWordIndex + 1)
    }

    if (words.length === 0) {
      return this.#opts.indentEmpty ?
        this.#indent + this.#opts.newline :
        this.#opts.newline
    }

    const endWord = words[words.length - 1]
    const end = endWord.index + endWord.segment.length // In JS chars
    let offset = 0 // In JS chars
    let offsetG = 0 // In graphemes
    let res = ''
    while (offset < end) {
      if ((offset !== 0) || this.#opts.indentFirst) {
        res += this.#indent
      }

      const lastGraphemeIndex = offsetG + this.#width
      const lastGrapheme = graphemes[lastGraphemeIndex]
      if (!lastGrapheme) {
        res += text.slice(offset, end)
        res += this.#opts.newline
        break
      }

      const lastGraphemeStart = lastGrapheme.index
      const lastSeg = wordSeg.containing(lastGraphemeStart)
      const lastInfo = info.get(lastSeg.index)

      // Back up to the previous word.
      const penWord = lastInfo?.prevWord
      if (!penWord || penWord.index < offset) {
        // Word longer than width
        res += text.slice(offset, lastSeg.index + lastSeg.segment.length)
        res += this.#opts.newline
        if (lastInfo?.nextWord) {
          offset = lastInfo.nextWord.index
          // Search for the index of the grapheme at the start of the next word.
          offsetG = findGrapheme(graphemes, offset, lastGraphemeIndex)
        } else {
          break
        }
      } else {
        res += text.slice(offset, penWord.index + penWord.segment.length)
        res += this.#opts.newline
        if (lastInfo.empty) {
          if (lastInfo.nextWord) {
            offset = lastInfo.nextWord.index
            offsetG = findGrapheme(graphemes, offset, lastGraphemeIndex)
          } else {
            if (!this.#opts.trim) {
              res += lastSeg.segment
              res += this.#opts.newline
            }
            break
          }
        } else {
          offset = lastSeg.index
          offsetG = findGrapheme(graphemes, offset, lastGraphemeIndex)
        }
      }
    }
    return res
  }

  /**
   * How many graphemes are in this string?
   *
   * @param {string} str
   * @returns {number}
   */
  #graphemeCount(str) {
    let ret = 0
    for (const _ of this.#graphemes.segment(str)) {
      ret++
    }
    return ret
  }
}
