
# 🚀 WebSerial ESPTool – Flash. Backup. Enjoy.

**The next-generation solution for ESP firmware – right in your browser!**

WebSerial ESPTool brings you hassle-free firmware flashing and backup for your ESP devices, directly from your browser. No drivers, no command line, no headaches. Just plug in your ESP, open your browser, and experience seamless, lightning-fast firmware management.

---

✨ **Why choose WebSerial ESPTool?**

- **Plug & Play:** Install and back up firmware straight from your browser – no software installation required!
- **Cutting-Edge Compatibility:** Supports the latest ESP MCUs and chip variants (including P4 revisions).
- **Blazing Fast & Reliable:** Optimized flashing and reading for maximum performance.
- **Truly Independent:** Not a clone of esptool.js – 100% original, innovative codebase!

> **Did you know?**
> - The [ESP32 Swiss Army Knife](https://github.com/Jason2866/esp32tool) is based on this project and available [online](https://jason2866.github.io/esp32tool/).
> - [ESPConnect](https://github.com/thelastoutpostworkshop/ESPConnect) also uses WebSerial ESPTool under the hood.

---

## 🛠️ Quick Start for Developers

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the dev environment: `script/develop`
4. Open [http://localhost:5004/](http://localhost:5004/) in your browser

---

## � Transport Options

WebSerial ESPTool supports multiple transport modes for connecting to your ESP devices:

### Web Serial (Default on Desktop)
- Uses the browser's Web Serial API
- Works with standard USB-to-serial drivers (CP210x, CH340, FTDI, etc.)
- No special configuration required on most platforms
- Recommended for most users

### WebUSB (Default on Android, Optional on Desktop)
- Direct USB communication without serial drivers
- Can bypass certain driver limitations (e.g., Windows CP210x driver issues)
- Requires WinUSB driver on Windows (see below)
- Always used on Android (where Web Serial has limited support)

### Selecting Transport Mode
Use the **Transport** dropdown in the header to choose:
- **Auto** (default): Web Serial on desktop, WebUSB on Android
- **Web Serial**: Force Web Serial API
- **WebUSB**: Force WebUSB mode

### Windows WebUSB Setup
To use WebUSB mode on Windows with USB-to-serial chips (CP210x, CH340, etc.), you need to replace the manufacturer's VCP driver with WinUSB:

1. Download [Zadig](https://zadig.akeo.ie/)
2. Connect your ESP device
3. Run Zadig and select your USB device (e.g., CP2102, CH340)
4. In the driver selection box, choose **WinUSB** (not libusb-win32)
5. Click **Replace Driver**
6. Your device will now work with WebUSB mode

**Important:** Replacing the driver with WinUSB will remove the COM port. Tools like esptool.py or Arduino IDE will not recognize the device until you restore the original VCP driver. You can restore it in Windows Device Manager by uninstalling the device and checking "Delete the driver software for this device", then reinstalling the manufacturer driver.

### Troubleshooting
- **CP210x on Windows**: If you experience slow reads or connection issues with CP210x chips at high baud rates on Windows, try WebUSB mode with WinUSB driver. See [Issue #308](https://github.com/Jason2866/WebSerial_ESPTool/issues/308) for details.
- **Android**: Always uses WebUSB automatically - no configuration needed.
- **macOS/Linux**: Web Serial works well with manufacturer drivers - WebUSB not typically needed.

---

## �🏆 The Story

Originally created by [Melissa LeBlanc-Williams](https://github.com/makermelissa), further developed by [Nabu Casa](https://www.nabucasa.com) and Adafruit, and now with new features.

**Latest update:** December 2025 – now with support for new MCUs, chip variants (P4), and ultra-fast flash reading!

---

© Adafruit, Nabu Casa & Johann Obermeier
