# skedge-pack
Our webpack build system for developing react projects.

## Installing

Copy the `default.json` file into your empty directory and rename it `package.json`. Afterward run `npm run setup`. Once that has completed run `npm run dev` for development and `npm run prod` for a production build.

When running `npm run dev` use the url `https://0.0.0.0:8060`.

When running `npm run prod` the files will be built to `/app`.

## Features

Javascript is linted, parsed and converted allowing to write cutting edge react & es6.

Scss, css, sass is linted, parsed and converted.

#### Build Flags
| Flag        | Effect |
|-------------|--------|
| server      | Tells the build to start a server |
| source      | Tells the build to generate source-maps |
| clear       | Clears out the build folder |
| minify      | Minifies the output file/s |
| concat      | Concats the output files |
| test        | Runs all tests |
| unit        | Runs the unit tests |
| offline     | Build service workers and manifests for offline use |
| sourcemaps  | Builds sourcemaps for all compiled javascript files |
| integration | Runs the integration tests |
| watch       | Watch files and run changes |
| full        | Clear build folder and run complete build |
| ignore      | Keep building even if errors are found  |

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
