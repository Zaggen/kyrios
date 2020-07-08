// @flow

const makeEffects = <Effects: {}>(
  effects: Effects,
): ((
  state: Object,
  self: Object,
) => $ObjMap<Effects, <M>(method: M) => $Call<M, any, any>>) => {
  return (state, self) =>
    (Object.keys(effects).reduce((obj, key) => {
      obj[key] = effects[key](state, self)
      return obj
    }, {}): any)
}

export default makeEffects
