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
  width: 12
})
console.log(w.wrap('Lorem Ipsum...'))
```

---