# LittleFS Filesystem Manager

## Overview

WebSerial ESPTool now supports detection and management of LittleFS partitions on ESP32/ESP8266 devices.

## Features

### Automatic Filesystem Detection
- Automatically detects LittleFS partitions in the partition table
- Distinguishes between LittleFS and SPIFFS through signature recognition
- Supports various block sizes (512, 1024, 2048, 4096 bytes)

### File Management
- **View Files**: Hierarchical view of all files and folders
- **Navigation**: Navigate through directories with breadcrumb navigation
- **Upload**: Upload files from computer to device
- **Download**: Download files from device to computer
- **Delete**: Delete files and folders (recursively)
- **Create Folders**: Create new directories

### Filesystem Information
- Storage usage with visual progress indicator
- Display LittleFS disk version (v2.0, v2.1)
- Partition size and name
- Free/used storage

### Backup & Restore
- **Backup**: Save complete filesystem image as .bin file
- Image can be restored later using "Read Flash"

## Usage

### 1. Establish Connection
1. Click "Connect" and select your ESP device
2. Wait until the connection is established

### 2. Read Partition Table
1. Click "Read Partition Table"
2. The partition table will be displayed
3. Partitions with filesystem (Type: data, SubType: spiffs) show an "Open FS" button

### 3. Open Filesystem
1. Click "Open FS" on a partition
2. The system automatically detects the filesystem type
3. For LittleFS, the filesystem manager opens

### 4. Manage Files
- **Navigate**: Click on folder names to open them
- **Upload**: Select a file and click "Upload File"
- **Download**: Click "Download" on a file
- **Delete**: Click "Delete" on files or folders
- **Create Folder**: Click "New Folder" and enter a name

### 5. Create Backup
1. Click "Backup Image" in the filesystem manager
2. The complete filesystem is saved as a .bin file
3. This can be restored later using "Read Flash"

## Technical Details

### Supported Block Sizes
- 4096 bytes (default for ESP32)
- 2048 bytes
- 1024 bytes
- 512 bytes

The system automatically tries all block sizes and selects the appropriate one.

### Filesystem Detection

The automatic detection uses multiple methods:

#### Method 1: String Signature (Primary)
- LittleFS stores the string "littlefs" in the superblock metadata
- The first 8KB of the partition are read and searched for this string
- This is the most reliable method for LittleFS detection

#### Method 2: Block Structure Analysis
- LittleFS uses a specific block structure with metadata tags
- Tag format: `type (12 bits) | id (10 bits) | length (10 bits)`
- Valid metadata types: 0x000-0x7FF
- The function checks various block sizes (512, 1024, 2048, 4096 bytes)

#### Method 3: SPIFFS Magic Numbers
- SPIFFS uses specific magic numbers in object headers
- Known SPIFFS magic numbers: `0x20140529`, `0x20160529`
- If these are found, SPIFFS is detected

#### Fallback Strategy
- If no clear signature is found, SPIFFS is assumed
- SPIFFS is older and more common, making it the safe default
- Error messages are logged for debugging

#### Technical Details

**LittleFS Superblock Structure:**
```
Block 0 & 1: Superblock (redundant for fault tolerance)
├── CRC32 Checksum
├── Version (0x00020000 = v2.0, 0x00020001 = v2.1)
├── Block Size
├── Block Count
├── Name Max Length
└── Metadata with "littlefs" string
```

**Why does the string search work?**
- LittleFS stores configuration parameters as metadata
- The string "littlefs" is part of the filesystem identification
- This enables simple and reliable detection
- No confusion with SPIFFS possible (SPIFFS doesn't have this string)

**Detection Flow:**
1. Read first 8KB (covers multiple blocks)
2. ASCII decode the data
3. Search for "littlefs" string
4. On success: LittleFS detected ✓
5. On failure: Structure analysis
6. On failure: SPIFFS magic search
7. Fallback: SPIFFS assumed

### Integration with littlefs-wasm
The implementation uses the `littlefs-wasm` package, which compiles LittleFS to WebAssembly and runs in the browser. All operations occur locally in browser memory.

## Limitations

- **Read Only**: Changes are only made locally in the browser
- **No Direct Writing**: To transfer changes to the device, the complete image must be re-flashed
- **SPIFFS**: Not yet implemented (only LittleFS is supported)
- **Memory**: Large partitions can require significant browser RAM

## Example Workflow

### Update Files on ESP32
1. Connect to the ESP32
2. Read the partition table
3. Open the LittleFS partition (e.g., "spiffs")
4. Create a backup (recommended!)
5. Upload new files or delete old ones
6. Click "Backup Image" to save the modified filesystem
7. Flash the saved image back to the device using "Program"

## Troubleshooting

### "Failed to mount LittleFS with any block size"
- The partition may not be formatted
- The partition might be using SPIFFS instead of LittleFS
- The partition could be corrupted

### "Failed to detect filesystem type"
- Check the connection to the device
- Ensure the partition exists
- Try reformatting the partition

### Files not displayed
- Click "Refresh" to update the view
- Check if you're in the correct directory
- The partition might be empty

## Reference Implementation

This implementation is based on the complete LittleFS integration in ESPConnect and uses:
- `littlefs-wasm` for filesystem operations
- Automatic block size detection
- Hierarchical file navigation
- Complete CRUD operations (Create, Read, Update, Delete)
