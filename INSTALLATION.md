# Installation and Setup

## LittleFS Support

LittleFS functionality has been successfully added to WebSerial ESPTool.

### Prerequisites

The WASM files for LittleFS are located in `js/wasm/littlefs/`:
- `index.js` - JavaScript wrapper for LittleFS
- `index.d.ts` - TypeScript definitions
- `littlefs.js` - Emscripten-generated loader
- `littlefs.wasm` - Compiled LittleFS library

### Build Process

```bash
# 1. Install dependencies
npm install

# 2. Build project
npm run build
```

### Development

For local development:

```bash
# Start development server
npm run develop
```

Or simply open `index.html` in a modern browser (Chrome/Edge with Web Serial API support).

### Deployment

The built files are located in:
- `js/modules/esptool.js` - Main ESPTool module
- `js/wasm/littlefs/` - LittleFS WASM files

All files must be deployed together for LittleFS functionality to work.

### Electron App

For the Electron desktop app:

```bash
# Start Electron app
npm start

# Package Electron app
npm run package

# Create installer
npm run make
```

## New Features

### LittleFS Filesystem Manager
- Automatic detection of LittleFS partitions
- File management (upload, download, delete)
- Folder navigation
- Backup function
- Storage usage display

### Usage
1. Connect to ESP device
2. Click "Read Partition Table"
3. Click "Open FS" on LittleFS partitions
4. Manage files in the filesystem manager

See `LITTLEFS_FEATURE.md` for detailed documentation.
