# wrap-segments-cli

Wrap lines at Unicode word boundaries, using [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter), on the command line.

## Install

```sh
npm install -g wrap-segments-cli
```

## Options

```txt
Usage: wraps [options] [file...]

Wrap some text, either from file, stdin, or given on the command line.  Each
chunk of text is wrapped independently from one another, and streamed to stdout
(or an outFile, if given).  Command line arguments with -t/--text are processed
before files.

Arguments:
  file                          files to wrap and concatenate.  Use "-" for
                                stdin. (default: ["-"])

Options:
  --encoding <encoding>         encoding for files read or written.  stdout is
                                always in the default encoding. (choices:
                                "ascii", "utf8", "utf-8", "utf16le", "ucs2",
                                "ucs-2", "base64", "base64url", "latin1",
                                "binary", "hex", default: "utf8")
  -h, --help                    display help for command
  --html                        escape output for HTML
  -i,--indent <text or number>  indent each line with this text.  If a number,
                                indent that many spaces (default: "")
  -l,--locale <tag>             locale for word and grapheme segmentation
                                (default: Determined from your local
                                environment)
  --noTrim                      do not trim the last line
  -o,--outFile <file>           output to a file instead of stdout
  --outdentFirst                Do not indent the first output line
  -t,--text <text>              wrap this chunk of text.  If used, stdin is not
                                processed unless "-" is used explicitly.  Can
                                be specified multiple times. (default: [])
  -w,--width <number>           maximum line length
```
