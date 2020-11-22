// @flow
import { type $Model } from '../../../../../src'

export type $State = $NotValidState | $ValidState

type $NotValidState = {|
  +status: 'pending' | 'validating' | 'invalid' | 'error',
  +data: null,
|}

type $ValidState = {|
  +status: 'valid',
  +data: $Data,
|}

export type $Data = {|
  +amount: number,
  +isPercentage: boolean,
|}

export type $CouponModel = $Model<{
  state: $State,
  reducers: {|
    reset: () => $State,
    setValidating: () => $State,
    setValid: (data: $Data) => $State,
    setInvalid: () => $State,
    setError: () => $State,
  |},
  effects: {|
    validate: (code: string) => Promise<void>,
  |},
  getters: {|
    state: () => $State,
  |},
}>
