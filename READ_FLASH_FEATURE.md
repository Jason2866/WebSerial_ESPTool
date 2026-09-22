# Read Flash Feature

## Overview

The read flash functionality allows reading flash memory directly from an ESP chip and downloading it as a binary file.

## Implementation

### `src/const.ts`
- Added: `ESP_READ_FLASH = 0xd2` command constant
- Added: `FLASH_READ_TIMEOUT = 100` timeout constant

### `src/esp_loader.ts`
- `readFlash(addr, size, onPacketReceived?)` method on `EspStubLoader`
  - Reads flash from the given address for the given number of bytes
  - Optional progress callback `(packet, bytesRead, totalSize) => void`
  - Returns a `Uint8Array` of the raw flash contents
  - Chunk-based with retry logic and adaptive throughput tuning
- `powerOnFlash()` — powers up the flash LDO on ESP32-P4 rev 301/302 before stub load
- UnixTight reset fallback in `runStub()` for ESP32-P4 rev 3.2 on external USB-serial bridges

### `src/stubs/index.ts`
Stub routing by chip family and revision:

| Stub file | Chip(s) |
|---|---|
| `esp32.json` | ESP32 |
| `esp32s2.json` | ESP32-S2 |
| `esp32s3.json` | ESP32-S3 |
| `esp8266.json` | ESP8266 |
| `esp32c2.json` | ESP32-C2 |
| `esp32c3.json` | ESP32-C3 |
| `esp32c5.json` | ESP32-C5 |
| `esp32c6.json` | ESP32-C6 |
| `esp32c61.json` | ESP32-C61 |
| `esp32h2.json` | ESP32-H2 |
| `esp32h4.json` | ESP32-H4 |
| `esp32h21.json` | ESP32-H21 |
| `esp32p4.json` | ESP32-P4 rev 300+ (ECO3 and later) |
| `esp32p4-rev1.json` | ESP32-P4 rev < 300 |
| `esp32s31.json` | ESP32-S31 |

All stubs are from **esp-flasher-stub v1.3.0** (September 2026)

## Usage

### Programmatic

```typescript
// Read 4 KB from flash offset 0x0
const data = await espStubLoader.readFlash(
  0x0,    // start address
  4096,   // size in bytes
  (packet, bytesRead, totalSize) => {
    console.log(`${bytesRead} / ${totalSize} bytes`);
  }
);
// data is a Uint8Array
```

### Protocol

1. Send `ESP_READ_FLASH` command with `(address, size, blockSize, maxInFlight)`
2. Receive data packets over SLIP
3. Acknowledge each packet
4. Repeat until all bytes are received

The `maxInFlight` window is 1024 packets.

## Supported Chips

All chips with a stub loader entry in `src/stubs/index.ts` support flash reading:

ESP32, ESP32-S2, ESP32-S3, ESP32-C2, ESP32-C3, ESP32-C5, ESP32-C6, ESP32-C61, ESP32-H2, ESP32-H4, ESP32-H21, ESP32-P4, ESP32-S31, ESP8266.

Flash reading requires stub mode — the ROM bootloader does not support `ESP_READ_FLASH`.

## ESP32-P4 Notes

- **Rev 301 (ECO6) and rev 302 (ECO7)**: flash power-on sequence runs before stub upload. Rev 302 checks an eFuse bit first; if the ROM already powers flash in download mode it only clears the PMU force-on bits.
- **Rev 302 on external USB-serial bridges**: if stub initialisation fails, one automatic retry is attempted using the UnixTight reset sequence (DTR/RTS pattern from WebSerial_ESPTool commit 16624ad).

## Build

```bash
npm run build
```

Compiles TypeScript and produces `dist/index.js` (CJS/ESM) and `dist/web/index.js` (browser bundle).
