// @flow

const initModels = <M: {}>(models: M, ctx: { store: any }): M => {
  Object.keys(models).forEach(name => {
    models[name]._init([name], ctx)
  })

  return models
}

export default initModels
