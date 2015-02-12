module.exports = {
  cache: true,

  watch: true,

  entry: {
    main: ['./main.js']
  },

  output: {
    filename: '[name].js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader' },
    ]
  }
};