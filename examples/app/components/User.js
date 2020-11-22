// @flow
import React from 'react'
import { useGetters, useEffect } from '../hooks/store'

const User = () => {
  const [user] = useGetters(get => get.user.state())
  const [signIn, { status }] = useEffect(call => call.user.signIn)

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
