// @flow
import { type $Model } from '../../../../../src'

export type $State = {|
  +steps: $ReadOnlyArray<string>,
  +index: number,
|}

export type $NavigationModel = $Model<{
  state: $State,
  reducers: {|
    next: () => $State,
    prev: () => $State,
  |},
  getters: {|
    state: () => $State,
  |},
}>
