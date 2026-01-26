// Import WebUSB serial support for Android compatibility
import { WebUSBSerial, requestSerialPort } from './webusb-serial.js';

// Make requestSerialPort available globally for esptool.js
// Use defensive assignment to avoid accidental overwrites
if (!globalThis.requestSerialPort) {
  globalThis.requestSerialPort = requestSerialPort;
}

// Utility functions imported from esptool module
let toHex, formatMacAddr, sleep;

// Load utilities from esptool package
window.esptoolPackage.then((esptoolMod) => {
  toHex = esptoolMod.toHex;
  formatMacAddr = esptoolMod.formatMacAddr;
  sleep = esptoolMod.sleep;
});

let espStub;
let esp32s2ReconnectInProgress = false;
let currentChipName = null; // Store chip name globally
let currentMacAddr = null; // Store MAC address globally
let isConnected = false; // Track connection state
let consoleInstance = null; // ESP32ToolConsole instance
let baudRateBeforeConsole = null; // Store baudrate before opening console
let espLoaderBeforeConsole = null; // Store original ESPLoader before console
let chipFamilyBeforeConsole = null; // Store chipFamily before opening console
let consoleResetHandler = null;
let consoleCloseHandler = null;

/**
 * Clear all cached data and state on disconnect
 */
function clearAllCachedData() {

  // Clear partition list
  partitionList.innerHTML = '';
  partitionList.classList.add('hidden');
  
  // Show the Read Partition Table button again
  butReadPartitions.classList.remove('hidden');
  
  // Hide ESP8266 info (if it exists)
  const esp8266Info = document.getElementById('esp8266Info');
  if (esp8266Info) {
    esp8266Info.classList.add('hidden');
  }
}

const baudRates = [2000000, 1500000, 921600, 500000, 460800, 230400, 153600, 128000, 115200];

const maxLogLength = 100;
const log = document.getElementById("log");
const butConnect = document.getElementById("butConnect");
const baudRateSelect = document.getElementById("baudRate");
const butClear = document.getElementById("butClear");
const butErase = document.getElementById("butErase");
const butProgram = document.getElementById("butProgram");
const butReadFlash = document.getElementById("butReadFlash");
const readOffset = document.getElementById("readOffset");
const readSize = document.getElementById("readSize");
const readProgress = document.getElementById("readProgress");
const butReadPartitions = document.getElementById("butReadPartitions");
const partitionList = document.getElementById("partitionList");
const autoscroll = document.getElementById("autoscroll");
const lightSS = document.getElementById("light");
const darkSS = document.getElementById("dark");
const darkMode = document.getElementById("darkmode");
const debugMode = document.getElementById("debugmode");
const showLog = document.getElementById("showlog");
const firmware = document.querySelectorAll(".upload .firmware input");
const progress = document.querySelectorAll(".upload .progress-bar");
const offsets = document.querySelectorAll(".upload .offset");
const appDiv = document.getElementById("app");

// Mobile detection
function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile user agents
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);
  
  // Check for touch support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check screen size
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobileUA || (hasTouch && isSmallScreen);
}

/**
 * Detect if we're using WebUSB (mobile/Android) or Web Serial (desktop)
 * WebUSB is typically used on Android devices
 * Web Serial is used on desktop browsers
 */
function isUsingWebUSB() {
  // If we have an active connection, check the port's isWebUSB property
  if (espStub && espStub.port && typeof espStub.port.isWebUSB !== 'undefined') {
    return espStub.port.isWebUSB === true;
  }
  
  // Fallback: Check if we're on a mobile device (likely using WebUSB)
  if (isMobileDevice()) {
    return true;
  }
  
  // Check if Web Serial is NOT available but USB is (WebUSB only)
  if (!("serial" in navigator) && "usb" in navigator) {
    return true;
  }
  
  // Default to Web Serial (desktop)
  return false;
}

// Update mobile classes and padding
function updateMobileClasses() {
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    document.body.classList.add('mobile-device');
    document.body.classList.add('no-hover');
  } else {
    document.body.classList.remove('mobile-device');
    document.body.classList.remove('no-hover');
  }
  
  // Update main padding to match header height
  updateMainPadding();
}

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced resize handler
const debouncedUpdateMobileClasses = debounce(updateMobileClasses, 250);

// Apply mobile class on load
updateMobileClasses();

// Update on resize and orientation change
window.addEventListener('resize', debouncedUpdateMobileClasses);
window.addEventListener('orientationchange', debouncedUpdateMobileClasses);

