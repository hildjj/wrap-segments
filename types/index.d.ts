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
/**
 * Wrap words, where word boundaries are determined by Intl.Segmenter. Words
 * are wrapped at a given width, where the units of width are
 * {@link https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries | grapheme clusters},
 * NOT characters, code points, or UTF-16 code units.
 */
export class SegmentWrapper {
    /**
     *
     * @param {WrapperOptions} [opts={}]
     */
    constructor(opts?: WrapperOptions | undefined);
    /**
     * Wrap some text with the configured options
     *
     * @param {string} text Input text
     * @returns {string} Wrapped text
     */
    wrap(text: string): string;
    #private;
}
export type EscapeString = (s: string) => string;
export type WrapperOptions = {
    /**
     * If a string, indent every line with that
     * string.  If a number, insert that many {@link indentChar }s at the beginning of
     * each line.  Defaults to `""` (the empty string).
     */
    indent?: string | number | undefined;
    /**
     * If {@link indent } is a number, use that many of
     * this string to indent. Defaults to `" "` (a single space).
     */
    indentChar?: string | undefined;
    /**
     * If the input string is empty, should we
     * still indent?  Defaults to `false`
     */
    indentEmpty?: boolean | undefined;
    /**
     * Indent the first line?  Defaults to `true`.
     */
    indentFirst?: boolean | undefined;
    /**
     * Regular expression to test if a segment
     * contains nothing but spaces.  Make sure to include '^' at the beginning
     * and '$' at the end.  Defaults to `/^\s*$/u`.
     */
    isEmpty?: RegExp | undefined;
    /**
     * Regular expression that finds newlines for replacement with
     * `newlineReplacement`.  Ensure you do not create a regular expression
     * denial of service
     * ({@link https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS | ReDoS})
     * attack.  Make sure the expression has the `\g` modifier.  Defaults to
     * `/((?![\r\n\v\f\x85\u2028\u2029])\s)*[\r\n\v\f\x85\u2028\u2029]+(\s*)/gu`.
     */
    isNewline?: RegExp | undefined;
    /**
     * Which locale to use when splitting by words or graphemes?
     * Defaults to current locale of system, as calculated by the JS
     * runtime.
     */
    locale?: string | undefined;
    /**
     * String to insert at the end of every line,
     * including the last one.  Defaults to `"\n"`.
     */
    newline?: string | undefined;
    /**
     * For every newline found with
     * {@link isNewline }, insert this string.  Defaults to `" "` (single space).
     */
    newlineReplacement?: string | undefined;
    /**
     * Trim empty space from the end of the input.
     * Defaults to `true`.
     */
    trim?: boolean | undefined;
    /**
     * Maximum number of graphemes per line, *including*
     * indentation.  Defaults to `80`.
     */
    width?: number | undefined;
    /**
     * Function to escape the input string. The
     * escaping is performed after line breaking, with the intent that in the
     * final display, those escapes will be replaced appropriately.  Defaults
     * to an identity transform.
     */
    escape?: EscapeString | undefined;
};
