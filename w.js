import init from "./wasm/pkg/wasm.js";

const runWasm = async () => 
{
    const j = await init("./wasm/pkg/wasm_bg.wasm");
    const k = j.add(24, 24);
    console.log(k);
  
    const rustWasm = await init("./wasm/pkg/wasm_bg.wasm");
  console.log("Write in Wasm, Read in JS, Index 0:");

  rustWasm.store_value_in_wasm_memory_buffer_index_zero(24);
  let wasmMemory = new Uint8Array(rustWasm.memory.buffer);
  let bufferPointer = rustWasm.get_wasm_memory_buffer_pointer();
  console.log(wasmMemory[bufferPointer + 0]); // Should log "24"
  console.log("Write in JS, Read in Wasm, Index 1:");
  wasmMemory[bufferPointer + 1] = 15;
  console.log(rustWasm.read_wasm_memory_buffer_and_return_index_one()); // Should log "15"

  /**
   * NOTE: if we were to continue reading and writing memory,
   * depending on how the memory is grown by rust, you may have
   * to re-create the Uint8Array since memory layout could change.
   * For example, `let wasmMemory = new Uint8Array(rustWasm.memory.buffer);`
   * In this example, we did not, but be aware this may happen :)
   */
};

runWasm();
