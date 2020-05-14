const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, './dest'),
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    host: '160.251.9.228'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },

  plugins: [new VueLoaderPlugin(), new CopyPlugin([{ from: './public' }])]
}

