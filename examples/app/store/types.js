// @flow
import { type $CartModel } from './cart/types'
import { type $ProductsModel } from './products/types'
import { type $ToasterModel } from './toaster/types'
import { type $UserModel } from './user/types'
import { type $OnboardingModel } from './onboarding/types'

export type $Models = {
  cart: $CartModel,
  products: $ProductsModel,
  toaster: $ToasterModel,
  user: $UserModel,
  onboarding: $OnboardingModel,
  coupon: $PropertyType<$OnboardingModel, 'coupon'>,
  navigation: $PropertyType<$OnboardingModel, 'navigation'>,
}
