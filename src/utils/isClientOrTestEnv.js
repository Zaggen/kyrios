/* eslint-disable */
// @flow

// When working with next.js is good to have something
// like this to avoid running into errors for trying
// to access globals that are not available on the server
const isClientOrTestEnv = (): boolean => {
  const processString = Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0,
  )
  const hasProcess = processString === '[object process]'
  if (hasProcess && process.env.NODE_ENV === 'test') {
    return true
  } else if (!hasProcess) {
    return true
  }
  return false
}

export default isClientOrTestEnv
