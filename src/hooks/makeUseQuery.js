// @flow
import * as React from 'react'
import { isEqual } from 'lodash'
import isClientOrTestEnv from 'utils/isClientOrTestEnv'
import { gettersRegister } from '../core/shared'
import useCtx from './useLocalContext'

export type $UseQuery<+Models> = <R: any>(
  mapper: ($Qry<Models>) => R,
) => [R, {}]

type $Qry<+Models> = $ReadOnly<
  $ObjMap<$ParsedModels<Models>, <M>(model: M) => $ExtractFirstLevelQry<M>>, //
>

type $ParsedModels<+Models> = $Diff<Models, { getState: any, subscribe: any }>
type $ExtractFirstLevelQry<+M> = $ReadOnly<
  $PropertyType<$PropertyType<M, '_def'>, 'getters'>,
>

const makeUseQuery = <Models: { [name: string]: any }>(
  models: Models,
): $UseQuery<Models> => {
  return mapper => {
    const [state, setState] = React.useState(() => {
      // We get the current state and subscribe
      // to changes from the models used in the qry
      const modelsToObserve = []
      const subscriber = model => {
        modelsToObserve.push(model)
      }
      // We subscribe before we call any query
      //  which would trigger the notification of subscribers.
      gettersRegister.subscribe(subscriber)
      const data = mapper(models)
      // We don't want to keep subscribed so we
      // unsubscribe inmediately since we have
      // the data in modelsToObserve
      gettersRegister.unsubscribe(subscriber)

      return {
        modelsToObserve,
        data,
      }
    })

    const ctx = useCtx({ state })

    React.useEffect(() => {
      if (isClientOrTestEnv()) {
        const updateState = () => {
          const newData = mapper(models)

          if (!isEqual(ctx.state.data, newData)) {
            setState({ ...ctx.state, data: newData })
            ctx.state.data = newData
          }
        }

        // We subscribe once to all the models that were used
        // to query data on the first run of the hook
        const unsubscribeList = state.modelsToObserve.map(model =>
          model.subscribe(updateState),
        )
        return () => {
          // Unsubscribe to all the watched models
          unsubscribeList.forEach(unsubscribe => unsubscribe())
        }
      }
      return () => {}
    }, [])

    return [state.data, {}]
  }
}

export default makeUseQuery
