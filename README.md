# wrap-segments

Wrap lines at word boundaries, using [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter).

## Installation

```sh
npm install wrap-segments
```

## API

```js
import {SegmentWrapper} from '../lib/index.js'

const w = new SegmentWrapper({
  width: 12,
  indent: 2
})
console.log(w.wrap('Lorem Ipsum...'))
```

Generated [API documentation](https://hildjj.github.io/wrap-segments/) is
available.

---
[![Tests](https://github.com/hildjj/wrap-segments/actions/workflows/node.js.yml/badge.svg)](https://github.com/hildjj/wrap-segments/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/hildjj/wrap-segments/branch/main/graph/badge.svg?token=XQN6EXNJ9J)](https://codecov.io/gh/hildjj/wrap-segments)
