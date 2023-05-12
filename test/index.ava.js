import {SegmentWrapper} from '../lib/index.js'
import test from 'ava'

// "foo bar" zalgofied.
const zalgo = '\u{0066}\u{0335}\u{0329}\u{0323}\u{033a}\u{0333}\u{0353}\u{0356}\u{0324}\u{032d}\u{0347}\u{0306}\u{0304}\u{0357}\u{030c}\u{0308}\u{0301}\u{033f}\u{0314}\u{0352}\u{0342}\u{034b}\u{0308}\u{0301}\u{0308}\u{0301}\u{030c}\u{030d}\u{030e}\u{033e}\u{035c}\u{00f6}\u{0336}\u{0327}\u{0327}\u{0322}\u{034d}\u{0354}\u{0348}\u{032d}\u{0330}\u{0348}\u{034d}\u{031d}\u{0355}\u{033a}\u{031d}\u{033a}\u{032b}\u{0301}\u{033e}\u{0308}\u{0350}\u{030b}\u{0346}\u{0313}\u{0342}\u{034b}\u{033e}\u{0358}\u{035d}\u{0360}\u{006f}\u{0336}\u{0325}\u{0329}\u{0317}\u{0339}\u{0318}\u{0325}\u{0349}\u{032d}\u{034c}\u{0342}\u{0345}\u{0020}\u{0336}\u{0328}\u{0322}\u{0354}\u{0333}\u{0313}\u{0300}\u{033e}\u{0311}\u{030f}\u{0313}\u{0301}\u{0309}\u{0302}\u{0300}\u{033f}\u{035b}\u{031a}\u{0062}\u{0337}\u{0327}\u{0325}\u{034d}\u{0325}\u{031c}\u{035a}\u{031f}\u{0355}\u{0311}\u{0308}\u{0301}\u{0307}\u{034a}\u{0303}\u{0301}\u{0301}\u{0300}\u{0312}\u{0357}\u{034a}\u{030e}\u{035d}\u{0061}\u{0337}\u{031b}\u{0326}\u{0353}\u{031c}\u{0316}\u{0339}\u{0349}\u{032a}\u{034c}\u{0304}\u{030d}\u{0313}\u{0302}\u{034b}\u{0308}\u{0301}\u{0300}\u{034c}\u{0308}\u{0301}\u{030e}\u{0307}\u{0315}\u{0315}\u{035d}\u{0360}\u{0072}\u{0334}\u{0321}\u{0355}\u{0333}\u{032a}\u{032e}\u{0355}\u{0313}\u{0313}\u{0346}\u{0308}\u{0301}\u{0304}\u{0305}\u{0314}\u{0314}\u{0360}\u{0360}'

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
  t.is(s.wrap(zalgo), `${zalgo}\n`)
})

test('wrap', t => {
  const s = new SegmentWrapper({
    width: 4,
  })
  t.is(s.wrap('foo bar'), 'foo\nbar\n')
  t.is(s.wrap('foo   bar'), 'foo\nbar\n')
  t.is(s.wrap('abcdefg'), 'abcdefg\n')
  t.is(s.wrap('abcdefg bar'), 'abcdefg\nbar\n')
  const z = s.wrap(zalgo)
  t.is(z.split('\n').length, 3)
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
