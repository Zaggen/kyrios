// @flow

export { default as init } from './core/init'
export { default as makeModel } from './core/makeModel'
export { default as makeNestedModel } from './core/makeModel'
export { default as makeEffects } from './utils/makeEffects'
export { default as makeReducers } from './utils/makeReducers'
export { default as makeQueries } from './utils/makeQueries'
export { default as makeHooks } from './utils/makeHooks'
export { default as delay } from './utils/delay'
export * from './hooks/useStoreContext'

export type $Model<+T> = {|
  _nested: {},
  effects: {},
  reducers: {},
  queries: {},
  state: any,
  ...$Exact<T>,
|}

export type $NestedModel<+T> = {|
  _nested: $Exact<$ObjMap<T, <M>(model: M) => $ReadOnly<$InitializedModel<M>>>>,
  effects: {},
  reducers: {},
  queries: {},
  state: any,
  //...T,

  ...$Exact<$ObjMap<T, <M>(model: M) => $ReadOnly<$InitializedModel<M>>>>,
|}

type $InitializedModel<+T> = {|
  ...$Exact<T>,
  +test: { reducers: (state: Object) => $PropertyType<T, 'reducers'> },
  +_def: T, // Used by other internal types
  ...$Exact<$PropertyType<T, 'reducers'>>,
  ...$Exact<$PropertyType<T, 'effects'>>,
  ...$Exact<$PropertyType<T, 'queries'>>,
|}
