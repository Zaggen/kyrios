// @flow
import makeHooks, { type $useGetters, type $UseEffect } from 'utils/makeHooks'
import store from '../store'

const hooks = makeHooks(store)

type $Models = typeof store

export const useGetters: $useGetters<$Models> = hooks.useGetters

export const useEffect: $UseEffect<$Models> = hooks.useEffect

export const useStore = hooks.useStore
