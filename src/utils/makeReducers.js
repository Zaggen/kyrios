// @flow

const makeReducers = <Reducers: {}>(
  reducers: Reducers,
): (any => $Exact<$ObjMap<Reducers, <M>(method: M) => $Call<M, any>>>) => {
  return (state: any, intialState: any, rootState: any) =>
    (Object.keys(reducers).reduce((obj, key) => {
      obj[key] = reducers[key](state, intialState, rootState)
      return obj
    }, {}): any)
}

export default makeReducers
