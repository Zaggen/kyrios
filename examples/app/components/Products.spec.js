/* eslint-env jest */

import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import withApp from '../withApp'
import Products from './Products'
import delay from 'utils/delay'

let container

const Component = withApp(Products)

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

it('can render async loaded products', async () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Component />, container)
  })
  const p = container.querySelector('p')
  expect(p.textContent).toBe('Loading...')

  await act(async () => {
    await delay(100)
  })
  const ul = container.querySelector('ul')
  expect(ul.childNodes.length).toBe(2)
})
