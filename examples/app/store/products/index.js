// @flow
import makeModel from 'core/makeModel'
import api from './api'
import { type $Models } from '../types'

const products = makeModel<$Models, 'products'>({
  state: {
    status: 'pending',
    data: null,
  },
  reducers: () => ({
    setLoading: () => ({ status: 'loading', data: null }),
    setLoaded: data => ({ status: 'loaded', data }),
    setError: () => ({ status: 'error', data: null }),
  }),
  effects: (self, store) => ({
    async fetch(): Promise<void> {
      try {
        self.setLoading()
        const data = await api.fetchProducts()
        self.setLoaded(data)
      } catch (err) {
        self.setError()
        store.toaster.pushMsg('Error while fetching products')
      }
    },
  }),
  getters: state => ({
    state: () => state,
    data: () => state.data,
  }),
})

export default products