document.addEventListener("DOMContentLoaded", () => {
  butConnect.addEventListener("click", () => {
    clickConnect().catch(async (e) => {
      debugMsg('Connection error: ' + e);
      errorMsg(e.message || e);
      if (espStub) {
        await espStub.disconnect();
      }
      toggleUIConnected(false);
    });
  });
  butClear.addEventListener("click", clickClear);
  butErase.addEventListener("click", clickErase);
  butProgram.addEventListener("click", clickProgram);
  butReadFlash.addEventListener("click", clickReadFlash);
  butReadPartitions.addEventListener("click", clickReadPartitions);
  for (let i = 0; i < firmware.length; i++) {
    firmware[i].addEventListener("change", checkFirmware);
  }
  for (let i = 0; i < offsets.length; i++) {
    offsets[i].addEventListener("change", checkProgrammable);
  }
  
  // Initialize upload rows visibility - only show first row
  updateUploadRowsVisibility();
  
  autoscroll.addEventListener("click", clickAutoscroll);
  baudRateSelect.addEventListener("change", changeBaudRate);
  darkMode.addEventListener("click", clickDarkMode);
  debugMode.addEventListener("click", clickDebugMode);
  showLog.addEventListener("click", clickShowLog);
  window.addEventListener("error", function (event) {
    console.log("Got an uncaught error: ", event.error);
  });

  // Check for Web Serial or WebUSB support
  if ("serial" in navigator || "usb" in navigator) {
    const notSupported = document.getElementById("notSupported");
    notSupported.classList.add("hidden");
  }

  initBaudRate();
  loadAllSettings();
  updateTheme();
  logMsg("WebSerial ESPTool loaded.");
  
  // Set initial main padding based on header height
  updateMainPadding();
});

function initBaudRate() {
  for (let rate of baudRates) {
    var option = document.createElement("option");
    option.text = rate + " Baud";
    option.value = rate;
    baudRateSelect.add(option);
  }
}

function logMsg(text) {
  log.innerHTML += text + "<br>";

  // Remove old log content
  if (log.textContent.split("\n").length > maxLogLength + 1) {
    let logLines = log.innerHTML.replace(/(\n)/gm, "").split("<br>");
    log.innerHTML = logLines.splice(-maxLogLength).join("<br>\n");
  }

  if (autoscroll.checked) {
    log.scrollTop = log.scrollHeight;
  }
}

/**
 * Append one or more debug-formatted values to the application log when debug mode is enabled.
 *
 * Formats primitive values (strings, numbers, booleans), `null`, and `undefined` as readable text;
 * formats Array and `Uint8Array` elements as hex bytes (e.g., `0x1a`) inside brackets; logs other
 * object types to the browser console and records a message indicating an unhandled type.
 *
 * @param {...any} args - Values to format and append to the debug log. The first argument is written
 *   without a leading prefix; subsequent arguments are appended without additional prefixes.
 */
function debugMsg(...args) {
  if (!debugMode.checked) {
    return;
  }

  let prefix = "";
  for (let arg of args) {
    if (arg === undefined) {
      logMsg(prefix + "undefined");
    } else if (arg === null) {
      logMsg(prefix + "null");
    } else if (typeof arg == "string") {
      logMsg(prefix + arg);
    } else if (typeof arg == "number") {
      logMsg(prefix + arg);
    } else if (typeof arg == "boolean") {
      logMsg(prefix + (arg ? "true" : "false"));
    } else if (Array.isArray(arg)) {
      logMsg(prefix + "[" + arg.map((value) => toHex(value)).join(", ") + "]");
    } else if (typeof arg == "object" && arg instanceof Uint8Array) {
      logMsg(
        prefix +
          "[" +
          Array.from(arg)
            .map((value) => toHex(value))
            .join(", ") +
          "]",
      );
    } else {
      logMsg(prefix + "Unhandled type of argument:" + typeof arg);
      console.log(arg);
    }
    prefix = ""; // Only show for first argument
  }
}

function errorMsg(text) {
  logMsg('<span class="error-message">Error:</span> ' + text);
  console.error(text);
}

/**
 * @name updateTheme
 * Sets the theme to dark mode. Can be refactored later for more themes
 */
function updateTheme() {
  // Disable all themes
  document
    .querySelectorAll("link[rel=stylesheet].alternate")
    .forEach((styleSheet) => {
      enableStyleSheet(styleSheet, false);
    });

  if (darkMode.checked) {
    enableStyleSheet(darkSS, true);
  } else {
    enableStyleSheet(lightSS, true);
  }
}

function enableStyleSheet(node, enabled) {
  node.disabled = !enabled;
}

/**
 * Parse flash size string (e.g., "256KB", "4MB") to bytes
 * @param {string} sizeStr - Flash size string with unit (KB or MB)
 * @returns {number} Size in bytes
 */
function parseFlashSize(sizeStr) {
  if (!sizeStr || typeof sizeStr !== 'string') {
    return 0;
  }
  
  // Extract number and unit
  const match = sizeStr.match(/^(\d+)(KB|MB)$/i);
  if (!match) {
    // If no unit, assume it's already in MB (legacy behavior)
    const num = parseInt(sizeStr);
    return isNaN(num) ? 0 : num * 1024 * 1024;
  }
  
  const value = parseInt(match[1]);
  const unit = match[2].toUpperCase();
  
  if (unit === 'KB') {
    return value * 1024; // KB to bytes
  } else if (unit === 'MB') {
    return value * 1024 * 1024; // MB to bytes
  }
  
  return 0;
}

