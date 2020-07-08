// @flow
import { type $Model } from '../../../../src'

type $State = { [productId: number]: number | void }

export type $CartModel = $Model<{|
  state: $State,
  reducers: {|
    add: (id: number) => $State,
    remove: (id: number) => $State,
  |},
  queries: {|
    state: () => $State,
  |},
|}>
