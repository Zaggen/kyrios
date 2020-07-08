// @flow
import delay from 'utils/delay'

const api = {
  async fetchProducts() {
    await delay(50)
    return [
      {
        id: 345,
        name: 'iphone 11',
        price: 1000,
      },
      { id: 256, name: 'earPods', price: 200 },
    ]
  },
}

export default api
