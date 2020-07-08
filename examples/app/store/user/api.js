// @flow
import delay from 'utils/delay'
import { type $User } from './types'

const api = {
  // eslint-disable-next-line no-unused-vars
  async signIn(payload: { +email: string, +password: string }): Promise<$User> {
    await delay(50)
    return {
      id: 1234,
      name: 'Andy',
      email: 'andy@test.com',
    }
  },
}

export default api
