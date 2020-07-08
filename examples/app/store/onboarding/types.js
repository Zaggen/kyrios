// @flow
import { type $NestedModel } from '../../../../src'
import { type $NavigationModel } from './navigation/types'
import { type $CouponModel } from './coupon/types'

export type $OnboardingModel = $NestedModel<{
  navigation: $NavigationModel,
  coupon: $CouponModel,
}>
