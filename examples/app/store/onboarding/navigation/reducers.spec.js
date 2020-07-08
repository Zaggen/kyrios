/* eslint-disable callback-return */
/* eslint-env jest */

import navigation from './index'

const curriedReducers = navigation.test.reducers

describe('navigation', () => {
  describe('.next()', () => {
    it('should increase the index', () => {
      const currentState = {
        steps: ['info', 'order', 'checkout'],
        index: 0,
      }
      const { next } = curriedReducers(currentState)

      const newState = next()

      expect(newState.index).toEqual(currentState.index + 1)
    })
  })
  describe('.prev()', () => {
    it('should decrease the index', () => {
      const currentState = {
        steps: ['info', 'order', 'checkout'],
        index: 2,
      }
      const { prev } = curriedReducers(currentState)

      const newState = prev()

      expect(newState.index).toEqual(currentState.index - 1)
    })
  })
})