/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */
async function clickConnect() {
  console.log('[clickConnect] Function called');
  
  if (espStub) {
    console.log('[clickConnect] Already connected, disconnecting...');
    // Remove disconnect event listener to prevent it from firing during manual disconnect
    if (espStub.handleDisconnect) {
      espStub.removeEventListener("disconnect", espStub.handleDisconnect);
    }
    
    await espStub.disconnect();
    try {
      await espStub.port?.close?.();
    } catch (e) {
      // ignore double-close
    }
    toggleUIConnected(false);
    espStub = undefined;

    // Clear all cached data and state
    clearAllCachedData();

    return;
  }

  console.log('[clickConnect] Getting esploaderMod...');
  const esploaderMod = await window.esptoolPackage;

  // Platform detection: Android always uses WebUSB, Desktop uses Web Serial
  const userAgent = navigator.userAgent || '';
  const isAndroid = /Android/i.test(userAgent);
  
  // Only log platform details to UI in debug mode (avoid fingerprinting surface)
  if (debugMode.checked) {
    const platformMsg = `Platform: ${isAndroid ? 'Android' : 'Desktop'} (UA: ${userAgent.substring(0, 50)}...)`;
    logMsg(platformMsg);
  }
  logMsg(`Using: ${isAndroid ? 'WebUSB' : 'Web Serial'}`);
  
  let esploader;
  
  if (isAndroid) {
    // Android: Use WebUSB directly
    console.log('[Connect] Using WebUSB for Android');
    try {
      const port = await WebUSBSerial.requestPort((...args) => logMsg(...args));
      esploader = await esploaderMod.connectWithPort(port, {
        log: (...args) => logMsg(...args),
        debug: (...args) => debugMsg(...args),
        error: (...args) => errorMsg(...args),
      });
    } catch (err) {
      logMsg(`WebUSB connection failed: ${err.message || err}`);
      throw err;
    }
  } else {
    // Desktop: Use Web Serial (standard esptool connect)
    console.log('[Connect] Using Web Serial for Desktop');
    esploader = await esploaderMod.connect({
      log: (...args) => logMsg(...args),
      debug: (...args) => debugMsg(...args),
      error: (...args) => errorMsg(...args),
    });
  }
  
  // Handle ESP32-S2 Native USB reconnection requirement for BROWSER
  // Only add listener if not already in reconnect mode
  if (!esp32s2ReconnectInProgress) {
    esploader.addEventListener("esp32s2-usb-reconnect", async () => {
      // Prevent recursive calls
      if (esp32s2ReconnectInProgress) {
        return;
      }
      
      esp32s2ReconnectInProgress = true;
      logMsg("ESP32-S2 Native USB detected!");
      toggleUIConnected(false);
      const previousStubPort = espStub?.port;
      espStub = undefined;
      
      try {
        // Close the port first
        await esploader.port.close();

        // Use the modal dialog approach
        if (previousStubPort && previousStubPort.readable) {
          await previousStubPort.close();
        }
      } catch (closeErr) {
        // Ignore port close errors
        debugMsg(`Port close error (ignored): ${closeErr.message}`);
      }
      
      // Show modal dialog
      const modal = document.getElementById("esp32s2Modal");
      const reconnectBtn = document.getElementById("butReconnectS2");
        
      modal.classList.remove("hidden");
        
      // Handle reconnect button click
      const handleReconnect = async () => {
        modal.classList.add("hidden");
        reconnectBtn.removeEventListener("click", handleReconnect);
          
        logMsg("Requesting new device selection...");
          
        // Trigger port selection
        try {
          await clickConnect();
          // Reset flag on successful connection
          esp32s2ReconnectInProgress = false;
        } catch (err) {
          errorMsg("Failed to reconnect: " + err);
          // Reset flag on error so user can try again
          esp32s2ReconnectInProgress = false;
        }
      };
      reconnectBtn.addEventListener("click", handleReconnect);
    });
  }
  
  try {
    await esploader.initialize();
  } catch (err) {
    // If ESP32-S2 reconnect is in progress (handled by event listener), suppress the error
    if (esp32s2ReconnectInProgress) {
      logMsg("Initialization interrupted for ESP32-S2 reconnection.");
      return;
    }
    
    // Not ESP32-S2 or other error
    try {
      await esploader.disconnect();
    } catch (disconnectErr) {
      // Ignore disconnect errors
    }
    throw err;
  }

  logMsg("Connected to " + esploader.chipName);
  logMsg("MAC Address: " + formatMacAddr(esploader.macAddr()));

  // Store chip info globally
  currentChipName = esploader.chipName;
  currentMacAddr = formatMacAddr(esploader.macAddr());

  espStub = await esploader.runStub();
  
  toggleUIConnected(true);
  toggleUIToolbar(true);

  // Set detected flash size in the read size field
  if (espStub.flashSize) {
    const flashSizeBytes = parseFlashSize(espStub.flashSize);
    readSize.value = "0x" + flashSizeBytes.toString(16);
  }
  
  // Set the selected baud rate
  let baud = parseInt(baudRateSelect.value);
  if (baudRates.includes(baud)) {
    await espStub.setBaudrate(baud);
  }
  
  // Store disconnect handler so we can remove it later
  const handleDisconnect = () => {
    toggleUIConnected(false);
    espStub = false;
  };
  espStub.handleDisconnect = handleDisconnect; // Store reference on espStub
  espStub.addEventListener("disconnect", handleDisconnect);
}

/**
 * @name changeBaudRate
 * Change handler for the Baud Rate selector.
 */
