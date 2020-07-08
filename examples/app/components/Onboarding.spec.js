/* eslint-env jest */

import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import withApp from '../withApp'
import Onboarding from './Onboarding'

let container

const Component = withApp(Onboarding)

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

it.only('can render and update a counter', async () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Component />, container)
  })
  const p = container.querySelector('p')

  expect(p.textContent).toBe('Step: 0')

  const prevBtn = container.querySelector('button[data-id="prev"]')
  const nextBtn = container.querySelector('button[data-id="next"]')

  //Test second render and componentDidUpdate
  act(() => {
    // Next
    nextBtn.dispatchEvent(new MouseEvent('click', { bubbles: true })) // (+1) -> 1
    nextBtn.dispatchEvent(new MouseEvent('click', { bubbles: true })) // (+1) -> 2
    nextBtn.dispatchEvent(new MouseEvent('click', { bubbles: true })) // (+1) -> 3
    // Prev
    prevBtn.dispatchEvent(new MouseEvent('click', { bubbles: true })) // (-1) -> 2
    prevBtn.dispatchEvent(new MouseEvent('click', { bubbles: true })) // (-1) -> 1
  })

  expect(p.textContent).toBe('Step: 1')
})
