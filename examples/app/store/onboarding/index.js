// @flow
import makeNestedModel from 'core/makeNestedModel'
import navigation from './navigation'
import coupon from './coupon'

const onboarding = makeNestedModel({
  models: { navigation, coupon },
})

export default onboarding
