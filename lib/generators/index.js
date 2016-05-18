'use strict';

const

/* node modules */
_     = require( 'lodash' ),
path  = require( 'path' ),
chalk = require( 'chalk' ),
glob  = require( 'glob' ),
fs    = require( 'fs-extra-promise' ),
watch = require( 'node-watch' ),

/* config generation */

defaultConfig = require( './defaultConfig.js' ),

generateIndexConfig = config => ({

  title: !!config.title ? config.title : defaultConfig.title,

  meta: _.union( config.meta, defaultConfig.meta ),
  links: _.union( config.links, defaultConfig.links ),
  scripts: _.union( config.scripts, defaultConfig.scripts ),

}),

/* buffer creation */

buildTitle = title => `<title>${title}</title>`,

buildTag = type => tagObj => {
  console.log( `\t[${chalk.magenta(type)}] ${ _.map( tagObj, ( value, attribute ) => attribute + ': ' + value ).join( ', ' ) }` );
  return `<${type} ${ _.map( tagObj, ( value, attribute ) => attribute + '="' + value + '"' ).join( ' ' ) }>`;
},

buildScriptTag = config => {

  const log = `\t[${chalk.magenta('script')}] `;

  if ( _.isString( config ) ) {

    console.log( log + config );

    return `<script type="application/javascript" src="${config}" ></script>`;

  } else if ( _.isFunction( config ) ) {

    console.log( log + config.toString() );

    return `<script type="application/javascript" >;(${config})();</script>`;

  } else if ( _.isObject( config ) ) {

    console.log( log + _.map( config, ( value, attribute ) => attribute + '="' + value + '"' ).join( ', ' ) )

    if ( !!config.module ) {

      return buildScript( scriptModules[config.module](config) );

    } else {

      return `<script ${ _.map( tagObj, ( value, attribute ) => attribute + '="' + value + '"' ).join( ' ' ) }></script>`;

    }

  } else {

    throw new TypeError( `buildScriptTag( config ) failed, the argument (${ config }) is not of an acceptable type` );

  }

},

getPaths = config => {

  let
    javascriptFiles = glob.sync( `${global.source}/**/*.js`, { ignore: _.union( config.ignore, [`${global.source}/**/_*.js`,`${global.source}/app.js`] ) } ),
    cssFiles = glob.sync( `${global.source}/**/*.css`, { ignore: _.union( config.ignore, [`${global.source}/**/_*.css`] ) } ),
    sassFiles = glob.sync( `${global.source}/**/*.sass`, { ignore: _.union( config.ignore, [`${global.source}/**/_*.sass`] ) } ),
    scssFiles = glob.sync( `${global.source}/**/*.scss`, { ignore: _.union( config.ignore, [`${global.source}/**/_*.scss`] ) } );

  sassFiles       = _.map( sassFiles, sassFile => sassFile.replace( 'sass', 'css' ) );
  scssFiles       = _.map( scssFiles, scssFile => scssFile.replace( 'scss', 'css' ) );
  cssFiles        = _.union( cssFiles, sassFiles, scssFiles );
  cssFiles        = _.map( cssFiles, cssFile => path.relative( global.source, cssfile ) );
  javascriptFiles = _.map( javascriptFiles, javascriptFile => path.relative( global.source, javascriptFile ) );

  return { css: cssFiles, js: javascriptFiles };

},

tab = tabs => _.repeat( '\t', tabs ),

createIndexBuffer = ( config, minify ) => {

  console.log(`Building ${chalk.cyan('index.html')}`)

  minify = !!minify ? 0 : 1;

  const
    index = [],
    paths = getPaths( config );

  index.push( '<html>' );
  index.push( `${tab(1*minify)}<head>` );

  if ( minify === 1 ) { index.push(''); }
  index.push( `${tab(2*minify)}<title>${config.title}</title>` );

  if ( minify === 1 ) { index.push(''); }

  _.forEach( config.meta, tagConfig => index.push( tab(2*minify) + buildTag( 'meta' )( tagConfig ) ) );

  if ( minify === 1 ) { index.push(''); }

  _.forEach( config.links, tagConfig => index.push( tab(2*minify) + buildTag( 'link' )( tagConfig ) ) );

  if ( minify === 1 ) { index.push(''); }

  _.forEach( paths.css, cssPath => index.push( tab(2*minify) + buildTag( 'links' )({ href: cssPath, rel: 'stylesheet', title: path.basename( cssPath, '.css' ) }) ) );

  if ( minify === 1 ) { index.push(''); }

  index.push( tab(2*minify) + '<style>' );
  index.push( tab(3*minify) + 'html,body,#root {' );
  index.push( tab(4*minify) + 'margin: 0;' );
  index.push( tab(4*minify) + 'padding: 0;' );
  index.push( tab(3*minify) + '}' );
  index.push( tab(2*minify) + '</style>' );

  if ( minify === 1 ) { index.push(''); }

  index.push( `${tab(1*minify)}</head>` );
  index.push( `${tab(1*minify)}<body>` );

  if ( minify === 1 ) { index.push(''); }

  index.push( tab(2*minify) + '<div id="root" ></div>' );

  if ( minify === 1 ) { index.push(''); }

  _.forEach( config.scripts, tagConfig => index.push( tab(2*minify) + buildScriptTag( tagConfig ) ) );

  if ( minify === 1 ) { index.push(''); }

  index.push( `${tab(1*minify)}</body>` );
  index.push( '</html>' );

  return index.join( minify === 1 ? '\n' : ''  );

},

buildIndexFile = ( destination, configPath, minify, ignore ) => () => {

  delete require.cache[require.resolve(configPath)];

  fs
    .outputFileAsync( `${destination}/index.html`, createIndexBuffer( generateIndexConfig( require(configPath) ), minify ) )
    .catch( error => {

      throw `buildIndexFile failed :  ${error}`;

      if ( ignore ) { process.exit(1); }

    } );

},

index = ( flags, configPath, destination ) => {

  const buildFunction = buildIndexFile( destination, configPath, flags.minify, flags.ignore );

  buildFunction();

  if ( flags.watch ) {

    watch( configPath, buildFunction );

  }

};

module.exports = index;
