// @flow

// Proxy for window.localStorage
const localStoragePrxy = {
  getItem: (key: string) => {
    try {
      const serializedState = window.localStorage.getItem(key)
      if (serializedState === null) {
        return undefined // eslint-disable-line
      }
      return JSON.parse(serializedState) // eslint-disable-line
    } catch (err) {
      return undefined // eslint-disable-line
    }
  },
  setItem: (key: string, data: any) => {
    try {
      const serializedState = JSON.stringify(data)
      window.localStorage.setItem(key, serializedState)
    } catch (err) {
      // Ignore write errors.
    }
  },
}

export default localStoragePrxy

// Safari private browsing does not let you set data, so we
// monkey patch the Storage prototype with a NOOP
// to avoid getting QUOTA_EXCEEDED_ERR errors
const run = () => {
  if (typeof localStorage === 'object') {
    try {
      window.localStorage.setItem('localStorage_test_123', 1)
      window.localStorage.removeItem('localStorage_test_123')
    } catch (err) {
      Storage.prototype._setItem = Storage.prototype.setItem // eslint-disable-line
      Storage.prototype.setItem = () => {}
    }
  }
}

run()
