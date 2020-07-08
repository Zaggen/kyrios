// @flow
import makeModel from 'core/makeModel'
import { type $Models } from '../../types'

const navigation = makeModel<$Models, 'navigation'>({
  state: {
    steps: ['info', 'order', 'checkout'],
    index: 0,
  },
  reducers: state => ({
    next: () => ({ ...state, index: state.index + 1 }),
    prev: () => ({ ...state, index: state.index - 1 }),
  }),
  queries: state => ({
    state: () => state,
    index: () => state.index,
  }),
})

export default navigation
