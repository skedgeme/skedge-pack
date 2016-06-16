var path = require('path');
var webpackConfig = require('./lib/generators/webpackConfig.js');

// webpack imported from other config
var destination = 'app';
var main = 'main.jsx';
var source = '/home/kconst/skedge/widgets/bbb';
// var flags = 'server sourcemaps watch';
var flags = { sourcemaps: true };

webpackConfig = webpackConfig('/home/kconst/skedge/widgets/bbb/source', '/home/kconst/skedge/widgets/bbb/app', '/home/kconst/skedge/widgets/bbb/source/main.jsx', { server: true,
  sourcemaps: true,
  watch: true,
  minify: false,
  integration: false,
  unit: false,
  full: false,
  ignore: false,
  offline: false,
  verbose: false });

// modifying our webpack config
delete webpackConfig.resolve.alias.util;

webpackConfig.externals = {
  'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
};

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'es5-shim'],
    files: [
      './../babel-polyfill/dist/polyfill.min.js',
      '../../tests/unit/**/*.jsx'
    ],

    preprocessors: {
      // add webpack as preprocessor
      '../../source/**/*.jsx': ['webpack', 'sourcemap'],
      '../../tests/unit/**/*.jsx': ['webpack', 'sourcemap']
    },

    webpack : webpackConfig,
    /*webpack: {
      entry: 'babel-polyfill',
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /\.scss|\.sass/,
            loaders: [ 'style', 'css', 'csscomb', 'postcss', 'sass' ]
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
          },
          {
            test: /.*\.jsx$/,
            exclude: /(config\.js|(_[^\/]*)|(.*\.spec\.js)|(node_modules))$/,
            loader: 'babel-loader',
            query: {
              presets: [ 'react', 'es2015', 'stage-0' ],
              plugins: [ 'react-html-attrs', 'transform-class-properties' ],
            }
          },
          {
            test: /.*\.js$/,
            exclude: /(config\.js|(_[^\/]*)|(.*\.spec\.js)|(node_modules))$/,
            loader: 'babel-loader',
            query: {
              presets: [ 'es2015', 'stage-0' ],
            }
          },
          {
            test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
            loader: 'file?name=[name].[ext]'
          },
          {
            test: /.*\.json$/,
            loader: 'json-loader'
          }
        ]
      },
      externals: {
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      resolve: {
        alias: {
          userInterface: path.resolve( './source/userInterface' ),
          ui: path.resolve( './source/ui' ),
          data: path.resolve( './source/data' ),
          media: path.resolve( './source/media' ),
          utilities: path.resolve( './source/utilities' )/!*,
          util: path.resolve( './source/util/' )*!/
        },
        root: [
          path.resolve('./../skedge-interface'),
          path.resolve('./../shared')
        ]
      }
    },*/

    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },

    plugins: [
      'karma-es5-shim',
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],


    babelPreprocessor: {
      options: {
        presets: ['airbnb']
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
  })
};
