// @flow
import { reduce, get } from 'lodash'
import { queriesRegister } from './shared'

function makeQueries(conf: {|
  queries: any,
  model$: any,
  ctx: any,
  parentCtx: { store: any },
|}) {
  const queries = reduce(
    conf.queries({}, {}, {}),
    (acc, val, key: string) => {
      const proxiedQuery = (...args) => {
        const { ctx } = conf
        ctx.currentRootState = conf.parentCtx.store.getState()
        const rootState = ctx.currentRootState
        const modelState = get(rootState, ctx.modelPath)
        const curriedQueries = conf.queries(modelState, rootState, queries)
        const query = curriedQueries[key]
        queriesRegister.notify(conf.model$)

        return query(...args)
      }
      acc[key] = proxiedQuery
      return acc
    },
    {},
  )
  return queries
}

export default makeQueries
