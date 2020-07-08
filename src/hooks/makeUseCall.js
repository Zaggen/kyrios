// @flow
import * as React from 'react'
import useSafeState from './useSafeState'

export type $UseCall<+Models> = <Method: any => Promise<void>>(
  fn: (models: $ReadOnly<Models>) => Method,
  inputs?: any[],
) => [Method, $State]

type $State = {|
  status: 'pending' | 'processing' | 'processed' | 'error',
  data: any,
  error: ?any,
|}

const makeUseCall = <Models: { [name: string]: any }>(
  models: Models,
): $UseCall<Models> => {
  return (mapper, inputs? = []) => {
    const asyncFn = mapper(models)

    const initialState = {
      status: 'pending',
      error: null,
      data: null,
    }
    const [state, setState] = useSafeState<$State>(initialState)

    const handler: any => Promise<void> = async payload => {
      try {
        setState({ status: 'processing', error: null, data: null })
        const res = await asyncFn(payload)
        setState({ status: 'processed', error: null, data: res })
      } catch (err) {
        setState({ status: 'error', error: err, data: null })
      }
    }

    // Reset state based on input change
    React.useEffect(() => {
      if (state.status !== 'pending') {
        setState(initialState)
      }
    }, inputs)

    return [handler, state]
  }
}

export default makeUseCall
