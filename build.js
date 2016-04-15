'use strict';

const

/* node modules */

path = require( 'path' ),
_ = require( 'lodash' ),
chalk = require( 'chalk' ),
webpack = require( 'webpack' ),

/* local files */

index = require( './index.js' ),

webpackConfigGenerator = require( './webpackConfigGenerator.js' ),


parseFlags = flags => {

  if ( _.isString( flags ) ) {

    flags = flags.split( ' ' );

  }

  if ( !flags ) {
    flags = [];
  }

  flags = _.zipObject( flags, _.fill( Array( flags.length ), true ) );

  if ( !!flags.test ) {
    delete flags.test;
    flags.unit = true;
    flags.integration = true;
  }

  return _.defaults( flags, {
    server: false,
    sourcemaps: false,
    minify: false,
    integration: false,
    unit: false,
    watch: false,
    full: false,
    ignore: false,
    verbose: false,
  } );

},

handlewebpackErrors = errors => {
  console.log(chalk.red.bold('webpack has returned errors.'));
  _.forEach( errors, error => console.log( error ) );
},

handlewebpackWarnings = errors => {
  console.log(chalk.yellow.bold('webpack has returned warnings.'));
  _.forEach( errors, error => console.log( error ) );
},

webpackResponseHandler = ( skedge_pack_error, stats ) => {

  const jsonStats = stats.toJson();

  if ( jsonStats.errors.length > 0 ) {
    return handlewebpackErrors(jsonStats.errors);
  }

  if ( jsonStats.warnings.length > 0 ) {
    handlewebpackWarnings(jsonStats.warnings);
  }

  console.log(_.keys(jsonStats));
  let modules = _.chain( jsonStats.modules )
    .map( module => module.name )
    .groupBy( moduleName => path.dirname( moduleName ) )
    .value();

  //modules = _.mapValues( modules, module => _.map( module, filePath => path.basename( filePath ) ) )
  console.log('webpack Modules')
  _.forEach( modules, ( module, modulePath ) => {
    console.log( '  ' + chalk.magenta( modulePath ) );
    const moduleLog = ['   '];
    let logLine = 0;
    _.forEach( module, filePath => {
      filePath = path.basename( filePath );
      if ( moduleLog[logLine].length + filePath.length <= 120 ) {

        moduleLog[logLine] += ' ' + filePath;

      } else {

        moduleLog[++logLine] = '\t' + filePath;

      }

    } );
    console.log( chalk.cyan( moduleLog.join( '\n' ) ) );
  } );

  //console.log(_.map( jsonStats.modules, module => module.name ) );
  //console.log(jsonStats.assets);

  console.log( chalk.green( 'webpack completed' ) );
  console.log( );

};



module.exports = function skedge_pack ( options ) {

  const
    source = path.join( process.cwd() , options.source || 'source' ),
    destination = path.join( process.cwd() , options.destination || 'app' ),
    main = path.join( source , options.main || 'main.js' ),
    configPath = path.join( source , options.config || 'config.js' ),
    config = require( configPath ),
    flags = parseFlags( options.flags ),
    compiler = webpack( webpackConfigGenerator( source, destination, main, flags ) );

  console.log( );
  console.log( chalk.green.bold( `Deadalus > ${config.title}` ) );
  console.log( '\tflags  : ' + _.map( flags, ( status, flag ) => !status ? chalk.gray( flag ) : chalk.green( flag ) ).join( ' ' ) );
  console.log( '\tsource : ' + chalk.cyan( source ) );
  console.log( '\tdest   : ' + chalk.cyan( destination ) );
  console.log( '\tmain   : ' + chalk.cyan( main ) );
  console.log( '\tconfig : ' + chalk.cyan( configPath ) );
  console.log( )

  index( flags, configPath, destination );

  console.log( );
  console.log( 'Running ' + chalk.green('webpack') );

  if ( !flags.watch ) {

    console.log( '\tversion : compiler.run' );
    console.log();
    compiler.run( webpackResponseHandler );

  } else if ( !flags.server ) {

    console.log( '\tversion : compiler.watch' );
    console.log();

    compiler.watch({ // watch options:
      aggregateTimeout: 300, // wait so long for more changes
      poll: true // use polling instead of native watchers
    }, webpackResponseHandler );

  } else if ( flags.watch && flags.server ) {

    console.log( '\tversion : webpackDevServer' );
    console.log( '\tport    : 8060' );
    console.log();

    const server = new webpackDevServer( compiler, {
      contentBase: destination,
      hot: true,
      port: 8060,
      colors: true,
      filename: "bundle.js",
    } );

    server.listen(8060);

  }


}

/* index.html file */

//webpack-dev-server --content-base source --inline --hot
