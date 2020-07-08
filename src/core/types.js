// @flow
/* eslint-disable */

/**********************************
 *****       MakeModel        *****
 *********************************/

export type $MakeModel = $MakeFullModel & $MakePureModel

/*********************************
 *****    FULL_MODEL_TYPES   ******
 *********************************/

export type $MakeFullModel = <Models, K>(def: {|
  state: $ModelProp<Models, K, 'state'>,
  reducers: $Reducers<Models, K>,
  effects: $Effects<Models, K>,
  queries: $Queries<Models, K>,
  listenTo?: $FullModelListeners<$Model<Models, K>>,
  onMount?: $OnMount<Models, K>,
|}) => $InitializedModel<$Model<Models, K>>

type $FullModelListeners<M> = $List<
  [
    string,
    $Keys<{
      ...$PropertyType<M, 'reducers'>,
      ...$PropertyType<M, 'effects'>,
    }>,
  ],
>

/*********************************
 *****    PURE_MODEL_TYPES   ******
 *********************************/

export type $MakePureModel = <Models: {}, K>(def: {|
  state: $ModelProp<Models, K, 'state'>,
  reducers: $Reducers<Models, K>,
  queries: $Queries<Models, K>,
  listenTo?: $FullModelListeners<$Model<Models, K>>,
  onMount?: $OnMount<Models, K>,
|}) => $InitializedPureModel<$Model<Models, K>>

type $PureModelListeners<M> = $List<
  [string, $Keys<$PropertyType<M, 'reducers'>>],
>

/**********************************
 *****     UTILITY TYPES      *****
 *********************************/

type $Model<Models, Name> = $ElementType<Models, Name>

type $ModelProp<+Models, +Name, +Prop> = $ElementType<
  $ElementType<Models, Name>,
  Prop,
>

type $Reducers<Models, K> = (
  state: $ElementType<$ElementType<Models, K>, 'state'>,
  initialState: $ElementType<$ElementType<Models, K>, 'state'>,
  rootState: $ReadOnly<$ObjMap<Models, <M>(m: M) => $PropertyType<M, 'state'>>>,
) => $ModelProp<Models, K, 'reducers'>

type $Effects<Models, K> = (
  self: $InitializedModel<$Model<Models, K>>,
  store: $Store<Models>,
) => $ModelProp<Models, K, 'effects'>

type $Queries<+Models, +K> = (
  state: $ElementType<$ElementType<Models, K>, 'state'>,
  rootState: $ReadOnly<$ObjMap<Models, <M>(m: M) => $PropertyType<M, 'state'>>>,
  qry: $ReadOnly<$ObjMap<Models, <M>(m: M) => $PropertyType<M, 'queries'>>>,
) => $ReadOnly<$ModelProp<Models, K, 'queries'>>

type $OnMount<Models, K> = (
  self: $InitializedModel<$Model<Models, K>>,
  store: $Store<Models>,
) => void | Promise<void>

type $InitializedModel<T> = {|
  +test: { reducers: (state: Object) => $PropertyType<T, 'reducers'> },
  +_def: T, // Used by other internal types
  +_nested: $PropertyType<T, '_nested'>, // Used by other internal types
  ...$Exact<$PropertyType<T, '_nested'>>,
  ...$Exact<$PropertyType<T, 'reducers'>>,
  ...$Exact<$PropertyType<T, 'effects'>>,
  ...$Exact<$PropertyType<T, 'queries'>>,
|}

type $InitializedPureModel<T> = {|
  +test: { reducers: (state: Object) => $PropertyType<T, 'reducers'> },
  +_def: T, // Used by other internal types
  +_nested: $PropertyType<T, '_nested'>, // Used by other internal types
  ...$Exact<$PropertyType<T, 'reducers'>>,
  ...$Exact<$PropertyType<T, 'queries'>>,
|}

type $List<+T> = $ReadOnlyArray<T>

type $Store<+Models> = {|
  ...$Exact<$ObjMap<Models, <M>(model: M) => $ReadOnly<$InitializedModel<M>>>>,
  getState: () => Object,
  dispatch: (action: any) => Promise<void>,
  subscribe: (listener: Function) => Function,
|}
