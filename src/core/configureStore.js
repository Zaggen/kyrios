// @flow
import { createStore, applyMiddleware, compose } from 'redux'
import { merge } from 'lodash'
import listenersMiddleware from './listenersMiddleware'

// type $Models = {||}
// type $Store = {
//   getState: () => Object,
//   subscribe: (state: Object) => void,
//   dispatch: (...x: Object) => void,
//   asyncReducers: Object,
//   replaceReducer: Object,
// }

const configureStore = (conf: {
  reducer: Function,
  initialState: any,
  middleware: any[],
  models: Object,
  customConf: ?(store: any) => void,
  ctx: any,
}) => {
  const store = createStore(
    conf.reducer,
    conf.initialState,
    compose(applyMiddleware(listenersMiddleware), ...conf.middleware),
  )
  merge(store, conf.models)
  conf.ctx.store = store
  store.dispatch({ type: '@@MODELS:INIT' })
  conf.customConf && conf.customConf(store)

  return store
}

// export async function injectAsyncReducer(
//   key: string,
//   asyncReducer: Function,
// ): Promise<void> {
//   const store = await storeProxy.get()
//   merge(store.asyncReducers, zipObjectDeep([key], [asyncReducer]))
//   const reducer = createReducer(store.asyncReducers)
//   store.replaceReducer(reducer)
// }

export default configureStore
