// @flow
const makeGetters = <Finders: {}>(
  getters: Finders,
): ((
  state: Object,
  rootState: Object,
) => $ObjMap<Finders, <M>(method: M) => $Call<M, any, any>>) => {
  const keys = Object.keys(getters)
  return (state, rootState) =>
    keys.reduce((obj, key) => {
      obj[key] = getters[key](state, rootState)
      return obj
    }, {})
}

export default makeGetters
