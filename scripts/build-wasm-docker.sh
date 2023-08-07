#!/bin/bash
set -e

# build docker image
docker build -t wasm-app:0.2.1 .

# create container
id=$(docker create --name wasm-app wasm-app:0.2.1)

# copy files from container
docker cp $id:/src/native.js ./wasm/
docker cp $id:/src/native.wasm ./wasm/

# remove container
docker rm -v $id

# delete old docker image if exists
if docker image inspect wasm-app:0.2.1 > /dev/null 2>&1; then
    docker rmi wasm-app:0.2.1
fi