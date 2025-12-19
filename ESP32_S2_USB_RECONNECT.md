# ESP32-S2 Native USB Reconnection Feature

## Overview

The ESP32-S2 has a unique USB implementation where the chip can switch between different USB modes. When initially connecting via the ROM bootloader USB port, the chip may switch to USB CDC mode after initialization, causing the original port to disconnect.

This feature automatically detects this scenario and provides an event-based API for applications to handle the port reselection gracefully.

## Problem Description

When connecting to an ESP32-S2 via its native USB interface:

1. The browser initially connects to the **ROM bootloader USB port**
2. After certain operations, the ESP32-S2 switches to **USB CDC mode**
3. The original port becomes invalid and disconnects
4. A new serial port appears that needs to be selected

Previously, this resulted in a "Read loop got disconnected" error without any recovery mechanism.

## Solution

The ESPLoader now:

1. **Detects ESP32-S2 Native USB** via USB Vendor ID (`0x303a`) and Product ID (`0x0002`)
2. **Tracks initialization success** to distinguish between legitimate disconnects and port-switch scenarios
3. **Dispatches a custom event** when port reselection is needed
4. Applications can listen for this event and prompt the user to select the new port

## API Reference

### Event: `esp32s2-usb-reconnect`

Dispatched when the ESP32-S2 Native USB port disconnects before initialization completes, indicating that the user needs to select the new USB CDC port.

#### Event Details

```typescript
interface ESP32S2ReconnectEvent extends CustomEvent {
  detail: {
    message: string;  // "ESP32-S2 Native USB requires port reselection"
  }
}
```

#### When It Fires

The event is dispatched when **all** of the following conditions are met:

- USB Vendor ID is `0x303a` (Espressif)
- USB Product ID is `0x0002` (ESP32-S2 Native USB)
- The read loop disconnects
- Initialization has **not** completed successfully

#### When It Does NOT Fire

- When connected via USB-Serial bridge chips (CH340, CP2102, FTDI, etc.)
- When initialization completes successfully (correct port selected)
- When disconnecting after successful communication

### Usage Example

```javascript
import { ESPLoader } from 'tasmota-webserial-esptool';

async function connectToESP32() {
  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  
  const logger = {
    log: (msg) => console.log(msg),
    debug: (msg) => console.debug(msg),
    error: (msg) => console.error(msg),
  };
  
  const esploader = new ESPLoader(port, logger);
  
  // Listen for ESP32-S2 USB port switch event
  esploader.addEventListener("esp32s2-usb-reconnect", async (event) => {
    console.log("ESP32-S2 USB mode switch detected:", event.detail.message);
    
    // Close and forget the old port
    try {
      await port.close();
    } catch (e) {
      console.debug("Port close error:", e);
    }
    
    try {
      await port.forget();
    } catch (e) {
      console.debug("Port forget error:", e);
    }
    
    // Prompt user to select the new port
    alert("Please select the new ESP32-S2 USB CDC port");
    
    const newPort = await navigator.serial.requestPort();
    await newPort.open({ baudRate: 115200 });
    
    // Create new ESPLoader with the new port
    const newEsploader = new ESPLoader(newPort, logger);
    await newEsploader.initialize();
    
    // Continue with operations...
  });
  
  // Also listen for general disconnect events
  esploader.addEventListener("disconnect", () => {
    console.log("ESP disconnected");
  });
  
  try {
    await esploader.initialize();
    console.log("Connected to:", esploader.chipName);
  } catch (error) {
    console.error("Connection failed:", error);
  }
}
```

### Integration with UI

For a better user experience, applications should:

1. Show a modal dialog explaining the situation
2. Provide a button that triggers `navigator.serial.requestPort()`
3. Handle the new port selection and reinitialize

Example modal implementation:

```html
<div id="esp32s2Modal" class="modal hidden">
  <div class="modal-content">
    <h2>⚠️ ESP32-S2 Native USB Detected</h2>
    <p>The ESP32-S2 has switched to USB CDC mode.</p>
    <p>Please click the button below to select the new serial port.</p>
    <button id="butReconnectS2" type="button" class="modal-button">
      Select New Port
    </button>
  </div>
</div>
```

```javascript
esploader.addEventListener("esp32s2-usb-reconnect", async () => {
  // Show modal
  document.getElementById("esp32s2Modal").classList.remove("hidden");
  
  // Handle button click
  document.getElementById("butReconnectS2").onclick = async () => {
    document.getElementById("esp32s2Modal").classList.add("hidden");
    
    await port.close();
    await port.forget();
    
    const newPort = await navigator.serial.requestPort();
    // ... continue with new port
  };
});
```

## Backward Compatibility

This feature is **fully backward compatible**:

| Aspect | Compatibility |
|--------|---------------|
| Existing method signatures | ✅ Unchanged |
| Return values | ✅ Unchanged |
| Required parameters | ✅ Unchanged |
| Event subscription | ✅ Optional (can be ignored) |
| Non-ESP32-S2 devices | ✅ No change in behavior |

Existing code will continue to work without modifications. The new event is purely additive.

## Technical Details

### Detection Logic

```typescript
// In ESPLoader.initialize()
const portInfo = this.port.getInfo();
if (portInfo.usbVendorId === 0x303a && portInfo.usbProductId === 0x2) {
  this._isESP32S2NativeUSB = true;
}
```

### Event Dispatch Logic

```typescript
// In ESPLoader.readLoop()
if (this._isESP32S2NativeUSB && !this._initializationSucceeded) {
  this.dispatchEvent(
    new CustomEvent("esp32s2-usb-reconnect", {
      detail: { message: "ESP32-S2 Native USB requires port reselection" },
    }),
  );
}
```

## Supported USB IDs

| Vendor ID | Product ID | Device |
|-----------|------------|--------|
| `0x303a` | `0x0002` | ESP32-S2 Native USB (ROM bootloader) |

Note: After the mode switch, the ESP32-S2 may appear with a different Product ID depending on the USB configuration in the firmware.

## Related Events

| Event | Description |
|-------|-------------|
| `disconnect` | General disconnection event (always fired) |
| `esp32s2-usb-reconnect` | ESP32-S2 specific port reselection needed |

## Troubleshooting

### Event fires repeatedly

Ensure you have a guard to prevent recursive handling:

```javascript
let reconnectInProgress = false;

esploader.addEventListener("esp32s2-usb-reconnect", async () => {
  if (reconnectInProgress) return;
  reconnectInProgress = true;
  
  try {
    // Handle reconnection...
  } finally {
    reconnectInProgress = false;
  }
});
```

### Port selection dialog doesn't appear

The `navigator.serial.requestPort()` call must be triggered by a user gesture (click). You cannot call it automatically in response to the event.

### Old port not released

Always call both `port.close()` and `port.forget()` to fully release the old port:

```javascript
await port.close();
await port.forget();  // Important: releases the port from browser permissions
```
