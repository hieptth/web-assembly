import "./style.css";

// var memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

// const imports = {
//   js: { mem: memory },
//   env: {
//     emscripten_date_now: () => Date.now(),
//     emscripten_memcpy_big: (dest, src, num) => {
//       heap.set(heap.slice(src, src + num), dest);
//       return dest;
//     },
//     emscripten_resize_heap: () => console.log("resize"),
//     emscripten_asm_const_int: () => console.log("asm"),
//     abort: () => console.log("Abort!"),
//   },
//   wasi_snapshot_preview1: {
//     fd_write: (fd, iovs, iovs_len, nwritten) => {
//       console.log("fd_write", fd, iovs, iovs_len, nwritten);
//       return 0;
//     },
//   },
// };

// var exports = null;
// WebAssembly.instantiateStreaming(fetch("./native.wasm"), imports).then(
//   (data) => {
//     module = data.arrayBuffer;
//     exports = data.instance.exports;
//     memory = data.instance.exports.memory;
//   }
// );

document.getElementById("runBtn").addEventListener("click", function () {
  const worker = new Worker(new URL("./worker.js", import.meta.url));
  var input = document.getElementById("a").value;
  worker.postMessage({ type: "init", libPath: "./" });

  worker.onmessage = function (message) {
    worker.postMessage({ type: "run", input: input });
    document.getElementById("res").innerHTML = `Sum: ${message.data}<br>`;
  };
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const worker = new Worker(new URL("./worker.js", import.meta.url));
  worker.postMessage({ type: "init", libPath: "./" });

  worker.onmessage = function (message) {
    switch (message.data?.type) {
      case "progress":
        document.getElementById("progress").style.width = `${
          message.data.progress * 200.0
        }px`;
        break;
      case "wasmLoaded":
        worker.postMessage({ type: "copy" });
        break;
      case "clipboard":
        navigator.clipboard.writeText(message.data.text);
        alert("Copied to clipboard!");
        break;
      default:
        console.log("Unknown message type: ", message.data?.type);
        break;
    }
  };
});

document.getElementById("workerBtn").addEventListener("click", () => {
  const worker = new Worker(new URL("./worker.js", import.meta.url));
  worker.postMessage({ type: "init", libPath: "./" });
  worker.postMessage({
    type: "greetings",
    greetings: "Hello from main thread!",
  });

  worker.onmessage = function (message) {
    console.log("Main thread received message: ", message.data);
    worker.postMessage({ type: "simple" });
  };
});
