// @flow
import { reduce, extend } from 'lodash'
import combineReducers from './combineReducers'

let useReduxDevTools = false

type $Reducer = (
  state: any,
  action: { type: string, payload?: any },
  rootState: { [key: string]: any },
) => any

const makeNestedModel = <
  M: { [key: string]: any },
  Def: {|
    models: M,
  |},
>(
  def: Def,
): ({|
  ...$Exact<$ObjMap<M, <T>(type: T) => T>>,
  reducer: $Reducer,
  resetState: (payload?: any) => Object,
  models: $PropertyType<Def, 'models'>,
  _init: () => void,
  _def: { getters: $PropertyType<Def, 'models'> },
|}) => {
  const nestedModel$ = {
    _name: (null: ?string),
    _initialized: false,
    useReduxDevTools(enable: boolean): void {
      useReduxDevTools = enable
    },
    _init: (modelPath: string[], parentCtx: { store: any }) => {
      const reducersHash = reduce<{}, { [key: string]: $Reducer }>(
        def.models,
        (obj, model, key: string) => {
          if (!model._initialized) {
            model.useReduxDevTools(useReduxDevTools)
            model._init([...modelPath, key], parentCtx)
          }
          if (model.reducer) {
            obj[key] = model.reducer
          }
          return obj
        },
        {},
      )

      const combinedReducer = combineReducers(reducersHash)

      const RESET_STATE = `${modelPath.join('/')}/RESET_STATE`
      const resetState = (payload: any) => ({ type: RESET_STATE, payload })

      const reducer = (state: any, action: any, rootState: any) => {
        if (action.type === RESET_STATE) {
          if (action.payload) {
            // With this we make sure that any update in structure
            // outside the session will be reset and won't cause
            // compatibility issues with new tree shape
            state = action.payload
          } else {
            state = undefined // eslint-disable-line
          }
        }
        return combinedReducer(state, action, rootState)
      }
      extend(nestedModel$, {
        ...def.models,
        reducer,
        resetState,
        models: def.models,
      })
    },
    test: {
      reducers: {},
      effects: {},
    },
  }

  // $FlowFixMe
  return nestedModel$
}

export default makeNestedModel
