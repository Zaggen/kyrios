// @flow
import { snakeCase, extend, throttle } from 'lodash'
import isClientOrTestEnv from 'utils/isClientOrTestEnv'
import { type $MakeModel } from './types'
import { register, INIT_ACTION } from './shared'
import makeQueries from './makeQueries'
import makeReducer from './makeReducer'
import setUpListeners from './setUpListeners'

let useReduxDevTools = false

const makeModel: $MakeModel = <D: any>(def: D) => {
  const ctx = {
    currentRootState: null,
    modelPath: [],
  }

  const model$ = {
    _name: (null: ?string),
    // We wrap the initialization logic inisde
    // an init methid, so we can modify the modelPath
    // before we run the init code, this gives us
    // the flexibility of having nested Models and
    // eventually not having to request the prefix key
    _initialized: false,
    useReduxDevTools(enable: boolean): void {
      useReduxDevTools = enable
    },
    _init: (modelPath: string[], parentCtx: { store: any }) => {
      ctx.modelPath = modelPath
      const eventsManager = makeEventsManager({ parentCtx, ctx, model$ })
      // model$._unshiftModelPath(basePath)
      // modelPath = [...basePath]
      model$._name = modelPath.join('/')

      const {
        actions,
        actionsMap,
        methodsMap,
        effectsMethodsNames,
      } = getMappings(def, modelPath)

      const reducer = def.reducers
        ? makeReducer({
            initialState: def.state,
            actionsMap,
            eventsManager,
            reducers: def.reducers,
          })
        : null

      if (def.notifySubscribersOnActionTypes) {
        enableReduxLegacyMode({ def, eventsManager })
      }

      const queries: Object = def.queries
        ? makeQueries({
            queries: def.queries,
            model$,
            ctx,
            parentCtx,
          })
        : {}

      // Here we mutate the original model to add
      // all the methods required to make it work
      extend(model$, {
        actions,
        ...queries,
        ...eventsManager,
        reducer: def.reducer || reducer,
        _initialized: true,
        ...buildMethods({
          methodsMap,
          effectsMethodsNames,
          parentCtx,
          def,
          model$,
        }),
      })

      // eventsManager.init(parentCtx)

      if (def.listenTo) {
        // TODO: Check what is the side-effect
        // of using this timeout in the server
        setTimeout(() => {
          setUpListeners(def.listenTo, actions)
        }, 0)
      }

      if (def.onMount && isClientOrTestEnv()) {
        addOnMountCallback({ onMount: def.onMount, parentCtx, model$ })
      }
    },
    test: {
      reducers: def.reducers || {},
      effects: def.effects || {},
    },
  }

  return model$
}

export default makeModel

function makeEventsManager({ parentCtx, ctx, model$ }) {
  const fetchModelData = makeFetcher(model$)
  const self = {
    _initialized: false,
    _waiting: false,
    _subscribers: [],
    // init(parentCtx: { store: any }) {
    init() {
      self._initialized = true
      //setTimeout(() => {
      parentCtx.store.subscribe(() => {
        // For time travel debugging purposes we need
        // to bypass the lock check and always notify
        if (self._waiting || useReduxDevTools) {
          ctx.currentRootState = parentCtx.store.getState()
          self.notify()
        }
      })
      //}, 0)
    },
    subscribe(callback: Function) {
      if (!self._initialized) {
        self.init()
      }
      self._subscribers.push(callback)
      if (model$.fetch) {
        fetchModelData()
      }

      return () => self.unsubscribe(callback)
    },
    unsubscribe(callback: Function): void {
      this._subscribers = self._subscribers.filter(
        subscriberCallback => subscriberCallback !== callback,
      )
    },
    queueNotification() {
      self._waiting = true
    },
    notify(model: Object): void {
      // Since notify is called before the state
      // is actually returned, we need to defer the
      // call of the subscribers so that the reducer
      // has time to actually update the state but
      // doing so with setTimout/requestAnimationFrame
      // would result on a noticeable delay in the ui
      // to react to these changes, so we hook in into
      // the actual redux notifier to know when the
      // reducer is done so we can have the same effect
      // as subscribing to the store but only notifying
      // model changes to useQuery
      //const usubscribe = storeProxy.subscribe(() => {
      self._subscribers.forEach(subscriberCallback => {
        subscriberCallback(model)
      })
      self._waiting = false
    },
  }
  return self
}

