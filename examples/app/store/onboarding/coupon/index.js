// @flow
import makeModel from 'core/makeModel'
import api from './api'
import { type $Models } from '../../types'

const coupon = makeModel<$Models, 'onboarding', 'coupon'>({
  state: {
    status: 'pending',
    data: null,
  },
  reducers: (_, initialState) => ({
    reset: () => initialState,
    setValidating: () => ({ status: 'validating', data: null }),
    setValid: data => ({ status: 'valid', data }),
    setInvalid: () => ({ status: 'invalid', data: null }),
    setError: () => ({ status: 'error', data: null }),
  }),
  effects: (self, store) => ({
    async validate(code): Promise<void> {
      try {
        self.setValidating()
        const data = await api.validateCoupon(code)
        self.setValid(data)
      } catch (err) {
        store.onboarding.navigation.next()
        store.onboarding.navigation.state()
        if (err.code === 'INVALID') {
          self.setInvalid()
          store.toaster.pushMsg('Your coupon is invalid')
        }
        self.setError()
        store.toaster.pushMsg('There was an error while validating your coupon')
      }
    },
  }),
  queries: state => ({
    state: () => state,
  }),
})

export default coupon