async function changeBaudRate() {
  saveSetting("baudrate", baudRateSelect.value);
  if (espStub) {
    let baud = parseInt(baudRateSelect.value);
    if (baudRates.includes(baud)) {
      await espStub.setBaudrate(baud);
    }
  }
}

/**
 * @name clickAutoscroll
 * Change handler for the Autoscroll checkbox.
 */
async function clickAutoscroll() {
  saveSetting("autoscroll", autoscroll.checked);
}

/**
 * @name clickDarkMode
 * Change handler for the Dark Mode checkbox.
 */
async function clickDarkMode() {
  updateTheme();
  saveSetting("darkmode", darkMode.checked);
}

/**
 * @name clickDebugMode
 * Change handler for the Debug Mode checkbox.
 */
async function clickDebugMode() {
  saveSetting("debugmode", debugMode.checked);
  logMsg("Debug mode " + (debugMode.checked ? "enabled" : "disabled"));
}

/**
 * @name clickShowLog
 * Change handler for the Show Log checkbox.
 */
async function clickShowLog() {
  saveSetting("showlog", showLog.checked);
  updateLogVisibility();
}

/**
 * @name openConsolePortAndInit
 * Helper to open port for console and initialize console UI
 * Avoids code duplication across different console init flows
 */
async function openConsolePortAndInit(newPort) {
  // Open the port at 115200 for console
  await newPort.open({ baudRate: 115200 });
  espStub.port = newPort;
  espStub.connected = true;
  
  // Keep parent/loader in sync (used by closeConsole)
  if (espStub._parent) {
    espStub._parent.port = newPort;
  }
  if (espLoaderBeforeConsole) {
    espLoaderBeforeConsole.port = newPort;
  }
  
  debugMsg("Port opened for console at 115200 baud");
  
  // Device is already in firmware mode, port is open at 115200
  // Initialize console directly
  saveSetting("console", true);
  
  // Initialize console UI and handlers
  await initConsoleUI();
}

/**
 * @name clickConsole
 * Change handler for the Console checkbox.
 */
async function clickConsole() {
  // Check if console elements exist
  if (!consoleSwitch) {
    logMsg("Console function not available - HTML elements not found");
    return;
  }
  
  if (shouldEnable) {
    // After WDT reset, everything is gone - start fresh with port selection
    // Initialize console if connected and not already created
    if (isConnected && espStub && espStub.port && !consoleInstance) {
      try {
        // CRITICAL: Save current state BEFORE changing anything
        // If espStub has a parent, we need to get the baudrate from the parent!
        // The stub child can not be used for restoring the stub. the parent must be used!
        const loaderToSave = espStub._parent || espStub;
        const currentBaudrate = loaderToSave.currentBaudRate;
        const currentChipFamily = espStub.chipFamily;

        // CRITICAL: Save the PARENT loader (not the stub child!)
        espLoaderBeforeConsole = loaderToSave;
        baudRateBeforeConsole = currentBaudrate;
        chipFamilyBeforeConsole = currentChipFamily;

        // Console ALWAYS runs at 115200 baud (firmware default)
        // Always set baudrate to 115200 before opening console
        try {
          await espStub.setBaudrate(115200);
          debugMsg("Baudrate set to 115200 for console");
        } catch (baudErr) {
          logMsg(`Failed to set baudrate to 115200: ${baudErr.message}`);
        }
        
        // Enter console mode - handles both USB-JTAG and serial chip devices
        try {
          const portWasClosed = await espStub.enterConsoleMode();
          
          if (portWasClosed) {
            // USB-JTAG/OTG device: Port was closed after WDT reset
            debugMsg("Device reset to firmware mode (port closed)");
            
            // Wait for device to boot and USB port to become available
            // Android/WebUSB needs more time than Desktop for USB enumeration
            const isWebUSB = isUsingWebUSB();
            const waitTime = isWebUSB ? 1000 : 500; // 1s for Android, 500ms for Desktop
            debugMsg(`Waiting ${waitTime}ms for device to boot and USB to enumerate...`);
            await sleep(waitTime);
            
            // Check if this is ESP32-S2 or if we're on Android (WebUSB)
            // Both need modal for user gesture
            const isS2 = chipFamilyBeforeConsole === 0x3252; // CHIP_FAMILY_ESP32S2 = 0x3252
            const needsModal = isS2 || isWebUSB;
            
            if (needsModal) {
              // ESP32-S2 (all platforms) or Android (all chips): Use modal for user gesture
              
              // Close old port if still open
              try {
                if (espStub.port && espStub.port.readable) {
                  await espStub.port.close();
                  debugMsg("Old port closed");
                }
              } catch (closeErr) {
                debugMsg(`Port close error (ignored): ${closeErr.message}`);
              }
              
              // Wait a bit for browser to process
              await sleep(100);
              
              // Show modal for port selection (requires user gesture)
              const modal = document.getElementById("esp32s2Modal");
              const reconnectBtn = document.getElementById("butReconnectS2");
              
              // Update modal text for console mode
              const modalTitle = modal.querySelector("h2");
              const modalText = modal.querySelector("p");
              if (modalTitle) modalTitle.textContent = "Device has been reset to firmware mode";
              if (modalText) {
                modalText.textContent = isWebUSB 
                  ? "Please click the button below to select the USB device for console."
                  : "Please click the button below to select the serial port for console.";
              }
              
              modal.classList.remove("hidden");
              
              // Handle reconnect button click (single-fire to prevent multiple prompts)
              const handleReconnect = async () => {
                modal.classList.add("hidden");
                
                try {
                  // Request the NEW port (user gesture from button click)
                  debugMsg("Please select the port for console mode...");
                  const newPort = isWebUSB
                    ? await WebUSBSerial.requestPort((...args) => logMsg(...args))
                    : await navigator.serial.requestPort();
                  
                  // Use helper to open port and initialize console
                  await openConsolePortAndInit(newPort);
                } catch (err) {
                  errorMsg(`Failed to open port for console: ${err.message}`);
                  if (consoleSwitch) {
                    saveSetting("console", false);
                  }
                }
              };
              
              // Use { once: true } to ensure single-fire and automatic cleanup
              reconnectBtn.addEventListener("click", handleReconnect, { once: true });
            } else {
              // Desktop (Web Serial) with ESP32-S3/C3/C5/C6/H2/P4: Direct requestPort
              try {
                // Request port selection from user (direct)
                debugMsg("Please select the serial port again for console mode...");
                const newPort = await navigator.serial.requestPort();
                
                // Use helper to open port and initialize console
                await openConsolePortAndInit(newPort);
              } catch (err) {
                errorMsg(`Failed to open port for console: ${err.message}`);
                if (consoleSwitch) {
                  saveSetting("console", false);
                }
              }
            }
            
            return;
          } else {
            // Serial chip device: Port stays open
            debugMsg("Device reset to firmware mode");
          }
        } catch (err) {
          errorMsg(`Failed to enter console mode: ${err.message}`);
          if (consoleSwitch) {
            saveSetting("console", false);
          }
          return;
        }
        
        // Wait for:
        // - Firmware to start after reset
        // - Port to be ready for new reader
        await sleep(200);
        
        // Initialize console UI and handlers
        await initConsoleUI();
        
        saveSetting("console", true);
      } catch (err) {
        errorMsg("Failed to initialize console: " + err.message);
        if (consoleSwitch) {
          saveSetting("console", false);
        }
        await closeConsole();
      }
    } else if (!isConnected) {
      // Not connected - just show message
      if (consoleSwitch) {
        saveSetting("console", false);
      }
      errorMsg("Please connect to device first");
    }
  } else {
    await closeConsole();
    saveSetting("console", false);
  }
}

