// @flow
import init from 'core/init'
import models from './models'

const store = init<typeof models>({ models })

export default store
