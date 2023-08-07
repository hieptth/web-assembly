FROM emscripten/emsdk

WORKDIR /src

COPY src/ /src/
COPY wasm/ /wasm/
COPY scripts/ /src/scripts/

RUN /src/scripts/build-custom.sh