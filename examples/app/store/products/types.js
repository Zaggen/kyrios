// @flow
import { type $Model } from '../../../../src'

export type $State = $NotLoadedState | $LoadedState

type $NotLoadedState = {|
  +status: 'pending' | 'loading' | 'error',
  +data: null,
|}

type $LoadedState = {|
  +status: 'loaded',
  +data: $Data,
|}

export type $Data = {|
  +id: number,
  +name: string,
  +price: number,
|}[]

export type $ProductsModel = $Model<{
  state: $State,
  reducers: {|
    setLoading: () => $NotLoadedState,
    setLoaded: (data: $Data) => $LoadedState,
    setError: () => $NotLoadedState,
  |},
  effects: {|
    fetch: () => Promise<void>,
  |},
  getters: {|
    state: () => $State,
    data: () => ?$Data,
  |},
}>
