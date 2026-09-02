import test from "node:test";
import assert from "node:assert/strict";
import { ESPLoader, ESP_READ_FLASH } from "../js/modules/esptool.js";

const slipEncode = (packet) => [0xc0, ...packet, 0xc0];

const commandPacket = (opcode, data) =>
  slipEncode([
    1,
    opcode,
    data.length & 0xff,
    (data.length >> 8) & 0xff,
    0,
    0,
    0,
    0,
    ...data,
  ]);

test("ignores delayed same-opRet flash data before command response", async () => {
  let controller;
  const readable = new ReadableStream({
    start(valueController) {
      controller = valueController;
    },
  });
  const writable = new WritableStream({
    write() {
      const delayedFlashData = slipEncode([
        1,
        ESP_READ_FLASH,
        4,
        0,
        0,
        0,
        0,
        0,
        0xaa,
        0xbb,
        0xcc,
        0xdd,
      ]);
      controller.enqueue(new Uint8Array(delayedFlashData));
      controller.enqueue(
        new Uint8Array(commandPacket(ESP_READ_FLASH, [0, 0])),
      );
      controller.enqueue(new Uint8Array(slipEncode([1, 2, 3, 4])));
    },
  });
  const port = {
    readable,
    writable,
    getInfo: () => ({}),
  };
  const loader = new ESPLoader(port, { log() {}, debug() {}, error() {} });
  loader.IS_STUB = true;
  loader.__inputBuffer = [];
  loader.__inputBufferReadIndex = 0;
  loader.readLoop();

  const [, data] = await loader.checkCommand(ESP_READ_FLASH, []);

  assert.deepEqual(data, []);
  assert.deepEqual(await loader.readPacket(100), [1, 2, 3, 4]);
  await loader.__reader.cancel();
});