/**
 * @name closeConsole
 * Close console and restore device to bootloader state
 */
async function closeConsole() {
  // Remove console-active class from body FIRST to restore visibility
  document.body.classList.remove("console-active");
  
  // Hide console and show commands again
  const commands = document.getElementById("commands");
  if (commands) {
    commands.classList.remove("hidden");
    // Force display to ensure it's visible
    commands.style.display = "";
  }
  
  // Restore original state (bootloader + stub + baudrate)
  if (espLoaderBeforeConsole && Number.isFinite(baudRateBeforeConsole)) {
    // Disconnect console first to release locks
    if (consoleInstance) {
      try {
        await consoleInstance.disconnect();
      } catch (err) {
        debugMsg("Error disconnecting console: " + err);
      }
      consoleInstance = null;
    }
    
    // Use esp_loader's exitConsoleMode function
    try {
      const needsManualReconnect = await espLoaderBeforeConsole.exitConsoleMode();
      
      if (needsManualReconnect) {
        // ESP32-S2: Port has changed, need to select new port
        logMsg("ESP32-S2: Port changed - please select the new port");
        toggleUIConnected(false);
        espStub = undefined;
        
        // Wait a moment for port to stabilize
        await sleep(1000);
        
        // Trigger port selection
        try {
          await clickConnect();
          espLoaderBeforeConsole = null;
          baudRateBeforeConsole = null;
          chipFamilyBeforeConsole = null;
        } catch (err) {
          errorMsg("Failed to reconnect: " + err);
        }
      } else {
        // Other devices: reconnectToBootloader was called successfully
        // Reload stub
        const newStub = await espLoaderBeforeConsole.runStub();
        espStub = newStub;

        // Restore baudrate
        if (baudRateBeforeConsole !== 115200) {
          await espStub.setBaudrate(baudRateBeforeConsole);
        }

        espLoaderBeforeConsole = null;
        baudRateBeforeConsole = null;
        chipFamilyBeforeConsole = null;
      }
    } catch (err) {
      errorMsg("Failed to exit console mode: " + err.message);
      espStub = undefined;
      toggleUIConnected(false);
      espLoaderBeforeConsole = null;
      baudRateBeforeConsole = null;
      chipFamilyBeforeConsole = null;
    }
  }
}

/**
 * @name updateLogVisibility
 * Update log and log controls visibility
 */
function updateLogVisibility() {
  const logControls = document.querySelector(".log-controls");
  
  if (showLog.checked) {
    log.classList.remove("hidden");
    if (logControls) {
      logControls.classList.remove("hidden");
    }
  } else {
    log.classList.add("hidden");
    if (logControls) {
      logControls.classList.add("hidden");
    }
  }
}

