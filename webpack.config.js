/* eslint-env node */

// This is only for using path aliases with eslint
const webpack = require('webpack')

module.exports = {
  plugins: [new webpack.NamedModulesPlugin()],
  resolve: {
    modules: ['src'],
  },
}
