// @flow
import React from 'react'

type $Store = {|
  getState: () => any,
  subscribe: () => any,
  dispatch: any => any,
  asyncReducers: Object,
  [modelName: string]: Object,
|}

export const storeCtx = React.createContext<?$Store>(null)

export const StoreProvider = <+S: $Store>(props: {|
  store: S,
  children: React$Node,
|}) => (
  <storeCtx.Provider value={props.store}>{props.children}</storeCtx.Provider>
)

export const useStoreContext = () => {
  const val = React.useContext(storeCtx)

  return val
}
