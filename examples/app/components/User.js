// @flow
import React from 'react'
import { useQuery, useCall } from '../hooks/store'

const User = () => {
  const [user] = useQuery(qry => qry.user.state())
  const [signIn, { status }] = useCall(call => call.user.signIn)

  React.useEffect(() => {
    signIn({ email: 'andy@test.com', password: '123' })
  }, [])

  return status === 'processed' && user ? (
    <span>{user.name}</span>
  ) : (
    <p>Signing in...</p>
  )
}

export default User
