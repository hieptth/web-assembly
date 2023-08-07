function loadWasm(message) {
  let libPath = message.data.libPath;
  Module = {
    locateFile: function (wasm) {
      const wasmFile = `native.wasm`;
      return libPath + wasmFile;
    },
  };
  self.importScripts(libPath + "native.js");
  Module.onRuntimeInitialized = () => {
    self.postMessage({ type: "wasmLoaded" });
    console.log("wasm loaded");
  };
}

function run_wasm(input) {
  var arr = new Int32Array(input);

  for (var i = 0; i < input; i++) {
    arr[i] = i * 2;
  }

  var ptr = encodeArray(arr, input, 4);
  var sum = Module._accumulate(ptr, input);

  // clean up
  Module._free(ptr);

  self.postMessage(sum);
  self.close();
}

function encodeArray(arr, len, sizeof = 1) {
  var ptr;

  switch (sizeof) {
    case 8:
      ptr = Module._malloc(len * 8);
      Module.HEAP64.set(arr, ptr / 8);
      break;
    case 4:
      ptr = Module._malloc(len * 4);
      Module.HEAP32.set(arr, ptr / 4);
      break;
    default:
      ptr = Module._malloc(len);
      Module.HEAPU8.set(arr, ptr);
      break;
  }

  return ptr;
}

function getString() {
  var fnPtr = Module.addFunction(function (progress) {
    console.log("Progress: " + progress * 100.0 + "%");
    self.postMessage({ type: "progress", progress: progress });
  }, "vd");
  console.log(fnPtr); // debugger

  var len = 30;
  var ptr = Module._randString(len, fnPtr);
  var str = decodeString(ptr, len);
  self.postMessage({ type: "clipboard", text: str });
  console.log(str); // debugger
  Module._free(str);
}

function decodeString(ptr, len) {
  var str = Module.HEAPU8.buffer.slice(ptr, ptr + len);

  return new TextDecoder("utf8").decode(str);
}

function getMessage() {
  var str = decodeString(Module._getString(), 12);
  console.log(str);
}

onmessage = function (message) {
  console.log("Worker received message, type: ", message.data?.type);

  // initialize the module
  switch (message.data?.type) {
    case "init":
      loadWasm(message);
      break;
    case "run":
      run_wasm(message.data.input);
      break;
    case "copy":
      getString();
      break;
    case "simple":
      getMessage();
      break;
    case "greetings":
      console.log("Greetings: ", message.data?.greetings);
    default:
      break;
  }
};
