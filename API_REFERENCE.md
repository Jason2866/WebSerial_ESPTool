# ESPLoader API Reference

Complete API documentation for the `ESPLoader` class and related functionality.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Class: ESPLoader](#class-esploader)
  - [Constructor](#constructor)
  - [Properties](#properties)
  - [Methods](#methods)
  - [Events](#events)
- [Class: EspStubLoader](#class-espstubloader)
- [Types and Interfaces](#types-and-interfaces)
- [Constants](#constants)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Overview

The `ESPLoader` class provides a WebSerial-based interface for communicating with Espressif microcontrollers (ESP8266, ESP32, ESP32-S2, ESP32-S3, ESP32-C2, ESP32-C3, ESP32-C5, ESP32-C6, ESP32-C61, ESP32-H2, ESP32-P4, etc.).

Key capabilities:
- Chip detection and identification
- Flash reading and writing
- Compressed flash programming
- Baudrate configuration
- Stub loader for enhanced performance
- Partition table reading

---

## Installation

```bash
npm install tasmota-webserial-esptool
```

---

## Quick Start

```javascript
import { ESPLoader } from 'tasmota-webserial-esptool';

// Request serial port from user
const port = await navigator.serial.requestPort();
await port.open({ baudRate: 115200 });

// Create logger
const logger = {
  log: (msg) => console.log(msg),
  debug: (msg) => console.debug(msg),
  error: (msg) => console.error(msg),
};

// Initialize ESPLoader
const esploader = new ESPLoader(port, logger);
await esploader.initialize();

console.log(`Connected to: ${esploader.chipName}`);
console.log(`MAC Address: ${esploader.macAddr().map(b => b.toString(16).padStart(2, '0')).join(':')}`);

// Load stub for faster operations
const stub = await esploader.runStub();

// Flash a binary
const firmware = await fetch('firmware.bin').then(r => r.arrayBuffer());
await stub.flashData(firmware, (written, total) => {
  console.log(`Progress: ${Math.round(written/total*100)}%`);
}, 0x10000);

// Disconnect
await esploader.disconnect();
```

---

## Class: ESPLoader

### Constructor

```typescript
constructor(port: SerialPort, logger: Logger, _parent?: ESPLoader)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `port` | `SerialPort` | Web Serial API port object |
| `logger` | `Logger` | Logger interface for output |
| `_parent` | `ESPLoader` | (Internal) Parent loader for stub instances |

### Properties

#### Public Properties

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

#### Chip Family Constants

```typescript
CHIP_FAMILY_ESP8266
CHIP_FAMILY_ESP32
CHIP_FAMILY_ESP32S2
CHIP_FAMILY_ESP32S3
CHIP_FAMILY_ESP32C2
CHIP_FAMILY_ESP32C3
CHIP_FAMILY_ESP32C5
CHIP_FAMILY_ESP32C6
CHIP_FAMILY_ESP32C61
CHIP_FAMILY_ESP32H2
CHIP_FAMILY_ESP32H4
CHIP_FAMILY_ESP32H21
CHIP_FAMILY_ESP32P4
CHIP_FAMILY_ESP32S31
```

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

### Timeouts

| Constant | Value | Description |
|----------|-------|-------------|
| `DEFAULT_TIMEOUT` | 3000ms | Default command timeout |
| `SYNC_TIMEOUT` | 100ms | Sync packet timeout |
| `MAX_TIMEOUT` | 60000ms | Maximum allowed timeout |
| `CHIP_ERASE_TIMEOUT` | 120000ms | Full chip erase timeout |
| `FLASH_READ_TIMEOUT` | 30000ms | Flash read packet timeout |

### Flash Sizes

| Constant | Value |
|----------|-------|
| `FLASH_SECTOR_SIZE` | 4096 bytes |
| `FLASH_WRITE_SIZE` | 1024 bytes (ROM) |
| `STUB_FLASH_WRITE_SIZE` | 16384 bytes (Stub) |

### USB IDs

| Constant | Value | Description |
|----------|-------|-------------|
| `USB_JTAG_SERIAL_PID` | `0x1001` | ESP32-C3/S3 native USB |

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
