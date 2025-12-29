# SPIFFS Filesystem Support

This document describes the SPIFFS (SPI Flash File System) support in WebSerial ESPTool.

## Overview

SPIFFS is a file system designed for SPI NOR flash devices on embedded targets. This implementation provides read-only access to SPIFFS partitions on ESP32 devices through the web interface.

## Features

- **Read SPIFFS partitions**: Mount and browse SPIFFS filesystems from ESP32 devices
- **Write support**: Add, modify, and delete files in SPIFFS partitions
- **File extraction**: Download individual files from SPIFFS partitions
- **Backup support**: Export entire SPIFFS partition as binary image
- **Flash write**: Write modified SPIFFS image back to ESP32
- **Automatic detection**: Automatically detects SPIFFS partitions by magic number (0x20140529)

## Implementation

The SPIFFS implementation is based on the official ESP-IDF `spiffsgen.py` Python script, converted to TypeScript with both read and write capabilities in the core library.

### Core Components

- **SpiffsBuildConfig**: Configuration class with SPIFFS constants and calculations
- **SpiffsPage**: Page classes for object lookup, index, and data pages
- **SpiffsBlock**: Block management for organizing pages
- **SpiffsFS**: Main filesystem class for creating SPIFFS images
- **SpiffsReader**: Reader class for parsing existing SPIFFS images and extracting files

### Default Configuration

The default SPIFFS configuration for ESP32:
- Page size: 256 bytes
- Block size: 4096 bytes
- Object name length: 32 bytes
- Metadata length: 4 bytes
- Magic numbers: Enabled
- Magic length: Enabled

## Usage

### Web Interface

1. Connect to your ESP32 device
2. Click "Read Partitions" to scan the partition table
3. SPIFFS partitions (type 0x01, subtype 0x82) will show an "Open FS" button
4. Click "Open FS" to mount the SPIFFS partition
5. Browse, upload, download, and delete files in the Filesystem Manager
6. Click "Write to Flash" to save changes back to the ESP32

### Supported Operations

Full read/write support for SPIFFS partitions:
- ✓ Browse files
- ✓ Download individual files
- ✓ Upload new files
- ✓ Delete files
- ✓ Modify existing files
- ✓ Backup entire partition
- ✓ Write changes back to flash
- ✗ Create directories (SPIFFS is a flat filesystem without directory support)

Note: SPIFFS is a flat filesystem. All files are stored at the root level without directory hierarchy.

## API Reference

### SpiffsReader

```typescript
import { SpiffsReader, SpiffsBuildConfig, DEFAULT_SPIFFS_CONFIG } from 'webserial-esptool';

// Create configuration
const config = new SpiffsBuildConfig({
  ...DEFAULT_SPIFFS_CONFIG,
  imgSize: partitionSize,
});

// Create reader and parse
const reader = new SpiffsReader(imageData, config);
reader.parse();

// List files
const files = reader.listFiles();
// Returns: Array<{ name: string, size: number, data: Uint8Array }>

// Read specific file
const fileData = reader.readFile('/path/to/file.txt');
```

### SpiffsFS (Write Support)

```typescript
import { SpiffsFS, SpiffsBuildConfig, DEFAULT_SPIFFS_CONFIG } from 'webserial-esptool';

// Create configuration
const config = new SpiffsBuildConfig({
  ...DEFAULT_SPIFFS_CONFIG,
  imgSize: partitionSize,
});

// Create filesystem
const fs = new SpiffsFS(partitionSize, config);

// Add files
fs.createFile('/config.json', configData);
fs.createFile('/data.bin', binaryData);

// Generate binary image
const image = fs.toBinary();
```

## Filesystem Detection

SPIFFS partitions are detected by:
1. Partition type 0x01 (data) and subtype 0x82 (SPIFFS)
2. Magic number 0x20140529 at the beginning of the partition
3. If LittleFS signature is not found in a 0x82 partition, it's assumed to be SPIFFS

## Limitations

- **No directory support**: SPIFFS is a flat filesystem without directory hierarchy - all files are stored at root level
- **Wear leveling**: SPIFFS has limited wear leveling compared to LittleFS
- **Fragmentation**: SPIFFS can become fragmented over time
- **File recreation**: When modifying files, the entire SPIFFS image is recreated

## Migration to LittleFS

For new projects, consider using LittleFS instead of SPIFFS:
- Better wear leveling
- Directory support
- Better performance
- Full read/write support in WebSerial ESPTool

## Technical Details

### SPIFFS Structure

SPIFFS organizes flash memory into:
- **Blocks**: Large erasable units (typically 4096 bytes)
- **Pages**: Smaller units within blocks (typically 256 bytes)
- **Object Lookup Pages**: Track object locations
- **Object Index Pages**: Store file metadata (name, size, type)
- **Object Data Pages**: Store actual file content

### Magic Numbers

SPIFFS uses magic numbers for validation:
- Primary magic: 0x20140529
- Magic is XORed with page size and optionally block index
- Stored in the last object lookup page of each block

## References

- [ESP-IDF SPIFFS Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/storage/spiffs.html)
- [ESP-IDF spiffsgen.py](https://github.com/espressif/esp-idf/blob/master/components/spiffs/spiffsgen.py)
- [SPIFFS GitHub Repository](https://github.com/pellepl/spiffs)
