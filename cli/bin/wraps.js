#!/usr/bin/env node

import {Command, Option} from 'commander'
import {SegmentWrapper} from 'wrap-segments'
import fs from 'fs'
import os from 'os'

const prog = new Command()
  .description('Wrap some text, either from file, stdin, or given on the command line.  Each chunk of text is wrapped independently from one another, and streamed to stdout (or an outFile, if given).  Command line arguments with -t/--text are processed before files.')
  .argument('[file...]', 'files to wrap and concatenate.  Use "-" for stdin.', ['-'])
  .addOption(
    new Option('--encoding <encoding>', 'encoding for files read or written.  stdout is always in the default encoding.')
      .choices(['ascii', 'utf8', 'utf-8', 'utf16le', 'ucs2', 'ucs-2', 'base64', 'base64url', 'latin1', 'binary', 'hex'])
      .default('utf8')
  )
  .option('--html', 'escape output for HTML')
  .option(
    '-i,--indent <text or number>',
    'indent each line with this text.  If a number, indent that many spaces',
    v => parseInt(v, 10) || v,
    ''
  )
  .addOption(
    new Option('-l,--locale <tag>', 'locale for word and grapheme segmentation')
      .default(null, 'Determined from your local environment')
  )
  .option('--noTrim', 'do not trim the last line')
  .option('-o,--outFile <file>', 'output to a file instead of stdout')
  .option('--outdentFirst', 'Do not indent the first output line')
  .option('-t,--text <text>', 'wrap this chunk of text.  If used, stdin is not processed unless "-" is used explicitly.  Can be specified multiple times.', (v, p) => p.concat([v]), [])
  .addOption(
    new Option('-w,--width <number>', 'maximum line length')
      .default(process.stdout.columns, 'width of your terminal')
      .argParser(v => parseInt(v, 10))
  )
  .configureHelp({
    sortOptions: true,
  })
  .parse()

const opts = prog.opts()
const {args} = prog

if ((opts.text.length === 0) && (args.length === 0)) {
  args.push('-')
}

if (opts.locale === null) {
  opts.locale = undefined
}

const outstream = opts.outFile ?
  fs.createWriteStream(opts.outFile, opts.encoding) :
  process.stdout // Don't set encoding, will confuse terminal.

/**
 * Read stdin to completion with the configured encoding.
 *
 * @returns {Promise<string>}
 */
function readStdin() {
  // Below, d will be a string
  process.stdin.setEncoding(opts.encoding)
  return new Promise((resolve, reject) => {
    let s = ''
    process.stdin.on('data', d => (s += d))
    process.stdin.on('end', () => resolve(s))
    process.stdin.on('error', reject)
  })
}

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '\xA0': '&nbsp;',
}

/**
 * Escape HTML
 *
 * @param {string} str String containing prohibited characters.
 * @returns {string} Escaped string.
 * @private
 */
function htmlEscape(str) {
  return str.replace(/[&<>\xA0]/g, m => ESCAPES[m])
}

async function main() {
  const w = new SegmentWrapper({
    escape: opts.html ? htmlEscape : undefined,
    width: opts.width,
    locale: opts.locale,
    indent: opts.indent,
    indentFirst: !opts.outdentFirst,
    newline: os.EOL,
    trim: !opts.noTrim,
  })

  for (const t of opts.text) {
    outstream.write(w.wrap(t))
  }

  for (const f of args) {
    const t = f === '-' ?
      await readStdin() :
      await fs.promises.readFile(f, opts.encoding)

    outstream.write(w.wrap(t))
  }
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.log(e)
  process.exit(1)
})
