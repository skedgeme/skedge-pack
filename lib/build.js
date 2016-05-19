'use strict';

const

/* node modules */

path      = require( 'path' ),
_         = require( 'lodash' ),
chalk     = require( 'chalk' ),
webpack   = require( 'webpack' ),
prompt    = require( 'prompt' ),
fs        = require( 'fs-extra-promise' ),
devServer = require( 'webpack-dev-server' ),
exec      = require( 'child_process' ).exec,

/* local modules */

index = require( './generators/index.js' ),

webpackConfig = require( './generators/webpackConfig.js' ),

/* utility functions */

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
    offline: false,
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

  return Promise.resolve();

  //console.log(_.map( jsonStats.modules, module => module.name ) );
  //console.log(jsonStats.assets);

  console.log( chalk.green( 'webpack completed' ) );
  console.log( );

},

/* compiler functions */

runCompiler = compiler => {

  console.log( '\tversion : compiler.run' );
  console.log();

  return new Promise( ( resolve, reject ) => compiler.run( ( errors, stats ) => resolve( { errors, stats } ) ) )
    .then( results => webpackResponseHandler( results.errors, results.stats  ) )
    .then( () => console.log( chalk.green( 'webpack completed' ) + '\n' ) )
    .catch( error => { throw error; } )

},

watchCompiler = compiler => {

  console.log( '\tversion : compiler.watch' );
  console.log();

  compiler.watch( { aggregateTimeout: 300, poll: true }, webpackResponseHandler );

},

serveCompiler = ( compiler, destination, main ) => {

  console.log( '\tversion : devServer' );
  console.log( '\tport    : 8060' );
  console.log();

  const server = new devServer( compiler, {
    contentBase: destination,
    hot: true,
    port: 8060,
    colors: true,
    filename: main,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    publicPath: '/',
    stats: { colors: true }
  } );

  server.listen(8060);

},

build = options => {

  const
    source = path.join( process.cwd() , options.source || 'source' ),
    destination = path.join( process.cwd() , options.destination || 'app' ),
    main = path.join( source , options.main || 'main.js' ),
    configPath = path.join( source , options.config || 'config.js' ),
    config = require( configPath ),
    flags = parseFlags( options.flags ),
    compiler = webpack( webpackConfig( source, destination, main, flags ) );

  console.log( );
  console.log( chalk.green.bold( 'skedge-pack: ' ) + chalk.green( config.title ) );
  console.log( '\tflags  : ' + _.map( flags, ( status, flag ) => !status ? chalk.gray( flag ) : chalk.green( flag ) ).join( ' ' ) );
  console.log( '\tsource : ' + chalk.cyan( source ) );
  console.log( '\tdest   : ' + chalk.cyan( destination ) );
  console.log( '\tmain   : ' + chalk.cyan( main ) );
  console.log( '\tconfig : ' + chalk.cyan( configPath ) );
  console.log( );

  index( flags, configPath, destination );

  console.log( );
  console.log( 'Running ' + chalk.green('webpack') );

  const build = !flags.watch ? runCompiler :
                !flags.server ? watchCompiler :
                serveCompiler;

  build( compiler, destination, main );

},

skeleton = () => {
  console.log( chalk.green.bold( 'skedge-pack:' ) + chalk.green.bold( ' building skeleton' ) );
  return fs.readdirAsync( `${__dirname}/skeleton` )

    .then( files => !console.log(files) &&
      Promise.all( files.map( filePath =>
        fs.copyAsync( path.join( `${__dirname}/skeleton`, filePath ),  path.join( process.cwd(), filePath ) ) ) ) )

    .then( () => console.log( chalk.green( '\tfinished' ) ) )

    .catch( error => { throw error; } )
}

module.exports = options => options.skeleton ? skeleton() : build( options );
