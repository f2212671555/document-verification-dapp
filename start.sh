#! /bin/bash

echo "Building images"
docker-compose build --no-cache
# docker-compose build

# echo "Initializing docker containers"
docker-compose up -d ipfs
# docker-compose up -d client
# because ipfs: FetchError: request to http://127.0.0.1:5001/api/v0/add?stream-channels=true&progress=false failed, reason: connect ECONNREFUSED
# i give up start client
# start client from local not in docker

echo "install libraries"
cd client
# install libraries with package.json
npm install

echo "start service"
# start service at localhost:3000
node app.js