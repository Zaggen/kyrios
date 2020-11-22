// @flow
import makeModel from 'core/makeModel'
import { type $Models } from '../types'

const toaster = makeModel<$Models, 'toaster'>({
  state: [],
  reducers: state => ({
    pushMsg: msg => [...state, msg],
    popMsg: () => state.slice(0, state.length - 2),
  }),
  getters: state => ({
    state: () => state,
  }),
  async onMount(self) {
    await self.pushMsg('Initializing App')
  },
})

export default toaster
