// @flow
import makeUseGetters, { type $useGetters as $GettersHook } from '../hooks/makeUseGetters'
import makeUseEffect, { type $UseEffect as $CallHook } from '../hooks/makeUseEffect'
import { useStoreContext } from '../hooks/useStoreContext'

export type $useGetters<+M> = $GettersHook<M>
export type $UseEffect<+M> = $CallHook<M>

const makeHooks = <Models: {}>(
  models: Models,
): ({|
  useGetters: $Call<typeof makeUseGetters, Models>,
  useEffect: $Call<typeof makeUseEffect, Models>,
  useStore: () => Models,
|}) => {
  return {
    useEffect: makeUseEffect(models),
    useGetters: makeUseGetters(models),
    // $FlowFixMe
    useStore: useStoreContext,
  }
}

export default makeHooks
