/* eslint-disable no-unused-vars */
// @flow
import delay from 'utils/delay'

const api = {
  async validateCoupon(
    code: string,
  ): Promise<{| +amount: number, +isPercentage: boolean |}> {
    await delay(50)
    return { amount: 15, isPercentage: true }
  },
}

export default api
