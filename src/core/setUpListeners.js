// @flow
import { register } from './shared'

type $ListenTo = $ReadOnlyArray<
  | [
      {
        [key: string]: {
          (payload?: any): any,
          type: string,
          completedType?: string,
        },
      },
      string,
      string,
    ]
  | [string, string],
>

function setUpListeners(
  listenTo: $ListenTo,
  selfActions: { [type: string]: (payload?: any) => any },
) {
  listenTo.forEach(set => {
    let actionType: string
    let matchedAction: (payload?: any) => any

    if (typeof set[0] === 'string') {
      actionType = set[0]
      const foreingActionName = set[1]
      matchedAction = selfActions[foreingActionName]
    } else {
      const foreingModel = set[0]
      const foreingActionName = set[1]
      // $FlowIgnore set out of bounds
      const selfActionName = set[2]
      const foreingMethod = foreingModel[foreingActionName]
      actionType = foreingMethod.completedType || foreingMethod.type
      matchedAction = selfActions[selfActionName]
    }

    const entry = register.listeners[actionType] || {
      type: 'action',
      fns: [],
    }
    entry.fns.push(matchedAction)
    register.listeners[actionType] = entry
  })
}

export default setUpListeners
