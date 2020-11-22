// @flow
export const INIT_ACTION = '@@MODELS:INIT'

type $Register = {|
  effects: { [key: string]: (payload?: any, state: Object) => Promise<void> },
  listeners: {
    [key: string]: {|
      type: 'action' | 'callback',
      fns: ((...args: any[]) => void | (() => void))[],
    |},
  },
|}

export const register: $Register = {
  effects: {},
  listeners: {
    [INIT_ACTION]: { type: 'callback', fns: [] },
  },
}

export const gettersRegister = {
  _subscribers: [],
  subscribe(callback: Function) {
    this._subscribers.push(callback)
  },
  unsubscribe(callback: Function) {
    this._subscribers = this._subscribers.filter(
      originalCallback => originalCallback !== callback,
    )
  },
  notify(model: Object) {
    this._subscribers.forEach(callback => {
      callback(model)
    })
  },
}
