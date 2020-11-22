// @flow
import { type $Model } from '../../../../src'

type $State = $ReadOnlyArray<string>

export type $ToasterModel = $Model<{|
  state: $State,
  reducers: {|
    pushMsg: (msg: string) => $State,
    popMsg: () => $State,
  |},
  getters: {|
    state: () => $State,
  |},
|}>