// This enables auto fetching the data for
// a model if it gets queried and it has
// support for fetching while being on the
// pending state, this way we can avoid
// having to manually fetch the models
function makeFetcher(model$) {
  return throttle(
    () => {
      if (!isClientOrTestEnv()) {
        return
      }
      const state = model$.state ? model$.state() : null
      if (state?.status === 'pending') {
        model$.fetch()
      }
    },
    8000,
    { leading: true },
  )
}

// This enables legacy models to call notify which is used
// by the useQuery hook to get re-executed, since here we
// are using a reducer function we have to listen to all
// the possible action types instead of a fine grain control
// that we have over our custom reducers.
function enableReduxLegacyMode({ def, eventsManager }) {
  Object.keys(def.notifySubscribersOnActionTypes).forEach(key => {
    const actionType = def.notifySubscribersOnActionTypes[key]
    const entry = register.listeners[actionType] || {
      type: 'callback',
      fns: [],
    }
    entry.fns.push(() => {
      eventsManager.notify()
    })
    register.listeners[actionType] = entry
  })
}

function addOnMountCallback({ onMount, parentCtx, model$ }) {
  const entry = register.listeners[INIT_ACTION]
  entry.fns.push(() => {
    onMount(model$, parentCtx.store)
  })
}

function getMappings(def, modelPath) {
  const pureMethodsNames = def.reducers
    ? Object.keys(def.reducers({}, {}, {}))
    : []
  const effectsMethodsNames = def.effects
    ? Object.keys((def: any).effects({}, {}))
    : []
  const methodsNames = [...pureMethodsNames, ...effectsMethodsNames]

  return methodsNames.reduce(
    (obj, key) => {
      const reduxActionType = snakeCase(key).toUpperCase()
      const type = [...modelPath, reduxActionType].filter(v => v).join('/')
      obj.actions[key] = payload => ({ type, payload })
      obj.actions[key].type = type
      if (effectsMethodsNames.includes(key)) {
        obj.actions[key].completedType = `@@${type}_COMPLETED`
      }
      obj.actionsMap[type] = key
      obj.methodsMap[key] = type
      return obj
    },
    { actions: {}, actionsMap: {}, methodsMap: {}, effectsMethodsNames },
  )
}

function buildMethods({
  methodsMap,
  effectsMethodsNames,
  parentCtx,
  def,
  model$,
}) {
  return Object.keys(methodsMap).reduce((obj, key) => {
    const actionType = methodsMap[key]

    if (effectsMethodsNames.includes(key)) {
      // Effects are called directly, not with
      // redux actions, since when using time-travel
      // debugging we would manipulate the state
      // with the pure actions, so calling the effects
      // could result in affecting the state outside the
      // replay. We do dispatch some actions for logging
      // purposes but they are not captured by the model.
      obj[key] = async (payload: ?any) => {
        const effects = def.effects(model$, parentCtx.store)
        const effect = effects[key]
        parentCtx.store.dispatch({
          type: `@@${actionType}_CALLED`,
          payload,
        })
        try {
          // console.log(`@@${actionType}_LOADING`)
          await effect(payload)
          parentCtx.store.dispatch({ type: `@@${actionType}_COMPLETED` })
          // console.log(`@@${actionType}_COMPLETED`)
        } catch (err) {
          // console.log(`@@${actionType}_COMPLETED`, err)
          parentCtx.store.dispatch({
            type: `@@${actionType}_COMPLETED`,
            payload: { err },
          })

          throw err
        }
      }
    } else {
      // Pure events
      obj[key] = async (payload: ?any) => {
        return parentCtx.store.dispatch({ type: actionType, payload })
      }
    }

    return obj
  }, {})
}