/**
 * @name updateMainPadding
 * Dynamically adjust main content padding based on header height
 */
function updateMainPadding() {
  // Use requestAnimationFrame to ensure DOM has updated
  requestAnimationFrame(() => {
    const header = document.querySelector('.header');
    const main = document.querySelector('.main');
    
    // Guard against missing elements
    if (!header || !main) {
      return;
    }
    
    const headerHeight = header.offsetHeight;
    // Add small buffer (10px) for better spacing
    main.style.paddingTop = (headerHeight + 10) + 'px';
  });
}

/**
 * @name clickErase
 * Click handler for the erase button.
 */
async function clickErase() {
  if (
    window.confirm("This will erase the entire flash. Click OK to continue.")
  ) {
    butErase.disabled = true;
    butProgram.disabled = true;
    try {
      logMsg("Erasing flash memory. Please wait...");
      let stamp = Date.now();
      await espStub.eraseFlash();
      logMsg("Finished. Took " + (Date.now() - stamp) + "ms to erase.");
    } catch (e) {
      errorMsg(e);
    } finally {
      butErase.disabled = false;
      baudRateSelect.disabled = false;
      butProgram.disabled = getValidFiles().length == 0;
    }
  }
}

/**
 * @name clickProgram
 * Click handler for the program button.
 */
async function clickProgram() {
  const readUploadedFileAsArrayBuffer = (inputFile) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(inputFile);
    });
  };

  baudRateSelect.disabled = true;
  butErase.disabled = true;
  butProgram.disabled = true;
  for (let i = 0; i < firmware.length; i++) {
    firmware[i].disabled = true;
    offsets[i].disabled = true;
  }
  for (let file of getValidFiles()) {
    progress[file].classList.remove("hidden");
    let binfile = firmware[file].files[0];
    let contents = await readUploadedFileAsArrayBuffer(binfile);
    try {
      let offset = parseInt(offsets[file].value, 16);
      const progressBar = progress[file].querySelector("div");
      await espStub.flashData(
        contents,
        (bytesWritten, totalBytes) => {
          progressBar.style.width =
            Math.floor((bytesWritten / totalBytes) * 100) + "%";
        },
        offset,
      );
      await sleep(100);
    } catch (e) {
      errorMsg(e);
    }
  }
  for (let i = 0; i < firmware.length; i++) {
    firmware[i].disabled = false;
    offsets[i].disabled = false;
    progress[i].classList.add("hidden");
    progress[i].querySelector("div").style.width = "0";
  }
  butErase.disabled = false;
  baudRateSelect.disabled = false;
  butProgram.disabled = getValidFiles().length == 0;
  logMsg("To run the new firmware, please reset your device.");
}

function getValidFiles() {
  // Get a list of file and offsets
  // This will be used to check if we have valid stuff
  // and will also return a list of files to program
  let validFiles = [];
  let offsetVals = [];
  for (let i = 0; i < firmware.length; i++) {
    let offs = parseInt(offsets[i].value, 16);
    if (firmware[i].files.length > 0 && !offsetVals.includes(offs)) {
      validFiles.push(i);
      offsetVals.push(offs);
    }
  }
  return validFiles;
}

/**
 * @name checkProgrammable
 * Check if the conditions to program the device are sufficient
 */
async function checkProgrammable() {
  butProgram.disabled = getValidFiles().length == 0;
}

/**
 * @name checkFirmware
 * Handler for firmware upload changes
 */
async function checkFirmware(event) {
  let filename = event.target.value.split("\\").pop();
  let label = event.target.parentNode.querySelector("span");
  let icon = event.target.parentNode.querySelector("svg");
  if (filename != "") {
    label.innerHTML = filename;
    icon.classList.add("hidden");
  } else {
    label.innerHTML = "Choose a file&hellip;";
    icon.classList.remove("hidden");
  }

  await checkProgrammable();
  updateUploadRowsVisibility();
}

/**
 * @name updateUploadRowsVisibility
 * Show/hide upload rows dynamically - only for flash write section
 */
function updateUploadRowsVisibility() {
  const uploadRows = document.querySelectorAll(".upload");
  let lastFilledIndex = -1;
  
  // Find the last filled row
  for (let i = 0; i < firmware.length; i++) {
    if (firmware[i].files.length > 0) {
      lastFilledIndex = i;
    }
  }
  
  // Show rows up to lastFilledIndex + 1 (next empty row), minimum 1 row
  for (let i = 0; i < uploadRows.length; i++) {
    if (i <= lastFilledIndex + 1) {
      uploadRows[i].style.display = "flex";
    } else {
      uploadRows[i].style.display = "none";
    }
  }
}

/**
 * @name clickReadFlash
 * Click handler for the read flash button.
 */
