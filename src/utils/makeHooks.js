// @flow
import makeUseGetters, { type $useGetters as $GettersHook } from '../hooks/makeUseGetters'
import makeUseCall, { type $UseCall as $CallHook } from '../hooks/makeUseCall'
import { useStoreContext } from '../hooks/useStoreContext'

export type $useGetters<+M> = $GettersHook<M>
export type $UseCall<+M> = $CallHook<M>

const makeHooks = <Models: {}>(
  models: Models,
): ({|
  useGetters: $Call<typeof makeUseGetters, Models>,
  useCall: $Call<typeof makeUseCall, Models>,
  useStore: () => Models,
|}) => {
  return {
    useCall: makeUseCall(models),
    useGetters: makeUseGetters(models),
    // $FlowFixMe
    useStore: useStoreContext,
  }
}

export default makeHooks
