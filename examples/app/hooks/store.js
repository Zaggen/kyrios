// @flow
import makeHooks, { type $UseQuery, type $UseCall } from 'utils/makeHooks'
import store from '../store'

const hooks = makeHooks(store)

type $Models = typeof store

export const useQuery: $UseQuery<$Models> = hooks.useQuery

export const useCall: $UseCall<$Models> = hooks.useCall

export const useStore = hooks.useStore