async function clickReadFlash() {
  const offset = parseInt(readOffset.value, 16);
  const size = parseInt(readSize.value, 16);

  if (isNaN(offset) || isNaN(size) || size <= 0) {
    errorMsg("Invalid offset or size value");
    return;
  }

  // Prompt user for filename
  const defaultFilename = `flash_0x${offset.toString(16)}_0x${size.toString(16)}.bin`;
  const filename = prompt(`Enter filename for flash data:`, defaultFilename);

  // User cancelled
  if (filename === null) {
    return;
  }

  // User entered empty string
  if (filename.trim() === "") {
    errorMsg("Filename cannot be empty");
    return;
  }

  butErase.disabled = true;
  butProgram.disabled = true;
  butReadFlash.disabled = true;
  readOffset.disabled = true;
  readSize.disabled = true;
  readProgress.classList.remove("hidden");

  try {
    const progressBar = readProgress.querySelector("div");

    const data = await espStub.readFlash(
      offset,
      size,
      (packet, progress, totalSize) => {
        progressBar.style.width =
          Math.floor((progress / totalSize) * 100) + "%";
      }
    );

    logMsg(`Successfully read ${data.length} bytes from flash`);

    // Create a download link with user-specified filename
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logMsg(`Flash data downloaded as "${filename}"`);
  } catch (e) {
    errorMsg("Failed to read flash: " + e);
  } finally {
    readProgress.classList.add("hidden");
    readProgress.querySelector("div").style.width = "0";
    butErase.disabled = false;
    baudRateSelect.disabled = false;
    butProgram.disabled = getValidFiles().length == 0;
    butReadFlash.disabled = false;
    readOffset.disabled = false;
    readSize.disabled = false;
  }
}

/**
 * @name clickReadPartitions
 * Click handler for the read partitions button.
 */
async function clickReadPartitions() {
  const PARTITION_TABLE_OFFSET = 0x8000;
  const PARTITION_TABLE_SIZE = 0x1000; // Read 4KB to get all partitions

  butReadPartitions.disabled = true;
  butErase.disabled = true;
  butProgram.disabled = true;
  butReadFlash.disabled = true;

  try {
    logMsg("Reading partition table from 0x8000...");
    
    const data = await espStub.readFlash(PARTITION_TABLE_OFFSET, PARTITION_TABLE_SIZE);
    
    const partitions = parsePartitionTable(data);
    
    if (partitions.length === 0) {
      errorMsg("No valid partition table found");
      return;
    }

    logMsg(`Found ${partitions.length} partition(s)`);
    
    // Display partitions
    displayPartitions(partitions);
    
  } catch (e) {
    errorMsg("Failed to read partition table: " + e);
  } finally {
    butReadPartitions.disabled = false;
    butErase.disabled = false;
    butProgram.disabled = getValidFiles().length == 0;
    butReadFlash.disabled = false;
  }
}

/**
 * Parse partition table from binary data
 */
function parsePartitionTable(data) {
  const PARTITION_MAGIC = 0x50aa;
  const PARTITION_ENTRY_SIZE = 32;
  const partitions = [];

  for (let i = 0; i < data.length; i += PARTITION_ENTRY_SIZE) {
    const magic = data[i] | (data[i + 1] << 8);
    
    if (magic !== PARTITION_MAGIC) {
      break; // End of partition table
    }

    const type = data[i + 2];
    const subtype = data[i + 3];
    const offset = data[i + 4] | (data[i + 5] << 8) | (data[i + 6] << 16) | (data[i + 7] << 24);
    const size = data[i + 8] | (data[i + 9] << 8) | (data[i + 10] << 16) | (data[i + 11] << 24);
    
    // Read name (16 bytes, null-terminated)
    let name = "";
    for (let j = 12; j < 28; j++) {
      if (data[i + j] === 0) break;
      name += String.fromCharCode(data[i + j]);
    }

    const flags = data[i + 28] | (data[i + 29] << 8) | (data[i + 30] << 16) | (data[i + 31] << 24);

    // Get type names
    const typeNames = { 0x00: "app", 0x01: "data" };
    const appSubtypes = {
      0x00: "factory", 0x10: "ota_0", 0x11: "ota_1", 0x12: "ota_2",
      0x13: "ota_3", 0x14: "ota_4", 0x15: "ota_5", 0x20: "test"
    };
    const dataSubtypes = {
      0x00: "ota", 0x01: "phy", 0x02: "nvs", 0x03: "coredump",
      0x04: "nvs_keys", 0x05: "efuse", 0x81: "fat", 0x82: "spiffs"
    };

    const typeName = typeNames[type] || `0x${type.toString(16)}`;
    let subtypeName = "";
    if (type === 0x00) {
      subtypeName = appSubtypes[subtype] || `0x${subtype.toString(16)}`;
    } else if (type === 0x01) {
      subtypeName = dataSubtypes[subtype] || `0x${subtype.toString(16)}`;
    } else {
      subtypeName = `0x${subtype.toString(16)}`;
    }

    partitions.push({
      name,
      type,
      subtype,
      offset,
      size,
      flags,
      typeName,
      subtypeName
    });
  }

  return partitions;
}

/**
 * Display partitions in the UI
 */
