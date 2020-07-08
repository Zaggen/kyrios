// @flow

function makeReducer(conf: {|
  initialState: any,
  actionsMap: any,
  reducers: any,
  eventsManager: any,
|}) {
  return (
    state = conf.initialState,
    action: { type: string, payload?: any },
    rootState: any,
  ) => {
    const methodName = conf.actionsMap[action.type]

    if (methodName && conf.reducers) {
      const pureMethods = conf.reducers(state, conf.initialState, rootState)
      const matchedMethod = pureMethods[methodName]

      if (!matchedMethod) {
        return state
      }
      const newState = matchedMethod(action.payload)

      conf.eventsManager.queueNotification()

      return newState
    }
    return state
  }
}

export default makeReducer
