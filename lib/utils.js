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
export function findGrapheme(graphemes, offset, start) {
  // This could be smarter by starting (offset - graphemes[start].index)
  // graphemes closer.
  const incr = Math.sign(offset - graphemes[start].index)
  if (incr === 0) {
    return start
  }
  for (let i = start; (i >= 0) && (i < graphemes.length); i += incr) {
    if (graphemes[i].index === offset) {
      return i
    }
  }
  throw new Error(
    `Grapheme not found: ${offset}, ${start}, ${graphemes.length}, ${incr}`
  )
}
