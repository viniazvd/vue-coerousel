'use strict'

const Vue = require('rollup-plugin-vue')
const autoprefixer = require('autoprefixer')

module.exports = {
  js: 'buble',
  input: 'src/Carousel.vue',
  format: [ 'es', 'cjs', 'umd' ],
  plugins: [
    Vue({
      css: false,
      style: {
        trim: false,
        postcssPlugins: [
          autoprefixer({ browsers: [ '> 0.000001%' ] })
        ]
      }
    })
  ]
}
