// @flow
import { pickBy, mapValues, isObject } from 'lodash'

type $RootState = { [key: string]: any }

type $Action = { type: string, payload?: any }

type $State = any

type $Reducer = (state: $State, action: $Action, rootState: $RootState) => any

type $ReducersMapObject = {
  [key: string]: $Reducer,
}

/* eslint-disable no-console */

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
const combineReducers = (reducers: $ReducersMapObject) => {
  const finalReducers = pickBy(reducers, val => typeof val === 'function')

  Object.keys(finalReducers).forEach(key => {
    const reducer = finalReducers[key]

    const type = Math.random()
      .toString(36)
      .substring(7)
      .split('')
      .join('.')
    if (typeof reducer(undefined, { type }) === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
          `You must return the ` +
          `current state for any unknown actions, unless it is undefined, ` +
          `in which case you must return the initial state, regardless of the ` +
          `action type. The initial state may not be undefined.`,
      )
    }
  })

  const defaultState = mapValues(finalReducers, () => undefined)
  let stateShapeVerified

  return function combination(
    // Since we can nest multiple combinations, it's possible
    // that the first argument is not necessarily the root state
    // but the parent state, hence the naming.
    rootOrReducerState: $RootState = defaultState,
    action: $Action,
    rootState: ?any,
  ): $RootState {
    const finalState = mapValues(finalReducers, (reducer, key, obj) => {
      const reducerState = rootOrReducerState[key]
      const newState = reducer(
        reducerState,
        action,
        rootState || rootOrReducerState,
      )
      if (typeof newState === 'undefined') {
        throw new Error(getErrorMessage(key, action))
      }
      return newState
    })

    if (process.env.NODE_ENV !== 'production') {
      if (!stateShapeVerified) {
        verifyStateShape(rootOrReducerState, finalState)
        stateShapeVerified = true
      }
    }

    return finalState
  }
}

export default combineReducers

function getErrorMessage(key, action) {
  const actionType = action && action.type
  const actionName = (actionType && `"${actionType.toString()}"`) || 'an action'

  return (
    `Reducer "${key}" returned undefined handling ${actionName}. ` +
    `To ignore an action, you must explicitly return the previous state.`
  )
}

function verifyStateShape(initialState, currentState) {
  const reducerKeys = Object.keys(currentState)

  if (reducerKeys.length === 0) {
    console.error(
      `Store does not have a valid reducer.
      Make sure the argument passed to combineReducers is an
      object whose values are reducers.`,
    )
    return
  }

  if (!isObject(initialState)) {
    console.error(
      `initialState has unexpected type of "${
        {}.toString.call(initialState).match(/\s([a-z|A-Z]+)/)[1]
      }". Expected initialState to be an object with the following keys: "${reducerKeys.join(
        ', ',
      )}"`,
    )
    return
  }

  const unexpectedKeys = Object.keys(initialState).filter(
    key => reducerKeys.indexOf(key) < 0,
  )

  if (unexpectedKeys.length > 0) {
    console.error(
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
        `"${unexpectedKeys.join('", "')}" in initialState will be ignored. ` +
        `Expected to find one of the known reducer keys instead: "${reducerKeys.join(
          '", "',
        )}"`,
    )
  }
}
