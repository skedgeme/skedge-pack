/* Karma webpack configuration */

const

{ watch } = global.flags,

{ source, destination, app } = global.paths;

module.exports = function(config) { config.set({

  frameworks: [ 'jasmine' ],

  files: [
    `${source}/*.spec.js`,
    `${source}/**/*.spec.js`
  ],

  preprocessors: {
    `${source}/*.spec.js`: ['webpack'],
    `${source}/**/*.spec.js`: ['webpack']
  },

  webpack: {
  },

  webpackMiddleware: {
    stats: {
      colors: true
    },
    noInfo: true
  },

  reporters: ['spec'],

  port: 8060,

  colors: true,

  logLevel: config.LOG_INFO,

  autoWatch: watch,

  browsers: ['PhantomJS'],

  captureTimeout: 60000,

  singleRun: true,

  plugins: [
    require('karma-jasmine'),
    require('karma-spec-reporter'),
    require('karma-phantomjs-launcher')
  ]

}); };