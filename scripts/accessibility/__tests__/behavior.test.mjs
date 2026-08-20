import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyHorizontalOverflow, summarizeFocusSequence } from '../behavior.mjs'

test('horizontal overflow uses a two-pixel tolerance', () => {
  assert.equal(classifyHorizontalOverflow({ scrollWidth: 1000, clientWidth: 999 }), 'pass')
  assert.equal(classifyHorizontalOverflow({ scrollWidth: 1002, clientWidth: 1000 }), 'pass')
  assert.equal(classifyHorizontalOverflow({ scrollWidth: 1003, clientWidth: 1000 }), 'review')
})

test('focus sequence distinguishes empty traversal from repeated short cycles', () => {
  assert.equal(summarizeFocusSequence([]).status, 'no-focusable-control')
  assert.equal(summarizeFocusSequence(['a', 'b', 'c']).status, 'observed')
  assert.equal(summarizeFocusSequence(['a', 'b', 'a', 'b']).status, 'possible-cycle')
  assert.equal(summarizeFocusSequence(['a', 'b', 'c', 'a', 'b', 'd']).status, 'observed')
})
