# wrap-segments

Wrap lines at Unicode word boundaries, using [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter).

Existing wrapping libraries tend to work very well on plain ASCII-7 text.
However, the world has lots of other text that needs to be wrapped.

You might want to turn this:

> f̵̩̣̺ö̶̧̧̢o̶̥̩̗̹ ̶̨̢͔̳b̷̧̥͍̥a̷̛̦͓̜r̴̡͕̳̪

into this:

> f̵̩̣̺ö̶̧̧̢o̶̥̩̗̹ ̶̨̢͔̳<br>
> b̷̧̥͍̥a̷̛̦͓̜r̴̡͕̳̪

by wrapping every 4 [grapheme clusters](https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries).

## Installation

```sh
npm install wrap-segments
```

## API

None of the options are required, and you can omit the options entirely
to take all of the defaults.  The below example shows the default options:

```js
import {SegmentWrapper} from '../lib/index.js'

const w = new SegmentWrapper({
  escape: identityTransform, // Escape inputs before proessing
  indent: '', // Can be a string or number
  indentChar: ' ', // If indent is a number, repeat this that many times
  indentEmpty: false, // If the input is empty, still indent?
  indentFirst: true, // Indent the first line?
  isEmpty: /^\s*$/u, // Is a given text segment empty?  Only applies to non-wordLike segments.
  isNewline: /((?![\r\n\v\f\x85\u2028\u2029])\s)*[\r\n\v\f\x85\u2028\u2029]+(\s*)/gu, // Replace newlines matching this with newlineReplacement
  locale: DEFAULT_LOCALE, // Default is calculated by the JS runtime
  newline: '\n', // Insert this at the end of every line
  newlineReplacement: ' ', // What to replace isNewline with
  trim: true, // Trim whitespace from the end of the input
  width: 80, // In grapheme clusters, *including* indent
})

const wrapped = w.wrap('Lorem Ipsum...')
```

Generated [API documentation](https://hildjj.github.io/wrap-segments/) is
available.

## Command line

A CLI is available as a [separate package](cli/README.md).

## Caveats

- This hasn't been tested with enough languages.  Please submit an issue or PR if you speak Korean, a language that uses the Devanagari script, a language that uses a right-to-left script such as Arabic or Hebrew, etc.
- This does not implement the full [line breaking algorithm](https://unicode.org/reports/tr14/#Algorithm) from Unicode TR14.  I'm hoping that the `Intl.Segmenter` word boundaries are "close enough" for most cases.  It's hard to get access to all of the needed properties from the JS runtime without including version-specific Unicode data, which I don't want to do.  However, there are some rules in that algorithm that would be worth adding, with some careful thought.

---
[![Tests](https://github.com/hildjj/wrap-segments/actions/workflows/node.js.yml/badge.svg)](https://github.com/hildjj/wrap-segments/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/hildjj/wrap-segments/branch/main/graph/badge.svg?token=XQN6EXNJ9J)](https://codecov.io/gh/hildjj/wrap-segments)
