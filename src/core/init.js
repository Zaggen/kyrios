// @flow
import combineReducers from './combineReducers'
import configureStore from './configureStore'
import initModels from './initModels'

type $Store<M> = {|
  ...$Exact<M>,
  getState: () => Object,
  subscribe: (state: Object) => void,
  dispatch: (...x: Object) => void,
  asyncReducers: Object,
  replaceReducer: Object,
|}

type $Conf<M> = {|
  models: M,
  middleware?: any[],
  reducers?: { [key: string]: any },
  customConf?: (store: $Store<M>) => void,
|}

const init = <M: { [key: string]: any }>(conf: $Conf<M>): $Store<M> => {
  const ctx = {}
  const initializedModels = initModels(conf.models, ctx)

  const modelReducers = Object.keys(initializedModels).reduce((obj, key) => {
    obj[key] = conf.models[key].reducer
    return obj
  }, {})
  // $FlowIgnore
  const reducers = { ...modelReducers, ...(conf.reducers || {}) }

  const reducer = combineReducers(reducers)
  return configureStore({
    ctx,
    initialState: {},
    reducer,
    middleware: conf.middleware || [],
    customConf: conf.customConf,
    models: conf.models,
  })
}

export default init
