/* eslint-env jest */

import products from './index'

const curriedReducers = products.test.reducers

describe('products', () => {
  describe('.setLoading()', () => {
    it('should return the loading state', () => {
      const currentState = { status: 'pending', data: null }
      const { setLoading } = curriedReducers(currentState)

      const newState = setLoading()
      const expectedState = { status: 'loading', data: null }

      expect(newState).toEqual(expectedState)
    })
  })
  describe('.setLoaded()', () => {
    it('should return the loaded state', () => {
      const currentState = { status: 'loading', data: null }
      const { setLoaded } = curriedReducers(currentState)

      const payload = [
        {
          id: 345,
          name: 'iphone 11',
          price: 1000,
        },
      ]
      const newState = setLoaded(payload)
      const expectedState = { status: 'loaded', data: payload }

      expect(newState).toEqual(expectedState)
    })
  })
})
