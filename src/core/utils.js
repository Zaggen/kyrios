// @flow
import delay from 'utils/delay'

type Store = { subscribe: Function, getState: Function }

export function waitUntil(
  store: Store,
  fn: Object => boolean,
  timeout?: number,
): Promise<void> {
  return new Promise(resolve => {
    const unsusbscribe = store.subscribe(state => {
      if (fn(store.getState())) {
        unsusbscribe()
        resolve()
      }
      if (timeout != null) {
        setTimeout(() => {
          unsusbscribe()
          resolve()
        }, timeout)
      }
    })
  })
}

export default waitUntil

export async function retry<
  R,
  Conf: {
    maxRetries: number,
    call: () => Promise<R>,
    check: R => boolean,
    onRetry?: () => Promise<void>,
  },
>(conf: Conf): Promise<null | R> {
  let res = null
  for (let retriesLeft = conf.maxRetries; retriesLeft > 0; retriesLeft--) {
    res = await conf.call() // eslint-disable-line no-await-in-loop
    if (conf.check(res)) {
      break
    }
    if (conf.onRetry) {
      await conf.onRetry() // eslint-disable-line no-await-in-loop
    } else {
      await delay(100) // eslint-disable-line no-await-in-loop
    }
  }
  return res
}
