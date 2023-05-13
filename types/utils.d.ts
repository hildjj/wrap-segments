/**
 * Find the grapheme that starts with the given `offset`, starting the search
 * at `start`.
 *
 * @param graphemes {Intl.SegmentData[]}
 * @param offset {number} In JS chars
 * @param start {number} In graphemes
 * @returns {number} Index into `graphemes` of the grapheme with index `offset`.
 * @private
 */
export function findGrapheme(graphemes: Intl.SegmentData[], offset: number, start: number): number;
