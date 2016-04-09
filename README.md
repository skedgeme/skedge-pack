# skedge-pack
Our webpack build system for developing react projects.

## Dev Goals
* Setting up a project takes as little time as possible
* All files are source-mapped to make bug solving as easy as possible
* Heavily commented source code to make further development as easy as possible
* linting enforces a consistant style across programmers (js & css)
* Use a bundle system that makes reusing code as easy as possible
* Use hot module reloading to make dev speed incredibly fast.
* Unit testing is as easy as adding a *.spec.js file
* Selenium tests are as easy as adding a *.sel.js file
* Build system can be used both programmatically and in the command line.

## Production Goals
* Must pass all tests to properly deploy.
* Heavily minified files ( js, css, images etc. )
* JS is broken down into easy to load chunks to maximize page load speed.

## Build System Design
This is meant to be both a design explanation as well as a project planning section.

### Modules


#### webpack
* [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) **@TODO**

#### Javascript
* Eslint
  * Idiomatic JS code standard
  * React
* Uglify2
* Babel
  * ES 2015
  * React JSX
* source maps
* [webpack-strip](https://github.com/yahoo/strip-loader)
* [jasmine](https://www.npmjs.com/package/es6-karma-jasmine-webpack-boilerplate) w/ [karma](https://github.com/webpack/karma-webpack) unit testing **@TODO**
* [selenium](https://github.com/shanewilson/react-webpack-example/blob/master/nightwatch.json) w/ [nightwatch](http://nightwatchjs.org/) ui testing **@TODO**

#### CSS
* sass/scss compiler
* [csscomb](https://github.com/koistya/csscomb-loader) for code style **@TODO**
* [autoprefixing](https://github.com/passy/autoprefixer-loader) **@TODO**
* minification **@TODO**

#### Assets
* [minification](https://github.com/tcoopman/image-webpack-loader)

### Options
```
({

  // flags can be either a string or an Array
  flags: 'watch source clear minify',
  // or
  flags: [ 'watch', 'source', 'clear', 'minify' ],

  // source determines the folder that the build system looks in for files
  // defaults to 'source'
  source: 'src',

  // destination determines the folder that the build system adds files to
  // defaults to 'app'
  destination: 'application',

  // main is the path to the main module file that the entire project is going to be built off
  // the project assumes that it is inside the folder specified by 'source'
  // defaults to 'main.js'
  main: 'app.js'


  // config points to the file that is used to configure the index.html file
  // the project assumes that it is inside the folder specified by 'source'
  // defaults to 'config.js'
  config: 'project.js'

})
```


### Programmatic Build
In order to install skedge-pack for programmatic use run `npm install --save skedgeme/skedge-pack`.
```
const spack = require('skedge-pack');

spack({

  //...options

});

```
or a very minimalist build approach
```
(require('skedge-pack'))({
  //...options
});
```


### Command Line
Flags can either be called individually through  '--' and '-' commands or as groups through complete strings. Other options are identified by there equals sign `configVarName=config`.

Flags : `spack --server --source --concat source=source destination=app`

Build : `spack dev source=source destination=app`


#### Build Flags
| Flag | Shorthand | Effect |
|------|-----------|--------|
| --server | -s | Tells the build to start a server |
| --source | -so | Tells the build to generate source-maps |
| --clear | -c | Clears out the build folder |
| --minify | -m | minifies the output file/s |
| --concat | -cc | concats the output files |
| --test | -t | Runs all tests |
| --selenium | -ts | Runs the selenium tests |
| --phantom | -tp | Runs the phantom tests |
| --watch | -w | Watch files and run changes |
| --full | -f | Clear build folder and run complete build |
| --ignore | -i | Keep building even if errors are found  |


#### Builds
These should be run using `npm run {build name}`, which runs `node bin/build.js {flags}`.

| Name | Flags | Purpose |
|------|-----------|--------|
| local | `-s -so -t -w` | Run on your local machine |
| **dev** | `-so -t -w` | Run on your local machine on your VM |
| prod-dev | `-c -m -cc -t -w` | Use to test production on the vm |
| prod-local | `-c -m -cc -t -w -s` | Use to test production on the local |
| **prod** | `-c -m -cc -t` | Use to build production |
