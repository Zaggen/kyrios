// @flow
import * as React from 'react'

const useLocalContext = <D: {}>(data: D): D => {
  const [ctx] = React.useState({})
  Object.keys(data).forEach(key => {
    ctx[key] = data[key]
  })
  return (ctx: any)
}

export default useLocalContext
