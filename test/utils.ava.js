import {findGrapheme} from '../lib/utils.js'
import test from 'ava'

test('findGrapheme', t => {
  const g = [
    {index: 0},
    {index: 10},
  ]
  g[10] = {index: 20}
  t.is(findGrapheme(g, 10, 1), 1)
  t.throws(() => findGrapheme(g, -1, 1))
})
