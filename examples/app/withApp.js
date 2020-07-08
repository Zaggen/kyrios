// @flow
import React from 'react'
import { StoreProvider } from '../../src'
import store from './store'

// $FlowFixMe
const withApp = Component => {
  // $FlowFixMe
  return props => (
    // $FlowFixMe
    <StoreProvider store={store}>
      <Component {...props} />
    </StoreProvider>
  )
}

export default withApp