function displayPartitions(partitions) {
  partitionList.innerHTML = "";
  partitionList.classList.remove("hidden");
  
  // Hide the Read Partition Table button after successful read
  butReadPartitions.classList.add("hidden");

  const table = document.createElement("table");
  table.className = "partition-table-display";
  
  // Header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Name", "Type", "SubType", "Offset", "Size", "Action"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");
  partitions.forEach(partition => {
    const row = document.createElement("tr");
    
    // Name
    const nameCell = document.createElement("td");
    nameCell.setAttribute("data-label", "Name");
    nameCell.textContent = partition.name;
    row.appendChild(nameCell);
    
    // Type
    const typeCell = document.createElement("td");
    typeCell.setAttribute("data-label", "Type");
    typeCell.textContent = partition.typeName;
    row.appendChild(typeCell);
    
    // SubType
    const subtypeCell = document.createElement("td");
    subtypeCell.setAttribute("data-label", "SubType");
    subtypeCell.textContent = partition.subtypeName;
    row.appendChild(subtypeCell);
    
    // Offset
    const offsetCell = document.createElement("td");
    offsetCell.setAttribute("data-label", "Offset");
    offsetCell.textContent = `0x${partition.offset.toString(16)}`;
    row.appendChild(offsetCell);
    
    // Size
    const sizeCell = document.createElement("td");
    sizeCell.setAttribute("data-label", "Size");
    sizeCell.textContent = formatSize(partition.size);
    row.appendChild(sizeCell);
    
    // Action
    const actionCell = document.createElement("td");
    actionCell.setAttribute("data-label", "Action");
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download";
    downloadBtn.className = "partition-download-btn";
    downloadBtn.onclick = () => downloadPartition(partition);
    actionCell.appendChild(downloadBtn);
    row.appendChild(actionCell);
    
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  
  partitionList.appendChild(table);
}

/**
 * Download a partition
 */
async function downloadPartition(partition) {
  // Prompt user for filename
  const defaultFilename = `${partition.name}_0x${partition.offset.toString(16)}.bin`;
  const filename = prompt(
    `Enter filename for partition "${partition.name}":`,
    defaultFilename
  );

  // User cancelled
  if (filename === null) {
    return;
  }

  // User entered empty string
  if (filename.trim() === "") {
    errorMsg("Filename cannot be empty");
    return;
  }

  const partitionProgress = document.getElementById("partitionProgress");
  const progressBar = partitionProgress.querySelector("div");

  try {
    partitionProgress.classList.remove("hidden");
    progressBar.style.width = "0%";

    logMsg(
      `Downloading partition "${partition.name}" (${formatSize(partition.size)})...`
    );

    const data = await espStub.readFlash(
      partition.offset,
      partition.size,
      (packet, progress, totalSize) => {
        const percent = Math.floor((progress / totalSize) * 100);
        progressBar.style.width = percent + "%";
      }
    );

    // Create download with user-specified filename
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logMsg(`Partition "${partition.name}" downloaded as "${filename}"`);
  } catch (e) {
    errorMsg(`Failed to download partition: ${e}`);
  } finally {
    partitionProgress.classList.add("hidden");
    progressBar.style.width = "0%";
  }
}

/**
 * Format size in human-readable format
 */
function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

/**
 * @name clickClear
 * Click handler for the clear button.
 */
async function clickClear() {
// reset();     Reset function wasnt declared.
  log.innerHTML = "";
}

function convertJSON(chunk) {
  try {
    let jsonObj = JSON.parse(chunk);
    return jsonObj;
  } catch (e) {
    return chunk;
  }
}

function toggleUIToolbar(show) {
  isConnected = show;
  for (let i = 0; i < progress.length; i++) {
    progress[i].classList.add("hidden");
    progress[i].querySelector("div").style.width = "0";
  }
  if (show) {
    appDiv.classList.add("connected");
  } else {
    appDiv.classList.remove("connected");
  }
  butErase.disabled = !show;
  butReadFlash.disabled = !show;
  butReadPartitions.disabled = !show;
}

function toggleUIConnected(connected) {
  let lbl = "Connect";
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  
  if (connected) {
    lbl = "Disconnect";
    isConnected = true;

  } else {
    isConnected = false;
    toggleUIToolbar(false);
    
    // Cleanup console if it was running
    if (consoleInstance) {
      consoleInstance.disconnect().catch(err => {
        debugMsg("Error disconnecting console: " + err);
      });
      consoleInstance = null;
    }
    
    // Hide console container, show commands, and uncheck switch
    const commands = document.getElementById("commands");
    if (commands) commands.classList.remove("hidden");
    saveSetting("console", false);
  }
  butConnect.textContent = lbl;
}

function loadAllSettings() {
  // Load all saved settings or defaults
  autoscroll.checked = loadSetting("autoscroll", true);
  baudRateSelect.value = loadSetting("baudrate", 2000000);
  darkMode.checked = loadSetting("darkmode", false);
  debugMode.checked = loadSetting("debugmode", false);
  showLog.checked = loadSetting("showlog", false);
  
  // Apply show log setting
  updateLogVisibility();
}

function loadSetting(setting, defaultValue) {
  let value = JSON.parse(window.localStorage.getItem(setting));
  if (value == null) {
    return defaultValue;
  }

  return value;
}

function saveSetting(setting, value) {
  window.localStorage.setItem(setting, JSON.stringify(value));
}

function ucWords(text) {
  return text
    .replace("_", " ")
    .toLowerCase()
    .replace(/(?<= )[^\s]|^./g, (a) => a.toUpperCase());
}
