// @flow
import { reduce, get } from 'lodash'
import { gettersRegister } from './shared'

function makeGetters(conf: {|
  getters: any,
  model$: any,
  ctx: any,
  parentCtx: { store: any },
|}) {
  const getters = reduce(
    conf.getters({}, {}, {}),
    (acc, val, key: string) => {
      const proxiedGetter = (...args) => {
        const { ctx } = conf
        ctx.currentRootState = conf.parentCtx.store.getState()
        const rootState = ctx.currentRootState
        const modelState = get(rootState, ctx.modelPath)
        const curriedGetters = conf.getters(modelState, rootState, getters)
        const getter = curriedGetters[key]
        gettersRegister.notify(conf.model$)

        return getter(...args)
      }
      acc[key] = proxiedGetter
      return acc
    },
    {},
  )
  return getters
}

export default makeGetters
