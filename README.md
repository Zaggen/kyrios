Experimental state management library. Alpha state.

* Basic Model

```
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
  // Getters are equivalent to redux selectors, but without
  // the need to manually pass them the state at runtime
  getters: state => ({
    state: () => state,
  }),
})

export default user
```