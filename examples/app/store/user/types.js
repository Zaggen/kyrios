// @flow
import { type $Model } from '../../../../src'

export type $User = {|
  +id: number,
  +email: string,
  +name: string,
|}

export type $State = ?{|
  +id: number,
  +email: string,
  +name: string,
|}

export type $UserModel = $Model<{
  state: $State,
  reducers: {|
    set: (user: $User) => $State,
    unset: () => $State,
  |},
  effects: {|
    signIn: (payload: {| +email: string, +password: string |}) => Promise<void>,
  |},
  queries: {|
    state: () => $State,
    name: () => ?$PropertyType<$User, 'name'>,
  |},
}>
