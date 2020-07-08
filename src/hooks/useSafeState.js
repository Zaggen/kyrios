// @flow
import * as React from 'react'

const useSafeState = <S>(
  initialState: S,
): [S, (payload: S) => void | ((payload: (S) => S) => void)] => {
  let mounted = true

  const [state, setState] = React.useState<S>(initialState)

  const safeSetState = (payload: typeof state) => {
    if (mounted) {
      setState(payload)
    }
  }

  React.useEffect(() => {
    return () => {
      mounted = false
    }
  }, [])

  return [state, safeSetState]
}

export default useSafeState
