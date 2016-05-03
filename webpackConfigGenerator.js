const

/* node modules */

// general
path = require('path'),
chalk = require('chalk'),

// postcss
scss = require('postcss-scss'),
autoprefixer = require('autoprefixer'),
cssnano = require('cssnano'),

postcss = [ autoprefixer ],

// webpack
webpack = require('webpack'),
WebpackStrip = require('webpack-strip'),
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
    devtool: flags.sourcemap ? 'inline-sourcemap' : null,
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
          test: /.*\.jsx?$/,
          exclude: /(config\.js|(_[^\/]*)|(.*\.spec\.js))$/,
          loader: 'babel-loader',
          query: {
            presets: [ 'react', 'es2015', 'stage-0' ],
            plugins: [ 'react-html-attrs', 'transform-class-properties' ],
          }
        },
        {
          test: /.*\.json$/,
          loader: 'json-loader'
        }
      ]
    },
    postcss: () => postcss,
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
      loader: WebpackStrip.loader(  'console.log',
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

  if ( flags.watch && flags.server ) {
    config.entry.app = [ 'webpack-dev-server/client?http://localhost:8080/' ];
    config.plugins.push( new webpack.HotModuleReplacementPlugin() );
  }

  return config;

};
