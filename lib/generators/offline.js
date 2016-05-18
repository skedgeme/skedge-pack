const

  fs = require( 'fs' ),

  buildWorker = ( files, hash ) => `
    this.addEventListener('install', function(event) {
      event.waitUntil(
        caches.open('${hash}').then(function(cache) {
          return cache.addAll([${files.join(',')}]]);
        })
      );
    });

    this.addEventListener('fetch', function(event) {
      var response;
      event.respondWith(caches.match(event.request).catch(function() {
        return fetch(event.request);
      }).then(function(r) {
        response = r;
        caches.open('v1').then(function(cache) {
          cache.put(event.request, response);
        });
        return response.clone();
      });
    });
  `,

  readDir = dirName =>
    new Promise( ( resolve, reject ) =>
      fs.readdir(dirName, (err, data) => err === null ? resolve(data) : reject(err) ) ),

  readFile = fileName =>
    new Promise( ( resolve, reject ) =>
      fs.readFile(fileName, (err, data) => err === null ? resolve(data) : reject(err) ) ),

  writeFile = ( fileName, data ) =>
    new Promise( ( resolve, reject ) =>
      fs.writeFile(fileName, data, (err, data) => err === null ? resolve(data) : reject(err) ) ),

  makeServiceWorkerFile = dest => readDir( dest )
    .then( files => !console.log('test') && writeFile( `${dest}/offline.js`, buildWorker( files, `V_${Date.now()}` ) ) );

module.exports = buildWorker;