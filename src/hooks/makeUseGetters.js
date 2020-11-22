// @flow
import * as React from 'react'
import { isEqual } from 'lodash'
import isClientOrTestEnv from 'utils/isClientOrTestEnv'
import { gettersRegister } from '../core/shared'
import useCtx from './useLocalContext'

export type $useGetters<+Models> = <R: any>(
  mapper: ($Get<Models>) => R,
) => [R, {}]

type $Get<+Models> = $ReadOnly<
  $ObjMap<$ParsedModels<Models>, <M>(model: M) => $ExtractFirstLevelGet<M>>, //
>

type $ParsedModels<+Models> = $Diff<Models, { getState: any, subscribe: any }>
type $ExtractFirstLevelGet<+M> = $ReadOnly<
  $PropertyType<$PropertyType<M, '_def'>, 'getters'>,
>

const makeUseGetters = <Models: { [name: string]: any }>(
  models: Models,
): $useGetters<Models> => {
  return mapper => {
    const [state, setState] = React.useState(() => {
      // We get the current state and subscribe
      // to changes from the models used in the get
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

export default makeUseGetters
