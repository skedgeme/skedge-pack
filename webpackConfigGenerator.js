const

/* node modules */

// general
path = require('path'),
chalk = require('chalk'),

// webpack
webpack = require('webpack'),
WebpackStrip = require('webpack-strip'),
ProgressBarPlugin = require('progress-bar-webpack-plugin');


module.exports = function webpackConfigGenerator ( source, destination, main, flags ) {

  const

  config = {
    entry: './src',
    output: {
      path:     'builds',
      filename: 'bundle.js',
    },
    context: source,
    devtool: flags.sourcemap ? "inline-sourcemap" : null,
    entry: {
      main
    },
    output: {
      path: destination,
      filename: "app.js"
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
          loaders: ["style", "css", "sass"]
        },
        {
          test: /\.jsx?$/,
          exclude: /(config\.js|(_[^\/]*)|(.*\.spec\.js))$/,
          loader: 'babel-loader',
          query: {
            presets: [ 'react', 'es2015', 'stage-0' ],
            plugins: [ 'react-html-attrs', 'transform-class-properties' ],
          }
        }
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
