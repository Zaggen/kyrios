// @flow
import makeModel from 'core/makeModel'
import api from './api'
import { type $Models } from '../types'

const user = makeModel<$Models, 'user'>({
  state: null,
  reducers: () => ({
    set: payload => payload,
    unset: () => null,
  }),
  effects: (self, store) => ({
    async signIn(payload): Promise<void> {
      try {
        const data = await api.signIn(payload)
        self.set(data)
      } catch (err) {
        self.unset()
        store.toaster.pushMsg('Failed SignIn, please try again')
      }
    },
  }),
  getters: state => ({
    state: () => state,
    name: () => state?.name,
  }),
})

export default user
