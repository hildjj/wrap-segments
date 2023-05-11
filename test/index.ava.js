import {SegmentWrapper} from '../lib/index.js'
import test from 'ava'

test('defaults', t => {
  const s = new SegmentWrapper()
  t.truthy(s)
  t.is(s.wrap('foo'), 'foo\n')
  t.is(s.wrap('foo   '), 'foo\n')
  t.is(s.wrap('foo bar'), 'foo bar\n')
  t.is(s.wrap('foo\nbar'), 'foo bar\n')
  t.is(s.wrap('foo  \nbar'), 'foo bar\n')
  t.is(s.wrap('foo\n  bar'), 'foo bar\n')
  t.is(s.wrap('foo  \n  bar'), 'foo bar\n')
  t.is(s.wrap('foo   bar'), 'foo   bar\n')
  t.is(s.wrap(''), '\n')
  t.is(s.wrap('   '), '\n')
})

test('wrap', t => {
  const s = new SegmentWrapper({
    width: 4,
  })
  t.is(s.wrap('foo bar'), 'foo\nbar\n')
  t.is(s.wrap('foo   bar'), 'foo\nbar\n')
  t.is(s.wrap('abcdefg'), 'abcdefg\n')
  t.is(s.wrap('abcdefg bar'), 'abcdefg\nbar\n')
})

test('indentEmpty', t => {
  const s = new SegmentWrapper({
    indentEmpty: true,
    indent: 3,
  })
  t.is(s.wrap(''), '   \n')
})

test('trim', t => {
  const s = new SegmentWrapper({
    trim: false,
    width: 4,
  })

  // Eve
  t.is(s.wrap('foo    '), 'foo\n    \n')
  t.is(s.wrap('f  '), 'f  \n')
})
