'use strict'

const Vue = require('rollup-plugin-vue')

module.exports = {
  js: 'buble',
  input: 'src/index.js',
  format: [ 'es', 'cjs', 'umd' ],
  plugins: [
    Vue()
  ]
}
