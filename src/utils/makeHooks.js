// @flow
import makeUseQuery, { type $UseQuery as $QryHook } from '../hooks/makeUseQuery'
import makeUseCall, { type $UseCall as $CallHook } from '../hooks/makeUseCall'
import { useStoreContext } from '../hooks/useStoreContext'

export type $UseQuery<+M> = $QryHook<M>
export type $UseCall<+M> = $CallHook<M>

const makeHooks = <Models: {}>(
  models: Models,
): ({|
  useQuery: $Call<typeof makeUseQuery, Models>,
  useCall: $Call<typeof makeUseCall, Models>,
  useStore: () => Models,
|}) => {
  return {
    useCall: makeUseCall(models),
    useQuery: makeUseQuery(models),
    // $FlowFixMe
    useStore: useStoreContext,
  }
}

export default makeHooks
