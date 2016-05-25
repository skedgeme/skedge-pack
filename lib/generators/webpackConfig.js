const

/* node modules */

// general
path = require('path'),
chalk = require('chalk'),

// postcss
scss = require('postcss-scss'),
autoprefixer = require('autoprefixer'),
cssnano = require('cssnano')({zindex: false}),

postcss = [ autoprefixer ],

// webpack
webpack = require('webpack'),
Offline = require('offline-plugin'),
webpackStrip = require('webpack-strip'),
ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = function webpackConfigGenerator ( source, destination, main, flags ) {

  if ( !!flags.minify ) {
    postcss.push( cssnano );
  }

  const

  config = {
    entry: './src',
    output: {
      path:       destination,
      publicPath: destination,
      filename:   main,
    },
    context: source,
    devtool: flags.sourcemaps ? 'source-map' : null,
    entry: {
      main
    },
    output: {
      path: destination,
      filename: 'app.js'
    },
    module: {
      preLoaders: [
        {
          test: /\.js/,
          loader: 'eslint',
          exclude: /node_modules/
        }
      ],
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
          test: /.*\.json$/,
          loader: 'json-loader'
        }
      ]
    },
    postcss: () => postcss,
    resolve: {
      alias: {
        userInterface: path.resolve( './source/userInterface' ),
        ui: path.resolve( './source/ui' ),
        data: path.resolve( './source/data' ),
        media: path.resolve( './source/media' ),
        utilities: path.resolve( './source/utilities' ),
        util: path.resolve( './source/util' )
      },
      root: [
        path.resolve('./../skedge-interface'),
        path.resolve('./../shared')
      ]
    },
    plugins: [
      new ProgressBarPlugin({
        format: 'webpack [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
      })
    ]
  };

  /* webpack elements */

  if ( flags.minify ) {

    config.module.loaders.push({
      test: /\.jsx?$/,
      loader: webpackStrip.loader(  'console.log',
                                    'console.error',
                                    'console.warn',
                                    'console.group',
                                    'console.groupEnd',
                                    'console.info',
                                    'console.table',
                                    'console.memory',
                                    'console.assert',
                                    'console.trace' )
    });

    config.plugins.push( new webpack.optimize.DedupePlugin() );
    config.plugins.push( new webpack.optimize.OccurenceOrderPlugin() );
    config.plugins.push( new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }) );

  }

  if ( flags.offline ) {

    config.plugins.push( new Offline() );

  }

  if ( flags.watch && flags.server ) {
    config.entry.app = [ 'webpack-dev-server/client?http://localhost:8080/' ];
    config.plugins.push( new webpack.HotModuleReplacementPlugin() );
  }

  return config;

};
