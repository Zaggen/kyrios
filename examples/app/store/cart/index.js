// @flow
import makeModel from 'core/makeModel'
import { type $Models } from '../types'

const cart = makeModel<$Models, 'cart'>({
  state: {},
  reducers: state => ({
    add: id => ({ ...state, [id]: state[id] ? state[id] + 1 : 1 }),
    remove: id => {
      const newState = { ...state }
      delete newState[id]

      return newState
    },
  }),
  getters: state => ({
    state: () => state,
  }),
})

export default cart
