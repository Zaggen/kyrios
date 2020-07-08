/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import withApp from '../withApp'
import User from './User'
import delay from 'utils/delay'

let container

const Component = withApp(User)

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

it('can render an async loaded user', async () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Component />, container)
  })

  const p = container.querySelector('p')
  expect(p.textContent).toBe('Signing in...')

  await act(async () => {
    await delay(100)
  })
  const userName = container.querySelector('span')
  expect(userName.textContent).toBe('Andy')
})
