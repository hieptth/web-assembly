#!/bin/bash
set -e

FLAGS=(
    ../wasm/*.c
    -O2
    -o native.js
    -s INVOKE_RUN=0
    -s NO_EXIT_RUNTIME=1
    -s ALLOW_MEMORY_GROWTH=1
    -s EXPORTED_FUNCTIONS="[_randString, _malloc, _free, _accumulate, _getString]"
    -s EXPORTED_RUNTIME_METHODS="[setValue, getValue, addFunction, removeFunction]"
    -s RESERVED_FUNCTION_POINTERS=10
)

echo "FLAGS=${FLAGS[@]}"

emcc "${FLAGS[@]}"