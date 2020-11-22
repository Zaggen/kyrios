// @flow
import React from 'react'
import { useGetters, useStore } from '../hooks/store'

const Onboarding = () => {
  const [stepIndex] = useGetters(get => get.onboarding.navigation.index())
  const { onboarding } = useStore()
  const { prev, next } = onboarding.navigation

  return (
    <div>
      <p>Step: {stepIndex}</p>
      <button type="button" onClick={() => prev()} data-id="prev">
        Prev
      </button>
      <button type="button" onClick={() => next()} data-id="next">
        Next
      </button>
    </div>
  )
}

export default Onboarding
