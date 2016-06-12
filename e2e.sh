#!/bin/bash

set -o errexit # Exit on error

(java -jar selenium-server.jar &)

while ! nc -z 127.0.0.1 4444; do sleep 1; done

./node_modules/.bin/wdio wdio.conf.js &