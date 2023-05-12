import { findGrapheme } from './utils.js'

/**
 * All options for wrapping.
 */
export interface WrapperOptions {
  // /**
  //  * If a word is longer than the allowed width, should it be chopped
  //  * at the allowed width?
  //  * @default false
  //  */
  // cut: boolean;

  /**
   * If a string, indent every line with that string.  If a number,
   * insert that many {@link indentChar}s at the beginning of each line.
   * @default 80
   */
  indent: number | string;

  /**
   * If {@link indent} is a number, use that many of this string to indent.
   * @default " "
   */
  indentChar: string;

  /**
   * If the input string is empty, should we still indent?
   * @deafult false
   */
  indentEmpty: boolean;

  /**
   * Indent the first line?
   * @default true
   */
  indentFirst: boolean;

  /**
   * Regular expression to test if a segment contains nothing but spaces.
   * Make sure to include '^' at the beginning and '$' at the end.
   * @default /^\s*$/u
   */
  isEmpty: RegExp;

  /**
   * Regular expression that finds newlines for replacement with
   * {@link newlineReplacement}.  Ensure you do not create a regular expression
   * denial of service
   * ({@link https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS | ReDoS})
   * attack.
   *
   * Make sure the expression has the `\g` modifier.
   *
   * @default /((?![\r\n\v\f\x85\u2028\u2029])\s)*[\r\n\v\f\x85\u2028\u2029]+(\s*)/gu
   */
  isNewline: RegExp;

  /**
   * Which locale to use when splitting by words?
   * @default `current locale of system, as calculated by the JS runtime`
   */
  locale: string;

  /**
   * String to insert at the end of every line, including the last one.
   * @default "\n"
   */
  newline: string;

  /**
   * For every newline found with {@link isNewline}, insert this string.
   * @default " "
   */
  newlineReplacement: string;

  /**
   * Trim empty space from the end of the input.
   * @default true
   */
  trim: boolean;

  /**
   * Maximum number of graphemes per line, *including* indentation.
   */
  width: number;

  /**
   * Function to escape the input string.  The escaping is performed after
   * line breaking, with the intent that in the final display, those escapes
   * will be removed.
   *
   * @param raw The unescaped string
   * @returns An escaped version of the string
   * @default (s:string):string => s
   */
  escape(raw: string): string;
}

interface SegmentInfo {
  prevWord?: Intl.SegmentData;
  nextWord?: Intl.SegmentData;
  empty?: Boolean;
}

const DEFAULT_LOCALE = new Intl.Segmenter().resolvedOptions().locale

function noEscape(s: string): string {
  return s
}


/**
 * Wrap words, where word boundaries are determined by Intl.Segmenter. Words
 * are wrapped at a given width, where the units of width are
 * {@link https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries | grapheme clusters},
 * NOT characters, code points, or UTF-16 code units.
 */
export class SegmentWrapper {

  /** Noramlized options */
  #opts: WrapperOptions

  /** Chunk by word boundary.  This is highly locale-dependent. */
  #words: Intl.Segmenter

  /** Chunk by grapheme cluster.  This shouldn't change much w/ locale. */
  #graphemes: Intl.Segmenter

  /** Indent expanded to string */
  #indent: string

  /** Length of writable area in graphemes */
  #width: number

  public constructor(opts: Partial<WrapperOptions> = {}) {
    this.#opts = {
      // cut: false,
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
   * @param text Input text
   * @returns Wrapped text
   */
  public wrap(text: string): string {
    // Normalize
    text = text.replace(this.#opts.isNewline, this.#opts.newlineReplacement)
    text = this.#opts.escape(text)

    const wordSeg = this.#words.segment(text)
    const graphemeSeg = this.#graphemes.segment(text)
    const words: Intl.SegmentData[] = []
    const graphemes = [...graphemeSeg]

    const info = new Map<number, SegmentInfo>()
    let prevWord: Intl.SegmentData | undefined = undefined
    let prevWordIndex = -1

    let i = 0
    let needNext: SegmentInfo[] = []
    for (const seg of wordSeg) {
      words.push(seg)
      const inf: SegmentInfo = {
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
      return this.#opts.indentEmpty ? this.#indent + this.#opts.newline : this.#opts.newline
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

  #graphemeCount(str: string): number {
    let ret = 0
    for (const _ of this.#graphemes.segment(str)) {
      ret++
    }
    return ret
  }
}
