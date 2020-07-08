/* eslint-disable */
// @flow
import { isArray } from 'lodash'
import { register, INIT_ACTION } from './shared'

const listenersMiddleware = (store: Object) => (next: Function) => (
  action: Object,
) => {
  // Here we make all the indirect calls from
  // listeners registered to the current action.
  const match = register.listeners[action.type]
  if (match) {
    if (action.type === INIT_ACTION) {
      match.fns.forEach(fn => {
        fn(action.payload)
      })
      //callListeners(match, action.payload)
    } else {
      // We want this to run after any reducer is done
      setTimeout(() => {
        if (match.type === 'action') {
          match.fns.forEach(actionCreator => {
            store.dispatch(actionCreator(action.payload))
          })
        } else {
          // callback type
          match.fns.forEach(fn => {
            fn(action.payload)
          })
        }
      }, 0)
    }
  }
  return next(action)
}

export default listenersMiddleware
