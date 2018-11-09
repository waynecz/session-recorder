const merge = require('webpack-merge')
const baseWebpackConfig = require('./base')
const webpack = require('webpack')

const productionConfig = merge(baseWebpackConfig, {
  mode: 'production',

  optimization: {
    minimize: false
  },
  
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: true
    })
  ],  

  devtool: 'source-map'
})

module.exports = productionConfig