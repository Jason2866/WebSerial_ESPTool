# ESPLoader API Reference

Complete API documentation for the `tasmota-webserial-esptool` library — a WebSerial/WebUSB-based tool for flashing and reading Espressif microcontrollers directly from the browser.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Browser Compatibility](#browser-compatibility)
- [Quick Start](#quick-start)
- [Factory Functions](#factory-functions)
  - [connect()](#connect)
  - [connectWithPort()](#connectwithport)
- [Class: ESPLoader](#class-esploader)
  - [Constructor](#constructor)
  - [Properties](#properties)
  - [Initialization & Connection](#initialization--connection)
  - [Chip Information](#chip-information)
  - [Flash Operations](#flash-operations)
  - [Memory Operations](#memory-operations)
  - [Register Operations](#register-operations)
  - [Baudrate Configuration](#baudrate-configuration)
  - [Stub Loader](#stub-loader)
  - [SPI Flash Commands](#spi-flash-commands)
  - [Low-Level Communication](#low-level-communication)
  - [Hardware Control](#hardware-control)
  - [Console Mode](#console-mode)
  - [Connection Management](#connection-management)
- [Events](#events)
- [Class: EspStubLoader](#class-espstubloader)
  - [eraseFlash()](#eraseflash)
  - [eraseRegion()](#eraseregion)
- [Partition Table Utilities](#partition-table-utilities)
- [Types and Interfaces](#types-and-interfaces)
  - [Logger](#logger)
  - [ChipFamily](#chipfamily)
  - [Partition](#partition-interface)
  - [SlipReadError](#sliprearerror)
- [Constants](#constants)
  - [Chip Family Constants](#chip-family-constants)
  - [Command Constants](#command-constants)
  - [Timeout Constants](#timeout-constants)
  - [Flash Size Constants](#flash-size-constants)
  - [USB Constants](#usb-constants)
- [Error Handling](#error-handling)
- [Utility Functions](#utility-functions)
- [USB-Serial Chip Detection](#usb-serial-chip-detection)
- [Examples](#examples)
  - [Basic Flash Write](#basic-flash-write)
  - [Compressed Flash Write](#compressed-flash-write)
  - [Reading Flash Memory](#reading-flash-memory)
  - [Reading Partition Table](#reading-partition-table)
  - [Erasing Flash](#erasing-flash)
  - [Console Mode Example](#console-mode-example)
  - [Handling Events](#handling-events)
  - [Using with WebUSB (Android)](#using-with-webusb-android)
  - [Complete Flash Programming](#complete-flash-programming)

---

## Overview

The `ESPLoader` class provides a WebSerial/WebUSB-based interface for communicating with Espressif microcontrollers. It runs entirely in the browser — no drivers, no command line, no native software required.

**Supported Chips:**

| Chip | Family Constant |
|------|----------------|
| ESP8266 | `CHIP_FAMILY_ESP8266` |
| ESP32 | `CHIP_FAMILY_ESP32` |
| ESP32-S2 | `CHIP_FAMILY_ESP32S2` |
| ESP32-S3 | `CHIP_FAMILY_ESP32S3` |
| ESP32-C2 | `CHIP_FAMILY_ESP32C2` |
| ESP32-C3 | `CHIP_FAMILY_ESP32C3` |
| ESP32-C5 | `CHIP_FAMILY_ESP32C5` |
| ESP32-C6 | `CHIP_FAMILY_ESP32C6` |
| ESP32-C61 | `CHIP_FAMILY_ESP32C61` |
| ESP32-H2 | `CHIP_FAMILY_ESP32H2` |
| ESP32-P4 | `CHIP_FAMILY_ESP32P4` |

**Key capabilities:**
- Automatic chip detection and identification
- Flash writing (uncompressed and compressed)
- Flash reading (up to 10x faster than esptool.py for some configurations)
- Stub loader upload for enhanced performance
- Partition table parsing
- Baudrate configuration
- Console mode (serial monitor)
- WebUSB support for Android devices

---

## Installation

```bash
npm install tasmota-webserial-esptool
```

**ES Module import:**
```javascript
import { ESPLoader, connect } from 'tasmota-webserial-esptool';
```

**Script tag (using built bundle):**
```html
<script type="module" src="js/modules/esptool.js"></script>
```

---

## Browser Compatibility

This library requires the [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) or a WebUSB polyfill.

| Browser | Web Serial | WebUSB (Android) |
|---------|-----------|------------------|
| Chrome (Desktop) | ✅ | — |
| Edge (Desktop) | ✅ | — |
| Opera (Desktop) | ✅ | — |
| Chrome (Android) | — | ✅ (via WebUSB adapter) |
| Firefox | ❌ | ❌ |
| Safari | ❌ | ❌ |

> **Note:** The page must be served over **HTTPS** or **localhost**.

---

## Quick Start

```javascript
import { connect } from 'tasmota-webserial-esptool';

const logger = {
  log: (msg) => console.log(msg),
  debug: (msg) => console.debug(msg),
  error: (msg) => console.error(msg),
};

// Connect (prompts user to select a serial port)
const esploader = await connect(logger);
await esploader.initialize();

console.log(`Chip: ${esploader.chipName}`);
console.log(`MAC: ${esploader.macAddr().map(b => b.toString(16).padStart(2, '0')).join(':')}`);

// Load stub for faster operations
const stub = await esploader.runStub();

// Flash firmware at offset 0x10000
const firmware = await fetch('firmware.bin').then(r => r.arrayBuffer());
await stub.flashData(firmware, (written, total) => {
  console.log(`Progress: ${Math.round(written / total * 100)}%`);
}, 0x10000);

// Reset device and disconnect
await esploader.hardReset();
await esploader.disconnect();
```

---

## Factory Functions

### `connect()`

Prompts the user to select a serial port and creates an `ESPLoader` instance. Automatically handles both Web Serial and WebUSB (Android) environments.

```typescript
connect(logger: Logger): Promise<ESPLoader>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `logger` | `Logger` | Logger interface for output messages |

**Returns:** `Promise<ESPLoader>` — A new, unopened ESPLoader instance.

**Throws:**
- `Error` if Web Serial API is not supported and no WebUSB polyfill is available.

```javascript
const esploader = await connect(logger);
await esploader.initialize();
```

### `connectWithPort()`

Creates an `ESPLoader` instance using an already-obtained `SerialPort`. Useful when you manage port selection yourself or use a WebUSB wrapper.

```typescript
connectWithPort(port: SerialPort, logger: Logger): Promise<ESPLoader>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `port` | `SerialPort` | An existing Web Serial port object |
| `logger` | `Logger` | Logger interface for output messages |

**Returns:** `Promise<ESPLoader>` — A new ESPLoader instance bound to the given port.

```javascript
const port = await navigator.serial.requestPort();
const esploader = await connectWithPort(port, logger);
await esploader.initialize();
```

---

## Class: ESPLoader

The main class for communicating with ESP devices. Extends `EventTarget` for event-based notifications.

### Constructor

```typescript
constructor(port: SerialPort, logger: Logger, _parent?: ESPLoader)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `port` | `SerialPort` | Web Serial API port object |
| `logger` | `Logger` | Logger interface for output |
| `_parent` | `ESPLoader` | *(Internal)* Parent loader for stub instances |

> **Note:** Prefer using `connect()` or `connectWithPort()` factory functions instead of the constructor directly.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `port` | `SerialPort` | The serial port instance |
| `logger` | `Logger` | Logger interface |
| `chipFamily` | `ChipFamily` | Detected chip family constant |
| `chipName` | `string \| null` | Human-readable chip name (e.g., "ESP32-S3") |
| `chipRevision` | `number \| null` | Chip silicon revision |
| `chipVariant` | `string \| null` | Chip variant identifier (e.g., "rev300" for ESP32-P4) |
| `flashSize` | `string \| null` | Detected flash size (e.g., "4MB", "8MB", "16MB") |
| `debug` | `boolean` | Enable debug output (default: `false`) |
| `IS_STUB` | `boolean` | Whether running stub loader (default: `false`) |
| `connected` | `boolean` | Connection state |
| `currentBaudRate` | `number` | Current serial baudrate |
| `isUsbJtagOrOtg` | `boolean \| undefined` | Whether device uses USB-JTAG or USB-OTG (not external serial chip) |

---

### Methods

#### Connection & Initialization

##### `initialize()`

Initialize connection to the ESP chip. Performs hardware reset, synchronization, and chip detection.

```typescript
async initialize(): Promise<void>
```

**Description:**
- Performs hard reset into bootloader mode
- Starts the read loop for serial communication
- Synchronizes with the ROM bootloader
- Detects chip type via security info or magic value
- Reads eFuse data including MAC address

**Throws:** Error if synchronization fails

**Example:**
```javascript
const esploader = new ESPLoader(port, logger);
await esploader.initialize();
console.log(`Detected: ${esploader.chipName}`);
```

---

##### `disconnect()`

Cleanly disconnect from the ESP chip.

```typescript
async disconnect(): Promise<void>
```

**Description:**
- Closes the writable stream
- Cancels the reader
- Sets `connected` to `false`
- Dispatches `disconnect` event

**Example:**
```javascript
await esploader.disconnect();
```

---

##### `reconnect()`

Reconnect to the serial port and reload the stub loader.

```typescript
async reconnect(): Promise<void>
```

**Description:**
- Closes and reopens the serial port
- Reinitializes communication
- Reloads the stub loader
- Restores previous baudrate setting
- Preserves chip information

**Use Case:** Recovery after timeout errors during flash read operations.

**Example:**
```javascript
try {
  await stub.readFlash(0x0, 0x100000);
} catch (err) {
  if (err.message.includes('Timed out')) {
    await esploader.reconnect();
    // Retry operation
  }
}
```

---

##### `hardReset(bootloader?: boolean)`

Perform a hardware reset of the ESP chip.

```typescript
async hardReset(bootloader?: boolean): Promise<void>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bootloader` | `boolean` | `false` | If `true`, reset into bootloader mode |

**Description:**
- Uses DTR/RTS signals to reset the chip
- Handles both USB-Serial bridge chips and native USB
- Different reset sequences for ESP32-C3/S3 native USB

**Example:**
```javascript
// Reset into bootloader
await esploader.hardReset(true);

// Normal reset (run user code)
await esploader.hardReset(false);
```

---

##### `sync()`

Synchronize with the ESP ROM bootloader.

```typescript
async sync(): Promise<boolean>
```

**Returns:** `true` if synchronization successful

**Throws:** Error if synchronization fails after 5 attempts

**Description:**
- Sends sync packets to establish communication
- Retries up to 5 times with timeout between attempts

---

#### Chip Information

##### `macAddr()`

Get the MAC address burned into the chip's OTP memory.

```typescript
macAddr(): number[]
```

**Returns:** Array of 6 bytes representing the MAC address

**Example:**
```javascript
const mac = esploader.macAddr();
const macString = mac.map(b => b.toString(16).padStart(2, '0')).join(':');
console.log(`MAC: ${macString}`); // "aa:bb:cc:dd:ee:ff"
```

---

##### `getChipFamily()`

Get the chip family constant.

```typescript
getChipFamily(): ChipFamily
```

**Returns:** Chip family constant (e.g., `CHIP_FAMILY_ESP32S3`)

---

##### `getBootloaderOffset()`

Get the bootloader flash offset for the current chip.

```typescript
getBootloaderOffset(): number
```

**Returns:** Flash address where bootloader should be written

**Example:**
```javascript
const offset = esploader.getBootloaderOffset();
console.log(`Bootloader offset: 0x${offset.toString(16)}`);
// ESP32: 0x1000, ESP32-S2/S3/C3: 0x0
```

---

##### `detectFlashSize()`

Auto-detect the flash chip size.

```typescript
async detectFlashSize(): Promise<void>
```

**Description:**
- Reads flash ID via SPI command
- Sets `this.flashSize` to detected size string
- Logs flash manufacturer and device ID

**Example:**
```javascript
await esploader.detectFlashSize();
console.log(`Flash size: ${esploader.flashSize}`); // "4MB"
```

---

##### `flashId()`

Read the flash chip ID.

```typescript
async flashId(): Promise<number>
```

**Returns:** 24-bit flash ID value

**Example:**
```javascript
const id = await esploader.flashId();
const manufacturer = id & 0xff;
const deviceId = (id >> 8) & 0xffff;
```

---

##### `getSecurityInfo()`

Get security information from the chip (ESP32-C3 and later).

```typescript
async getSecurityInfo(): Promise<{
  flags: number;
  flashCryptCnt: number;
  keyPurposes: number[];
  chipId: number;
  apiVersion: number;
}>
```

**Returns:** Security information object

**Throws:** Error if not supported or invalid response

---

##### `getChipRevision()`

Get the chip silicon revision (currently ESP32-P4 only).

```typescript
async getChipRevision(): Promise<number>
```

**Returns:** Revision number (e.g., 300 for rev3.0)

---

#### Flash Operations

##### `flashData(binaryData, updateProgress, offset?, compress?)`

Write binary data to flash memory.

```typescript
async flashData(
  binaryData: ArrayBuffer,
  updateProgress: (bytesWritten: number, totalBytes: number) => void,
  offset?: number,
  compress?: boolean
): Promise<void>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `binaryData` | `ArrayBuffer` | - | Binary data to write |
| `updateProgress` | `function` | - | Progress callback |
| `offset` | `number` | `0` | Flash address to write to |
| `compress` | `boolean` | `false` | Use compression (faster) |

**Description:**
- Erases required flash sectors
- Writes data in blocks
- Supports compressed transfer for faster programming
- Reports progress via callback

**Example:**
```javascript
const firmware = await fetch('app.bin').then(r => r.arrayBuffer());

await stub.flashData(
  firmware,
  (written, total) => {
    const percent = Math.round((written / total) * 100);
    console.log(`Writing: ${percent}%`);
  },
  0x10000,  // offset
  true      // use compression
);
```

---

##### `readFlash(addr, size, onPacketReceived?)`

Read data from flash memory (stub loader only).

```typescript
async readFlash(
  addr: number,
  size: number,
  onPacketReceived?: (packet: Uint8Array, progress: number, totalSize: number) => void
): Promise<Uint8Array>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `addr` | `number` | Start address to read from |
| `size` | `number` | Number of bytes to read |
| `onPacketReceived` | `function` | Optional progress callback |

**Returns:** `Uint8Array` containing the flash data

**Throws:** Error if not in stub mode or read fails

**Description:**
- Reads flash in 64KB chunks
- Automatic retry with reconnect on timeout
- Progress callback for UI updates

**Example:**
```javascript
const data = await stub.readFlash(
  0x0,      // address
  0x10000,  // size (64KB)
  (packet, progress, total) => {
    console.log(`Read: ${progress}/${total} bytes`);
  }
);

// Save to file
const blob = new Blob([data], { type: 'application/octet-stream' });
const url = URL.createObjectURL(blob);
```

---

##### `flashBegin(size?, offset?, encrypted?)`

Prepare for flash writing by erasing sectors.

```typescript
async flashBegin(size?: number, offset?: number, encrypted?: boolean): Promise<number>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | `number` | `0` | Size of data to write |
| `offset` | `number` | `0` | Flash address |
| `encrypted` | `boolean` | `false` | Use flash encryption |

**Returns:** Number of blocks to write

---

##### `flashBlock(data, seq, timeout?)`

Write a single block of data to flash.

```typescript
async flashBlock(data: number[], seq: number, timeout?: number): Promise<void>
```

---

##### `flashFinish()`

Complete uncompressed flash writing.

```typescript
async flashFinish(): Promise<void>
```

---

##### `flashDeflBegin(size?, compressedSize?, offset?)`

Begin compressed flash writing.

```typescript
async flashDeflBegin(size?: number, compressedSize?: number, offset?: number): Promise<number>
```

---

##### `flashDeflBlock(data, seq, timeout?)`

Write a compressed data block.

```typescript
async flashDeflBlock(data: number[], seq: number, timeout?: number): Promise<void>
```

---

##### `flashDeflFinish()`

Complete compressed flash writing.

```typescript
async flashDeflFinish(): Promise<void>
```

---

#### Memory Operations

##### `memBegin(size, blocks, blocksize, offset)`

Start downloading data to RAM.

```typescript
async memBegin(size: number, blocks: number, blocksize: number, offset: number): Promise<[number, number[]]>
```

---

##### `memBlock(data, seq)`

Send a block of data to RAM.

```typescript
async memBlock(data: number[], seq: number): Promise<[number, number[]]>
```

---

##### `memFinish(entrypoint?)`

Finish RAM download and optionally execute code.

```typescript
async memFinish(entrypoint?: number): Promise<[number, number[]]>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `entrypoint` | `number` | `0` | Entry point address (0 = don't execute) |

---

#### Register Operations

##### `readRegister(reg)`

Read a 32-bit value from a register.

```typescript
async readRegister(reg: number): Promise<number>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `reg` | `number` | Register address |

**Returns:** 32-bit register value

---

##### `writeRegister(address, value, mask?, delayUs?, delayAfterUs?)`

Write a 32-bit value to a register.

```typescript
async writeRegister(
  address: number,
  value: number,
  mask?: number,
  delayUs?: number,
  delayAfterUs?: number
): Promise<void>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `address` | `number` | - | Register address |
| `value` | `number` | - | Value to write |
| `mask` | `number` | `0xffffffff` | Bit mask |
| `delayUs` | `number` | `0` | Delay before write (µs) |
| `delayAfterUs` | `number` | `0` | Delay after write (µs) |

---

#### Baudrate Configuration

##### `setBaudrate(baud)`

Change the serial communication baudrate.

```typescript
async setBaudrate(baud: number): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `baud` | `number` | New baudrate (e.g., 921600, 1500000) |

**Throws:** Error on ESP8266 (not supported)

**Description:**
- Sends baudrate change command to chip
- Closes and reopens serial port at new speed
- Warns if baudrate exceeds USB-Serial chip capability

**Example:**
```javascript
await stub.setBaudrate(921600);
// or for faster chips
await stub.setBaudrate(1500000);
```

---

#### Stub Loader

##### `runStub(skipFlashDetection?)`

Upload and run the stub loader for faster operations.

```typescript
async runStub(skipFlashDetection?: boolean): Promise<EspStubLoader>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skipFlashDetection` | `boolean` | `false` | Skip flash size detection |

**Returns:** `EspStubLoader` instance (or self if stub not available)

**Description:**
- Uploads stub code to chip RAM
- Executes stub code
- Returns stub loader with enhanced capabilities
- Auto-detects flash size unless skipped

**Example:**
```javascript
const stub = await esploader.runStub();
// stub has faster flash operations
await stub.flashData(firmware, progressCallback, 0x10000, true);
```

---

#### SPI Flash Commands

##### `runSpiFlashCommand(spiflashCommand, data, readBits?)`

Execute an arbitrary SPI flash command.

```typescript
async runSpiFlashCommand(
  spiflashCommand: number,
  data: number[],
  readBits?: number
): Promise<number>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spiflashCommand` | `number` | - | SPI command byte |
| `data` | `number[]` | - | Data to send (max 64 bytes) |
| `readBits` | `number` | `0` | Bits to read back (max 32) |

**Returns:** Response value (up to 32 bits)

---

#### Low-Level Communication

##### `sendCommand(opcode, buffer, checksum?)`

Send a command packet to the chip.

```typescript
async sendCommand(opcode: number, buffer: number[], checksum?: number): Promise<void>
```

---

##### `checkCommand(opcode, buffer, checksum?, timeout?)`

Send a command and wait for response.

```typescript
async checkCommand(
  opcode: number,
  buffer: number[],
  checksum?: number,
  timeout?: number
): Promise<[number, number[]]>
```

**Returns:** Tuple of `[value, data]`

---

##### `getResponse(opcode, timeout?)`

Read and parse a response packet.

```typescript
async getResponse(opcode: number, timeout?: number): Promise<[number, number[]]>
```

---

##### `readPacket(timeout)`

Read a SLIP-encoded packet from serial.

```typescript
async readPacket(timeout: number): Promise<number[]>
```

---

##### `writeToStream(data)`

Write raw data to serial port.

```typescript
async writeToStream(data: number[]): Promise<void>
```

---

##### `checksum(data, state?)`

Calculate ESP checksum for data.

```typescript
checksum(data: number[], state?: number): number
```

---

#### Hardware Control

##### `setRTS(state)`

Set the RTS (Request To Send) signal.

```typescript
async setRTS(state: boolean): Promise<void>
```

---

##### `setDTR(state)`

Set the DTR (Data Terminal Ready) signal.

```typescript
async setDTR(state: boolean): Promise<void>
```

---

##### `setDTRandRTS(dtr, rts)`

Set both DTR and RTS signals simultaneously.

```typescript
async setDTRandRTS(dtr: boolean, rts: boolean): Promise<void>
```

---

#### Console Mode

Console mode allows you to interact with the running firmware's serial output (like a serial monitor).

##### `enterConsoleMode()`

Prepare the device for console mode by resetting it into firmware and setting up the serial stream.

```typescript
async enterConsoleMode(): Promise<boolean>
```

**Returns:** `true` if the port was closed (USB-JTAG/OTG devices — caller must reopen), `false` if the port stays open.

**Description:**
- Detects USB connection type (USB-JTAG/OTG vs external serial chip)
- Resets the device to run firmware
- For USB-JTAG devices: may close the port (port address changes)
- For external serial chips: keeps port open, releases reader/writer locks

**Example:**
```javascript
const portClosed = await esploader.enterConsoleMode();
if (portClosed) {
  // Need to select a new port (USB port address changed)
  const newPort = await navigator.serial.requestPort();
  await newPort.open({ baudRate: 115200 });
  // Set up reader on the new port
}
// Now read serial output from firmware
```

---

##### `exitConsoleMode()`

Exit console mode and return to bootloader for further programming operations.

```typescript
async exitConsoleMode(): Promise<boolean>
```

**Returns:** `true` if manual reconnection is needed (ESP32-S2/P4 USB-OTG), `false` otherwise.

**Description:**
- Clears the console mode flag
- For USB-OTG chips (ESP32-S2, ESP32-P4): performs hardware reset to bootloader, which causes the USB port to change — dispatches `usb-otg-port-change` event
- For other chips: re-syncs with the bootloader, reloads stub

---

##### `setConsoleMode(value)`

Manually set or clear the console mode flag.

```typescript
setConsoleMode(value: boolean): void
```

---

##### `isConsoleResetSupported()`

Check whether in-console hardware reset is supported for the current chip.

```typescript
isConsoleResetSupported(): boolean
```

**Returns:** `true` if the chip supports resetting while in console mode.

---

##### `resetInConsoleMode()`

Perform a hardware reset while in console mode (restart firmware without leaving console mode).

```typescript
async resetInConsoleMode(): Promise<void>
```

---

#### Connection Management

##### `disconnect()`

Cleanly disconnect from the ESP chip and close the serial port.

```typescript
async disconnect(): Promise<void>
```

**Description:**
- Waits for pending writes to complete
- Releases reader and writer locks
- Closes the serial port
- Sets `connected` to `false`
- Dispatches `disconnect` event

---

##### `reconnect()`

Reconnect to the serial port, re-sync, and reload the stub loader.

```typescript
async reconnect(): Promise<void>
```

**Description:**
- Closes and reopens the serial port
- Reinitializes communication
- Reloads the stub loader
- Restores previous baudrate setting
- Preserves chip information

**Use Case:** Recovery after timeout errors during flash read operations.

---

##### `reconnectToBootloader()`

Reconnect directly to the bootloader (for USB-OTG port change scenarios).

```typescript
async reconnectToBootloader(): Promise<void>
```

---

##### `releaseReaderWriter()`

Release reader and writer locks without closing the port. Used internally when switching to console mode.

```typescript
async releaseReaderWriter(): Promise<void>
```

---

##### `drainInputBuffer(bufferingTime?)`

Wait for buffered data and clear the input buffer.

```typescript
async drainInputBuffer(bufferingTime?: number): Promise<void>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bufferingTime` | `number` | `200` | Milliseconds to wait before draining |

---

##### `flushSerialBuffers()`

Flush both serial input and output buffers.

```typescript
async flushSerialBuffers(): Promise<void>
```

---

### Events

The `ESPLoader` class extends `EventTarget` and dispatches the following events:

#### `disconnect`

Fired when the serial connection is lost.

```javascript
esploader.addEventListener('disconnect', () => {
  console.log('Disconnected from ESP');
});
```

#### `esp32s2-usb-reconnect`

Fired when an ESP32-S2 with native USB disconnects before initialization completes, indicating the USB mode has switched and a new port needs to be selected.

```typescript
interface ESP32S2ReconnectEventDetail {
  message: string;  // "ESP32-S2 Native USB requires port reselection"
}
```

**Example:**
```javascript
esploader.addEventListener('esp32s2-usb-reconnect', async (event) => {
  console.log(event.detail.message);
  
  // Close and forget old port
  await port.close();
  await port.forget();
  
  // Request new port from user
  const newPort = await navigator.serial.requestPort();
  await newPort.open({ baudRate: 115200 });
  
  // Create new loader
  const newLoader = new ESPLoader(newPort, logger);
  await newLoader.initialize();
});
```

#### `usb-otg-port-change`

Fired when a USB-OTG/JTAG device (ESP32-S2, ESP32-P4) changes its USB port, typically when exiting console mode back to bootloader.

```typescript
interface UsbOtgPortChangeEventDetail {
  chipName: string;   // e.g., "ESP32-S2"
  message: string;    // Human-readable message
  reason: string;     // e.g., "exit-console-to-bootloader"
}
```

**Example:**
```javascript
esploader.addEventListener('usb-otg-port-change', async (event) => {
  console.log(event.detail.message);
  // User needs to select the new bootloader port
  const newPort = await navigator.serial.requestPort();
  await newPort.open({ baudRate: 115200 });
  await esploader.syncAndWdtReset(newPort);
});
```

---

## Class: EspStubLoader

The `EspStubLoader` extends `ESPLoader` with stub-specific functionality. It is returned by `runStub()`.

### Additional Properties

| Property | Value | Description |
|----------|-------|-------------|
| `IS_STUB` | `true` | Indicates stub loader is active |

### Additional Methods

#### `eraseFlash()`

Erase the entire flash chip.

```typescript
async eraseFlash(): Promise<void>
```

**Warning:** This operation can take several minutes for large flash chips.

**Example:**
```javascript
const stub = await esploader.runStub();
console.log('Erasing flash...');
await stub.eraseFlash();
console.log('Flash erased');
```

#### `eraseRegion(offset, size)`

Erase a specific region of flash memory.

```typescript
async eraseRegion(offset: number, size: number): Promise<void>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `offset` | `number` | Start address (must be sector-aligned: multiple of 0x1000) |
| `size` | `number` | Number of bytes to erase (must be sector-aligned) |

**Throws:**
- Error if offset or size is negative
- Error if offset or size is not aligned to flash sector size (4096 bytes)
- Error if region exceeds 32-bit address space

**Example:**
```javascript
const stub = await esploader.runStub();
// Erase 64KB at address 0x10000
await stub.eraseRegion(0x10000, 0x10000);
```

---

## Partition Table Utilities

The library includes utilities for parsing ESP-IDF partition tables, importable from `partition.ts`.

### `parsePartitionTable(data)`

Parse a raw partition table binary into structured partition entries.

```typescript
function parsePartitionTable(data: Uint8Array): Partition[]
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `Uint8Array` | Raw partition table binary data |

**Returns:** Array of `Partition` objects

### `getPartitionTableOffset()`

Get the default partition table offset in flash.

```typescript
function getPartitionTableOffset(): number
```

**Returns:** `0x8000` (32768)

### `formatSize(bytes)`

Format a byte count as a human-readable string.

```typescript
function formatSize(bytes: number): string
```

**Returns:** Formatted string (e.g., `"4.00 KB"`, `"2.00 MB"`)

### Partition Interface

```typescript
interface Partition {
  name: string;        // Partition name (max 16 chars)
  type: number;        // Partition type (0x00 = app, 0x01 = data)
  subtype: number;     // Partition subtype
  offset: number;      // Start address in flash
  size: number;        // Size in bytes
  flags: number;       // Partition flags
  typeName: string;    // Human-readable type ("app", "data")
  subtypeName: string; // Human-readable subtype ("factory", "ota_0", "nvs", etc.)
}
```

**Partition Types:**

| Type | Value | Subtypes |
|------|-------|----------|
| app | 0x00 | factory, ota_0–ota_15, test |
| data | 0x01 | ota, phy, nvs, coredump, nvs_keys, efuse, esphttpd, fat, spiffs |

---

## Types and Interfaces

### Logger

```typescript
interface Logger {
  log(message: string): void;
  debug(message: string): void;
  error(message: string): void;
}
```

### ChipFamily

```typescript
type ChipFamily = number;  // One of the CHIP_FAMILY_* constants
```

### SlipReadError

Custom error class for SLIP protocol read errors.

```typescript
class SlipReadError extends Error {
  constructor(message: string);
}
```

---

## Constants

### Chip Family Constants

All chip family constants are exported and can be used for chip identification.

| Constant | Value | Chip |
|----------|-------|------|
| `CHIP_FAMILY_ESP8266` | `0x8266` | ESP8266 |
| `CHIP_FAMILY_ESP32` | `0x32` | ESP32 |
| `CHIP_FAMILY_ESP32S2` | `0x3252` | ESP32-S2 |
| `CHIP_FAMILY_ESP32S3` | `0x3253` | ESP32-S3 |
| `CHIP_FAMILY_ESP32C2` | `0x32c2` | ESP32-C2 |
| `CHIP_FAMILY_ESP32C3` | `0x32c3` | ESP32-C3 |
| `CHIP_FAMILY_ESP32C5` | `0x32c5` | ESP32-C5 |
| `CHIP_FAMILY_ESP32C6` | `0x32c6` | ESP32-C6 |
| `CHIP_FAMILY_ESP32C61` | `0x32c61` | ESP32-C61 |
| `CHIP_FAMILY_ESP32H2` | `0x3272` | ESP32-H2 |
| `CHIP_FAMILY_ESP32H4` | `0x3274` | ESP32-H4 |
| `CHIP_FAMILY_ESP32H21` | `0x3275` | ESP32-H21 |
| `CHIP_FAMILY_ESP32P4` | `0x3280` | ESP32-P4 |
| `CHIP_FAMILY_ESP32S31` | `0x3231` | ESP32-S31 |

### Command Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `ESP_FLASH_BEGIN` | `0x02` | Begin flash write |
| `ESP_FLASH_DATA` | `0x03` | Flash data block |
| `ESP_FLASH_END` | `0x04` | End flash write |
| `ESP_MEM_BEGIN` | `0x05` | Begin memory download |
| `ESP_MEM_END` | `0x06` | End memory download |
| `ESP_MEM_DATA` | `0x07` | Memory data block |
| `ESP_SYNC` | `0x08` | Sync command |
| `ESP_WRITE_REG` | `0x09` | Write register |
| `ESP_READ_REG` | `0x0a` | Read register |
| `ESP_SPI_SET_PARAMS` | `0x0b` | Set SPI parameters |
| `ESP_SPI_ATTACH` | `0x0d` | Attach SPI flash |
| `ESP_CHANGE_BAUDRATE` | `0x0f` | Change baudrate |
| `ESP_FLASH_DEFL_BEGIN` | `0x10` | Begin compressed flash write |
| `ESP_FLASH_DEFL_DATA` | `0x11` | Compressed flash data block |
| `ESP_FLASH_DEFL_END` | `0x12` | End compressed flash write |
| `ESP_SPI_FLASH_MD5` | `0x13` | Calculate MD5 of flash region |
| `ESP_GET_SECURITY_INFO` | `0x14` | Get chip security info |
| `ESP_ERASE_FLASH` | `0xd0` | Erase entire flash (stub only) |
| `ESP_ERASE_REGION` | `0xd1` | Erase flash region (stub only) |
| `ESP_READ_FLASH` | `0xd2` | Read flash (stub only) |
| `ESP_CHECKSUM_MAGIC` | `0xef` | Checksum magic value |

### Timeout Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `DEFAULT_TIMEOUT` | 3000ms | Default command timeout |
| `SYNC_TIMEOUT` | 100ms | Sync packet timeout |
| `MAX_TIMEOUT` | 300000ms | Maximum allowed timeout |
| `CHIP_ERASE_TIMEOUT` | 150000ms | Full chip erase timeout |
| `ERASE_REGION_TIMEOUT_PER_MB` | 30000ms | Erase timeout per megabyte |
| `MEM_END_ROM_TIMEOUT` | 500ms | Memory end command timeout |
| `FLASH_READ_TIMEOUT` | 100ms | Flash read packet timeout |

### Flash Size Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `FLASH_SECTOR_SIZE` | 4096 bytes | Minimum erase unit |
| `FLASH_WRITE_SIZE` | 1024 bytes | ROM flash write block size |
| `STUB_FLASH_WRITE_SIZE` | 16384 bytes | Stub flash write block size |
| `ESP_RAM_BLOCK` | 6144 bytes | RAM block size |
| `USB_RAM_BLOCK` | 2048 bytes | USB RAM block size |

### USB Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `USB_JTAG_SERIAL_PID` | `0x1001` | ESP32-C3/S3 native USB PID |
| `ESP_ROM_BAUD` | `115200` | Default ROM baud rate |

---

## Error Handling

### Common Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Couldn't sync to ESP. Try resetting." | Chip not responding | Check connections, try manual reset |
| "Invalid (unsupported) command" | Command not supported by ROM/stub | Ensure correct chip family |
| "Timed out waiting for packet" | Communication timeout | Check baudrate, reduce speed |
| "Reading flash is only supported in stub mode" | Calling `readFlash()` without stub | Call `runStub()` first |

### Error Recovery Pattern

```javascript
async function robustFlashWrite(stub, data, address) {
  const MAX_RETRIES = 3;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await stub.flashData(data, progressCallback, address, true);
      return; // Success
    } catch (err) {
      console.error(`Attempt ${attempt} failed: ${err.message}`);
      
      if (attempt < MAX_RETRIES) {
        console.log('Reconnecting...');
        await stub.reconnect();
      } else {
        throw err;
      }
    }
  }
}
```

---

## Examples

### Basic Flash Write

```javascript
import { connect } from 'tasmota-webserial-esptool';

const logger = {
  log: console.log,
  debug: console.debug,
  error: console.error,
};

// Connect and flash a single binary
const esploader = await connect(logger);
await esploader.initialize();

const stub = await esploader.runStub();

const firmware = await fetch('firmware.bin').then(r => r.arrayBuffer());
await stub.flashData(firmware, (written, total) => {
  console.log(`${Math.round(written / total * 100)}%`);
}, 0x10000);

await esploader.hardReset();
await esploader.disconnect();
```

### Compressed Flash Write

Compressed writes are significantly faster — data is deflate-compressed before transfer.

```javascript
const firmware = await fetch('firmware.bin').then(r => r.arrayBuffer());

// Pass compress=true as the 4th argument
await stub.flashData(firmware, (written, total) => {
  console.log(`${Math.round(written / total * 100)}%`);
}, 0x10000, true); // <-- compressed
```

### Reading Flash Memory

```javascript
const stub = await esploader.runStub();
await stub.setBaudrate(921600);

// Read 1MB starting at address 0
const data = await stub.readFlash(0x0, 0x100000, (packet, progress, total) => {
  console.log(`Reading: ${Math.round(progress / total * 100)}%`);
});

// Save to file
const blob = new Blob([data], { type: 'application/octet-stream' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'flash_backup.bin';
a.click();
URL.revokeObjectURL(url);
```

### Reading Partition Table

```javascript
import { parsePartitionTable, getPartitionTableOffset, formatSize } from 'tasmota-webserial-esptool/partition';

const stub = await esploader.runStub();

// Read partition table from flash
const offset = getPartitionTableOffset(); // 0x8000
const ptData = await stub.readFlash(offset, 0x1000);

// Parse partition entries
const partitions = parsePartitionTable(ptData);

for (const p of partitions) {
  console.log(
    `${p.name.padEnd(16)} ${p.typeName}/${p.subtypeName}  ` +
    `offset=0x${p.offset.toString(16)}  size=${formatSize(p.size)}`
  );
}
// Example output:
// nvs              data/nvs       offset=0x9000   size=20.00 KB
// otadata          data/ota       offset=0xe000   size=8.00 KB
// app0             app/ota_0      offset=0x10000  size=1.25 MB
// app1             app/ota_1      offset=0x150000 size=1.25 MB
// spiffs           data/spiffs    offset=0x290000 size=1.44 MB
```

### Erasing Flash

```javascript
const stub = await esploader.runStub();

// Erase entire flash
await stub.eraseFlash();

// Or erase a specific region (must be sector-aligned to 0x1000)
await stub.eraseRegion(0x10000, 0x100000); // Erase 1MB at offset 0x10000
```

### Console Mode Example

Use console mode as a serial monitor to read firmware output.

```javascript
// Enter console mode (resets device to firmware)
const portClosed = await esploader.enterConsoleMode();

if (!portClosed) {
  // Port stayed open — read serial data
  const reader = esploader.port.readable.getReader();
  
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = new TextDecoder().decode(value);
      console.log(text);
    }
  } finally {
    reader.releaseLock();
  }
}

// Exit console mode and return to bootloader
const needsReconnect = await esploader.exitConsoleMode();
if (needsReconnect) {
  // ESP32-S2/P4 USB-OTG: port changed, need new port selection
  console.log('Please select the bootloader port');
}
```

### Handling Events

```javascript
// Listen for disconnects
esploader.addEventListener('disconnect', () => {
  console.log('Device disconnected');
  updateUI('disconnected');
});

// Handle ESP32-S2 native USB reconnect
esploader.addEventListener('esp32s2-usb-reconnect', (event) => {
  console.log(event.detail.message);
  showPortSelectionDialog();
});

// Handle USB-OTG port changes (ESP32-S2/P4)
esploader.addEventListener('usb-otg-port-change', (event) => {
  console.log(event.detail.message);
  console.log(`Reason: ${event.detail.reason}`);
  showPortSelectionDialog();
});
```

### Using with WebUSB (Android)

On Android, the Web Serial API is not available. Instead, a WebUSB adapter provides `SerialPort`-compatible objects.

```javascript
import { connect, connectWithPort } from 'tasmota-webserial-esptool';

// Option 1: Use connect() — it automatically checks for a
// global requestSerialPort() function (WebUSB polyfill)
globalThis.requestSerialPort = async () => {
  // Your WebUSB adapter logic here
  return webUsbSerialPort;
};
const esploader = await connect(logger);

// Option 2: Use connectWithPort() with a ready port
const esploader2 = await connectWithPort(webUsbPort, logger);
await esploader2.initialize();
```

### Complete Flash Programming

```javascript
import { ESPLoader } from 'tasmota-webserial-esptool';

async function flashFirmware() {
  // Get serial port
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  
  const logger = {
    log: console.log,
    debug: console.debug,
    error: console.error,
  };
  
  const esploader = new ESPLoader(port, logger);
  
  try {
    // Initialize and detect chip
    await esploader.initialize();
    console.log(`Chip: ${esploader.chipName}`);
    console.log(`MAC: ${esploader.macAddr().join(':')}`);
    
    // Load stub for faster operations
    const stub = await esploader.runStub();
    console.log(`Flash size: ${stub.flashSize}`);
    
    // Increase baudrate
    await stub.setBaudrate(921600);
    
    // Flash bootloader
    const bootloader = await fetch('bootloader.bin').then(r => r.arrayBuffer());
    await stub.flashData(bootloader, updateProgress, stub.getBootloaderOffset(), true);
    
    // Flash partition table
    const partitions = await fetch('partitions.bin').then(r => r.arrayBuffer());
    await stub.flashData(partitions, updateProgress, 0x8000, true);
    
    // Flash application
    const app = await fetch('app.bin').then(r => r.arrayBuffer());
    await stub.flashData(app, updateProgress, 0x10000, true);
    
    // Reset to run new firmware
    await esploader.hardReset(false);
    
    console.log('Flashing complete!');
  } finally {
    await esploader.disconnect();
  }
}

function updateProgress(written, total) {
  const percent = Math.round((written / total) * 100);
  document.getElementById('progress').style.width = `${percent}%`;
}
```

### Reading Flash Backup

```javascript
async function backupFlash(startAddr, size, filename) {
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  
  const esploader = new ESPLoader(port, logger);
  await esploader.initialize();
  
  const stub = await esploader.runStub();
  await stub.setBaudrate(921600);
  
  const data = await stub.readFlash(startAddr, size, (packet, progress, total) => {
    console.log(`Reading: ${Math.round(progress/total*100)}%`);
  });
  
  // Download file
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  
  await esploader.disconnect();
}
```

### Handling ESP32-S2 USB Mode Switch

```javascript
async function connectWithS2Support() {
  let port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  
  const esploader = new ESPLoader(port, logger);
  
  // Handle ESP32-S2 USB mode switch
  esploader.addEventListener('esp32s2-usb-reconnect', async () => {
    showModal('ESP32-S2 switched USB modes. Please select the new port.');
    
    await port.close();
    await port.forget();
    
    // Wait for user to click button
    await waitForUserAction();
    
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    
    // Reinitialize with new port
    const newLoader = new ESPLoader(port, logger);
    await newLoader.initialize();
    
    hideModal();
    continueWithLoader(newLoader);
  });
  
  await esploader.initialize();
  return esploader;
}
```

---

## USB-Serial Chip Detection

The ESPLoader automatically detects common USB-Serial bridge chips and their maximum supported baudrates:

| Vendor | Chips | Max Baudrate |
|--------|-------|--------------|
| QinHeng | CH340, CH341, CH343, CH9101, CH9102 | 460800 - 6000000 |
| Silicon Labs | CP2102, CP2105, CP2108 | 2000000 - 3000000 |
| FTDI | FT232R, FT2232, FT4232, FT232H, FT230X | 3000000 - 12000000 |
| Espressif | Native USB | 2000000 |

If you set a baudrate higher than the detected chip supports, a warning is logged.

---

## Utility Functions

The following utility functions are available:

### `toHex(value, size?)`

Format a number as a hex string.

```typescript
function toHex(value: number, size?: number): string
```

```javascript
toHex(255);     // "0xFF"
toHex(4096, 4); // "0x1000"
```

### `formatMacAddr(macAddr)`

Format a MAC address byte array as a colon-separated string.

```typescript
function formatMacAddr(macAddr: number[]): string
```

```javascript
formatMacAddr([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
// "AA:BB:CC:DD:EE:FF"
```

### `sleep(ms)`

Async sleep for the given milliseconds.

```typescript
function sleep(ms: number): Promise<void>
```

---
