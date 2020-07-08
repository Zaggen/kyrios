// @flow
const makeQueries = <Finders: {}>(
  queries: Finders,
): ((
  state: Object,
  rootState: Object,
) => $ObjMap<Finders, <M>(method: M) => $Call<M, any, any>>) => {
  const keys = Object.keys(queries)
  return (state, rootState) =>
    keys.reduce((obj, key) => {
      obj[key] = queries[key](state, rootState)
      return obj
    }, {})
}

export default makeQueries
