let espStub;
let esp32s2ReconnectInProgress = false;
let currentLittleFS = null;
let currentLittleFSPartition = null;
let currentLittleFSPath = '/';
let currentLittleFSBlockSize = 4096;
let currentFilesystemType = null; // 'littlefs', 'fatfs', or 'spiffs'
let littlefsModulePromise = null; // Cache for LittleFS WASM module

/**
 * Get display name for current filesystem type
 */
function getFilesystemDisplayName() {
  if (!currentFilesystemType) return 'Filesystem';
  switch (currentFilesystemType) {
    case 'littlefs': return 'LittleFS';
    case 'fatfs': return 'FatFS';
    case 'spiffs': return 'SPIFFS';
    default: return 'Filesystem';
  }
}

/**
 * Clear all cached data and state on disconnect
 */
function clearAllCachedData() {
  // Close filesystem if open
  if (currentLittleFS) {
    try {
      // Only call destroy if it exists (LittleFS has it, FatFS/SPIFFS don't)
      if (typeof currentLittleFS.destroy === 'function') {
        currentLittleFS.destroy();
      }
    } catch (e) {
      console.error('Error destroying filesystem:', e);
    }
  }
  
  // Reset filesystem state
  currentLittleFS = null;
  currentLittleFSPartition = null;
  currentLittleFSPath = '/';
  currentLittleFSBlockSize = 4096;
  currentFilesystemType = null;
  
  // Hide filesystem manager
  littlefsManager.classList.add('hidden');
  
  // Clear partition list
  partitionList.innerHTML = '';
  partitionList.classList.add('hidden');
  
  // Show the Read Partition Table button again
  butReadPartitions.classList.remove('hidden');
  
  // Clear file input
  if (littlefsFileInput) {
    littlefsFileInput.value = '';
  }
  
  // Reset buttons
  butLittlefsUpload.disabled = true;
  
  // Clear any cached module promises
  littlefsModulePromise = null;
  
  logMsg('All cached data cleared');
}

const baudRates = [2000000, 1500000, 921600, 500000, 460800, 230400, 153600, 128000, 115200];
const bufferSize = 512;
const colors = ["#00a7e9", "#f89521", "#be1e2d"];
const measurementPeriodId = "0001";

// Check if running in Electron
const isElectron = window.electronAPI && window.electronAPI.isElectron;

const maxLogLength = 100;
const log = document.getElementById("log");
const butConnect = document.getElementById("butConnect");
const baudRate = document.getElementById("baudRate");
const butClear = document.getElementById("butClear");
const butErase = document.getElementById("butErase");
const butProgram = document.getElementById("butProgram");
const butReadFlash = document.getElementById("butReadFlash");
const readOffset = document.getElementById("readOffset");
const readSize = document.getElementById("readSize");
const readProgress = document.getElementById("readProgress");
const butReadPartitions = document.getElementById("butReadPartitions");
const partitionList = document.getElementById("partitionList");
const littlefsManager = document.getElementById("littlefsManager");
const littlefsPartitionName = document.getElementById("littlefsPartitionName");
const littlefsPartitionSize = document.getElementById("littlefsPartitionSize");
const littlefsUsageBar = document.getElementById("littlefsUsageBar");
const littlefsUsageText = document.getElementById("littlefsUsageText");
const littlefsDiskVersion = document.getElementById("littlefsDiskVersion");
const littlefsFileList = document.getElementById("littlefsFileList");
const littlefsBreadcrumb = document.getElementById("littlefsBreadcrumb");
const butLittlefsUp = document.getElementById("butLittlefsUp");
const butLittlefsRefresh = document.getElementById("butLittlefsRefresh");
const butLittlefsBackup = document.getElementById("butLittlefsBackup");
const butLittlefsWrite = document.getElementById("butLittlefsWrite");
const butLittlefsClose = document.getElementById("butLittlefsClose");
const littlefsFileInput = document.getElementById("littlefsFileInput");
const butLittlefsUpload = document.getElementById("butLittlefsUpload");
const butLittlefsMkdir = document.getElementById("butLittlefsMkdir");
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

document.addEventListener("DOMContentLoaded", () => {
  butConnect.addEventListener("click", () => {
    clickConnect().catch(async (e) => {
      console.error(e);
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
  butLittlefsRefresh.addEventListener("click", clickLittlefsRefresh);
  butLittlefsBackup.addEventListener("click", clickLittlefsBackup);
  butLittlefsWrite.addEventListener("click", clickLittlefsWrite);
  butLittlefsClose.addEventListener("click", clickLittlefsClose);
  butLittlefsUp.addEventListener("click", clickLittlefsUp);
  butLittlefsUpload.addEventListener("click", clickLittlefsUpload);
  butLittlefsMkdir.addEventListener("click", clickLittlefsMkdir);
  littlefsFileInput.addEventListener("change", () => {
    butLittlefsUpload.disabled = !littlefsFileInput.files.length;
  });
  for (let i = 0; i < firmware.length; i++) {
    firmware[i].addEventListener("change", checkFirmware);
  }
  for (let i = 0; i < offsets.length; i++) {
    offsets[i].addEventListener("change", checkProgrammable);
  }
  
  // Initialize upload rows visibility - only show first row
  updateUploadRowsVisibility();
  
  autoscroll.addEventListener("click", clickAutoscroll);
  baudRate.addEventListener("change", changeBaudRate);
  darkMode.addEventListener("click", clickDarkMode);
  debugMode.addEventListener("click", clickDebugMode);
  showLog.addEventListener("click", clickShowLog);
  window.addEventListener("error", function (event) {
    console.log("Got an uncaught error: ", event.error);
  });
  
  // Header auto-hide functionality
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  
  // Show header on mouse enter at top of page
  main.addEventListener("mousemove", (e) => {
    if (e.clientY < 5 && header.classList.contains("header-hidden")) {
      header.classList.remove("header-hidden");
      main.classList.remove("no-header-padding");
    }
  });
  
  // Keep header visible when mouse is over it
  header.addEventListener("mouseenter", () => {
    header.classList.remove("header-hidden");
    main.classList.remove("no-header-padding");
  });
  
  // Hide header when mouse leaves (only if connected)
  header.addEventListener("mouseleave", () => {
    if (espStub && header.classList.contains("header-hidden") === false) {
      setTimeout(() => {
        if (!header.matches(":hover")) {
          header.classList.add("header-hidden");
          main.classList.add("no-header-padding");
        }
      }, 1000);
    }
  });
  
  if ("serial" in navigator) {
    const notSupported = document.getElementById("notSupported");
    notSupported.classList.add("hidden");
  }

  initBaudRate();
  loadAllSettings();
  updateTheme();
  logMsg("WebSerial ESPTool loaded.");
});

function initBaudRate() {
  for (let rate of baudRates) {
    var option = document.createElement("option");
    option.text = rate + " Baud";
    option.value = rate;
    baudRate.add(option);
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

function debugMsg(...args) {
  if (!debugMode.checked) {
    return;
  }
  
  function getStackTrace() {
    let stack = new Error().stack;
    //console.log(stack);
    stack = stack.split("\n").map((v) => v.trim());
    stack.shift();
    stack.shift();

    let trace = [];
    for (let line of stack) {
      line = line.replace("at ", "");
      trace.push({
        func: line.substr(0, line.indexOf("(") - 1),
        pos: line.substring(line.indexOf(".js:") + 4, line.lastIndexOf(":")),
      });
    }

    return trace;
  }

  let stack = getStackTrace();
  stack.shift();
  let top = stack.shift();
  let prefix =
    '<span class="debug-function">[' + top.func + ":" + top.pos + "]</span> ";
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

function formatMacAddr(macAddr) {
  return macAddr
    .map((value) => value.toString(16).toUpperCase().padStart(2, "0"))
    .join(":");
}

/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */
async function clickConnect() {
  if (espStub) {
    // Remove disconnect event listener to prevent it from firing during manual disconnect
    if (espStub.handleDisconnect) {
      espStub.removeEventListener("disconnect", espStub.handleDisconnect);
    }
    
    await espStub.disconnect();
    await espStub.port.close();
    toggleUIConnected(false);
    espStub = undefined;
    
    // Clear all cached data and state
    clearAllCachedData();
    
    return;
  }

  const esploaderMod = await window.esptoolPackage;

  let esploader = await esploaderMod.connect({
    log: (...args) => logMsg(...args),
    debug: (...args) => debugMsg(...args),
    error: (...args) => errorMsg(...args),
  });
  
  // Store port info for ESP32-S2 detection
  let portInfo = esploader.port?.getInfo ? esploader.port.getInfo() : {};
  let isESP32S2 = portInfo.usbVendorId === 0x303a && portInfo.usbProductId === 0x0002;
  
  // Handle ESP32-S2 Native USB reconnection requirement for BROWSER
  // Only add listener if not already in reconnect mode and not in Electron
  if (!esp32s2ReconnectInProgress && !isElectron) {
    esploader.addEventListener("esp32s2-usb-reconnect", async () => {
      // Prevent recursive calls
      if (esp32s2ReconnectInProgress) {
        return;
      }
      
      esp32s2ReconnectInProgress = true;
      logMsg("ESP32-S2 Native USB detected!");
      toggleUIConnected(false);
      espStub = undefined;
      
      try {
        await esploader.port.close();
        
        if (esploader.port.forget) {
          await esploader.port.forget();
        }
      } catch (disconnectErr) {
        // Ignore disconnect errors
      }
      
      // Show modal dialog
      const modal = document.getElementById("esp32s2Modal");
      const reconnectBtn = document.getElementById("butReconnectS2");
      
      modal.classList.remove("hidden");
      
      // Handle reconnect button click
      const handleReconnect = async () => {
        modal.classList.add("hidden");
        reconnectBtn.removeEventListener("click", handleReconnect);
        
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
    // Check if this is an ESP32-S2 that needs reconnection
    if (isESP32S2 && isElectron && !esp32s2ReconnectInProgress) {
      esp32s2ReconnectInProgress = true;
      logMsg("ESP32-S2 Native USB detected - automatic reconnection...");
      toggleUIConnected(false);
      
      try {
        await esploader.port.close();
      } catch (e) {
        console.debug("Port close error:", e);
      }
      
      // Wait for new port to appear
      logMsg("Waiting for ESP32-S2 CDC port...");
      
      const waitForNewPort = new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (navigator.serial && navigator.serial.getPorts) {
            navigator.serial.getPorts().then(ports => {
              if (ports.length > 0) {
                clearInterval(checkInterval);
                resolve(ports[0]);
              }
            });
          }
        }, 50);
        
        // Timeout after 500 ms
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(null);
        }, 500);
      });
      
      const newPort = await waitForNewPort;
      
      if (!newPort) {
        esp32s2ReconnectInProgress = false;
        throw new Error("ESP32-S2 CDC port did not appear in time");
      }
      
      // Additional small delay to ensure port is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Open the new port and create ESPLoader directly
      await newPort.open({ baudRate: 115200 });
      logMsg("Connected successfully.");
      
      esploader = new esploaderMod.ESPLoader(newPort, {
        log: (...args) => logMsg(...args),
        debug: (...args) => debugMsg(...args),
        error: (...args) => errorMsg(...args),
      });
      
      // Initialize the new connection
      await esploader.initialize();
      
      esp32s2ReconnectInProgress = false;
      logMsg("ESP32-S2 reconnection successful!");
    } else {
      // If ESP32-S2 reconnect is in progress (browser modal), suppress the error
      if (esp32s2ReconnectInProgress) {
        logMsg("Initialization interrupted for ESP32-S2 reconnection.");
        return;
      }
      
      // Not ESP32-S2 or reconnect already attempted
      try {
        await esploader.disconnect();
      } catch (disconnectErr) {
        // Ignore disconnect errors
      }
      throw err;
    }
  }

  logMsg("Connected to " + esploader.chipName);
  logMsg("MAC Address: " + formatMacAddr(esploader.macAddr()));

  espStub = await esploader.runStub();
  toggleUIConnected(true);
  toggleUIToolbar(true);
  
  // Set detected flash size in the read size field
  if (espStub.flashSize) {
    const flashSizeBytes = parseInt(espStub.flashSize) * 1024 * 1024; // Convert MB to bytes
    readSize.value = "0x" + flashSizeBytes.toString(16);
  }
  
  // Set the selected baud rate
  let baud = parseInt(baudRate.value);
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
  saveSetting("baudrate", baudRate.value);
  if (espStub) {
    let baud = parseInt(baudRate.value);
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
 * @name clickErase
 * Click handler for the erase button.
 */
async function clickErase() {
  let confirmed = false;
  
  if (isElectron) {
    confirmed = await window.electronAPI.showConfirm("This will erase the entire flash. Click OK to continue.");
  } else {
    confirmed = window.confirm("This will erase the entire flash. Click OK to continue.");
  }
  
  if (confirmed) {
    baudRate.disabled = true;
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
      baudRate.disabled = false;
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

  baudRate.disabled = true;
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
  baudRate.disabled = false;
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

  const defaultFilename = `flash_0x${offset.toString(16)}_0x${size.toString(16)}.bin`;

  baudRate.disabled = true;
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

    // Save file using Electron API or browser download
    await saveDataToFile(data, defaultFilename);

  } catch (e) {
    errorMsg("Failed to read flash: " + e);
  } finally {
    readProgress.classList.add("hidden");
    readProgress.querySelector("div").style.width = "0";
    butErase.disabled = false;
    baudRate.disabled = false;
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
    nameCell.textContent = partition.name;
    row.appendChild(nameCell);
    
    // Type
    const typeCell = document.createElement("td");
    typeCell.textContent = partition.typeName;
    row.appendChild(typeCell);
    
    // SubType
    const subtypeCell = document.createElement("td");
    subtypeCell.textContent = partition.subtypeName;
    row.appendChild(subtypeCell);
    
    // Offset
    const offsetCell = document.createElement("td");
    offsetCell.textContent = `0x${partition.offset.toString(16)}`;
    row.appendChild(offsetCell);
    
    // Size
    const sizeCell = document.createElement("td");
    sizeCell.textContent = formatSize(partition.size);
    row.appendChild(sizeCell);
    
    // Action
    const actionCell = document.createElement("td");
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download";
    downloadBtn.className = "partition-download-btn";
    downloadBtn.onclick = () => downloadPartition(partition);
    actionCell.appendChild(downloadBtn);
    
    // Add "Open FS" button for data partitions with filesystem
    // 0x81 = FAT, 0x82 = SPIFFS (often contains LittleFS)
    if (partition.type === 0x01 && (partition.subtype === 0x81 || partition.subtype === 0x82)) {
      const fsBtn = document.createElement("button");
      fsBtn.textContent = "Open FS";
      fsBtn.className = "littlefs-fs-button";
      fsBtn.onclick = () => openFilesystem(partition);
      actionCell.appendChild(fsBtn);
    }
    
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
  const defaultFilename = `${partition.name}_0x${partition.offset.toString(16)}.bin`;

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

    // Save file using Electron API or browser download
    await saveDataToFile(data, defaultFilename);

    logMsg(`Partition "${partition.name}" downloaded successfully`);
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
    // Auto-hide header after connection
    setTimeout(() => {
      header.classList.add("header-hidden");
      main.classList.add("no-header-padding");
    }, 2000); // Hide after 2 seconds
  } else {
    toggleUIToolbar(false);
    // Show header when disconnected
    header.classList.remove("header-hidden");
    main.classList.remove("no-header-padding");
  }
  butConnect.textContent = lbl;
}

function loadAllSettings() {
  // Load all saved settings or defaults
  autoscroll.checked = loadSetting("autoscroll", true);
  baudRate.value = loadSetting("baudrate", 2000000);
  darkMode.checked = loadSetting("darkmode", false);
  debugMode.checked = loadSetting("debugmode", true);
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Save data to file - uses Electron API in desktop app, browser download otherwise
 */
async function saveDataToFile(data, defaultFilename) {
  if (isElectron) {
    // Use Electron's native save dialog
    const result = await window.electronAPI.saveFile(
      Array.from(data), // Convert Uint8Array to regular array for IPC
      defaultFilename
    );
    
    if (result.success) {
      logMsg(`File saved: ${result.filePath}`);
    } else if (result.canceled) {
      logMsg("Save cancelled by user");
    } else {
      errorMsg(`Failed to save file: ${result.error}`);
    }
  } else {
    // Browser fallback - use download link
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logMsg(`Flash data downloaded as "${defaultFilename}"`);
  }
}

/**
 * Read file from disk - uses Electron API in desktop app
 */
async function readFileFromDisk() {
  if (isElectron) {
    const result = await window.electronAPI.openFile();
    
    if (result.success) {
      return {
        data: new Uint8Array(result.data),
        filename: result.filename,
        filePath: result.filePath
      };
    } else if (result.canceled) {
      return null;
    } else {
      throw new Error(result.error);
    }
  }
  return null;
}


/**
 * Open and mount a filesystem partition
 */
async function openFilesystem(partition) {
  try {
    logMsg(`Detecting filesystem type for partition "${partition.name}"...`);
    
    // Detect filesystem type
    const fsType = await detectFilesystemType(partition.offset, partition.size);
    logMsg(`Detected filesystem: ${fsType}`);
    
    if (fsType === 'littlefs') {
      await openLittleFS(partition);
    } else if (fsType === 'fatfs') {
      await openFatFS(partition);
    } else if (fsType === 'spiffs') {
      await openSPIFFS(partition);
    } else {
      errorMsg('Unknown filesystem type. Cannot open partition.');
    }
  } catch (e) {
    errorMsg(`Failed to open filesystem: ${e.message || e}`);
  }
}

/**
 * Detect filesystem type by reading partition header
 * 
 * LittleFS Detection:
 * - LittleFS stores metadata blocks at the beginning of the partition
 * - The superblock contains the string "littlefs" in its metadata
 * - LittleFS uses a specific block structure with magic numbers
 * 
 * FatFS Detection:
 * - FAT boot sector signature 0xAA55 at offset 510-511
 * - FAT signature string at offset 54 (FAT16) or 82 (FAT32)
 * 
 * SPIFFS Detection:
 * - SPIFFS has a different structure without the "littlefs" string
 * - SPIFFS uses object headers with different magic numbers
 * 
 * Detection Strategy:
 * 1. Read first 8KB of partition (covers multiple blocks)
 * 2. Search for "littlefs" string in ASCII representation
 * 3. Check for FAT boot signature
 * 4. Check for SPIFFS magic
 * 5. If found -> corresponding FS, otherwise -> SPIFFS
 */
async function detectFilesystemType(offset, size) {
  try {
    // Read first 8KB or entire partition if smaller
    const readSize = Math.min(8192, size);
    const data = await espStub.readFlash(offset, readSize);
    
    if (data.length < 32) {
      logMsg('Partition too small, assuming SPIFFS');
      return 'spiffs';
    }
    
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    
    // Method 1: Check for SPIFFS magic number FIRST (most reliable)
    // SPIFFS magic: 0x20140529 XORed with page size and optionally (blocksLim - blockIndex)
    // The magic is stored as objIdLen bytes (typically 2 bytes) in the last lookup page
    // Pattern: Always ends with 0x05 in the second byte (from 0x0529)
    
    // Check at block boundaries (every 4KB) for SPIFFS magic
    for (let blockOffset = 0; blockOffset < Math.min(8192, data.length); blockOffset += 4096) {
      // SPIFFS stores magic near the end of the last lookup page
      // For 4KB blocks, check around offset 0xF0-0xFF
      for (let pageOffset = 0xE0; pageOffset < Math.min(0x100, data.length - blockOffset - 2); pageOffset += 2) {
        const offset = blockOffset + pageOffset;
        if (offset + 2 > data.length) break;
        
        // Read as 16-bit (objIdLen=2, most common)
        const magic16 = view.getUint16(offset, true);
        
        // SPIFFS magic pattern: second byte is always 0x05 (from base 0x0529)
        // First byte varies based on XOR with pageSize and block index
        if ((magic16 & 0xFF00) === 0x0500) {
          logMsg(`SPIFFS detected: Found SPIFFS magic pattern 0x${magic16.toString(16)} at offset 0x${offset.toString(16)}`);
          return 'spiffs';
        }
      }
    }
    
    // Method 2: Check for "littlefs" string in metadata (very reliable)
    // LittleFS stores this in the superblock metadata
    const decoder = new TextDecoder('ascii', { fatal: false });
    const dataStr = decoder.decode(data);
    
    if (dataStr.includes('littlefs')) {
      logMsg('LittleFS detected: Found "littlefs" signature in partition data');
      return 'littlefs';
    }
    
    // Method 3: Check for FAT filesystem signatures
    if (data.length >= 512) {
      const bootSig = view.getUint16(510, true);
      
      if (bootSig === 0xAA55) {
        // Check for FAT signature strings
        let fat16Sig = '';
        let fat32Sig = '';
        
        if (data.length >= 62) {
          fat16Sig = String.fromCharCode(data[54], data[55], data[56], data[57], data[58]);
        }
        if (data.length >= 90) {
          fat32Sig = String.fromCharCode(data[82], data[83], data[84], data[85], data[86]);
        }
        
        if (fat16Sig.startsWith('FAT') || fat32Sig.startsWith('FAT')) {
          logMsg('FatFS detected: Found FAT boot signature and FAT string');
          return 'fatfs';
        } else {
          logMsg('Boot signature found but no FAT string - might be empty/unformatted FAT partition');
        }
      }
    }
    
    // Method 4: Check for LittleFS magic numbers (more specific than structure check)
    // LittleFS v2.x magic: 0x32736c66 ("lfs2" in little-endian)
    // LittleFS v1.x magic: 0x31736c66 ("lfs1" in little-endian)
    for (let i = 0; i < Math.min(8192, data.length - 4); i++) {
      const magic32 = view.getUint32(i, true);
      if (magic32 === 0x32736c66 || magic32 === 0x31736c66) {
        logMsg('LittleFS detected: Found LittleFS magic number 0x' + magic32.toString(16) + ' at offset ' + i);
        return 'littlefs';
      }
    }
    
    // Default: If no clear signature found, assume SPIFFS
    logMsg('No clear filesystem signature found, assuming SPIFFS');
    return 'spiffs';
    
  } catch (err) {
    errorMsg(`Failed to detect filesystem type: ${err.message || err}`);
    return 'spiffs'; // Safe fallback
  }
}

/**
 * Lazy-load and cache the LittleFS WASM module
 */
async function loadLittlefsModule() {
  if (!littlefsModulePromise) {
    // Use absolute path from root for better compatibility with GitHub Pages
    const basePath = window.location.pathname.endsWith('/') 
      ? window.location.pathname 
      : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    const modulePath = `${basePath}src/wasm/littlefs/index.js`;
    
    littlefsModulePromise = import(modulePath)
      .catch(error => {
        console.error('Failed to load LittleFS module from:', modulePath, error);
        littlefsModulePromise = null; // Reset on error so it can be retried
        throw error;
      });
  }
  return littlefsModulePromise;
}

/**
 * Reset LittleFS state
 */
function resetLittleFSState() {
  // Clean up existing filesystem instance
  if (currentLittleFS) {
    try {
      // Don't call destroy() - it can cause crashes
      // Just let garbage collection handle it
    } catch (e) {
      console.error('Error cleaning up LittleFS:', e);
    }
  }
  
  currentLittleFS = null;
  currentLittleFSPartition = null;
  currentLittleFSPath = '/';
  currentLittleFSBlockSize = 4096;
  
  // Hide UI - safely check if elements exist
  try {
    if (littlefsManager) {
      littlefsManager.classList.add('hidden');
    }
    
    // Clear file list
    if (littlefsFileList) {
      littlefsFileList.innerHTML = '';
    }
  } catch (e) {
    console.error('Error resetting LittleFS UI:', e);
  }
}

/**
 * Open LittleFS partition
 */
async function openLittleFS(partition) {
  try {
    logMsg(`Reading LittleFS partition "${partition.name}" (${formatSize(partition.size)})...`);
    
    // Read entire partition
    const partitionProgress = document.getElementById("partitionProgress");
    const progressBar = partitionProgress.querySelector("div");
    partitionProgress.classList.remove("hidden");
    
    const data = await espStub.readFlash(
      partition.offset,
      partition.size,
      (packet, progress, totalSize) => {
        const percent = Math.floor((progress / totalSize) * 100);
        progressBar.style.width = percent + "%";
      }
    );
    
    partitionProgress.classList.add("hidden");
    progressBar.style.width = "0%";
    
    logMsg('Mounting LittleFS filesystem...');
    
    // Try to mount with different block sizes
    const blockSizes = [4096, 2048, 1024, 512];
    let fs = null;
    let blockSize = 0;
    
    // Use cached module loader
    const module = await loadLittlefsModule();
    const { createLittleFSFromImage, formatDiskVersion } = module;
    
    for (const bs of blockSizes) {
      try {
        const blockCount = Math.floor(partition.size / bs);
        fs = await createLittleFSFromImage(data, {
          blockSize: bs,
          blockCount: blockCount,
        });
        
        // Try to list root to verify it works
        fs.list('/');
        blockSize = bs;
        logMsg(`Successfully mounted LittleFS with block size ${bs}`);
        break;
      } catch (err) {
        // Try next block size
        // Don't call destroy() - just let it be garbage collected
        fs = null;
      }
    }
    
    if (!fs) {
      throw new Error('Failed to mount LittleFS with any block size');
    }
    
    // Store filesystem instance
    currentLittleFS = fs;
    currentLittleFSPartition = partition;
    currentLittleFSPath = '/';
    currentLittleFSBlockSize = blockSize;
    currentFilesystemType = 'littlefs';
    
    // Update UI
    littlefsPartitionName.textContent = partition.name;
    littlefsPartitionSize.textContent = formatSize(partition.size);
    
    // Get disk version
    try {
      const diskVer = fs.getDiskVersion();
      const major = (diskVer >> 16) & 0xFFFF;
      const minor = diskVer & 0xFFFF;
      littlefsDiskVersion.textContent = `v${major}.${minor}`;
    } catch (e) {
      littlefsDiskVersion.textContent = '';
    }
    
    // Show manager
    littlefsManager.classList.remove('hidden');
    
    // Enable all operations for LittleFS (including directories)
    butLittlefsUpload.disabled = false;
    butLittlefsMkdir.disabled = false;
    butLittlefsWrite.disabled = false;
    
    // Load files
    refreshLittleFS();
    
    logMsg('LittleFS filesystem opened successfully');
  } catch (e) {
    errorMsg(`Failed to open LittleFS: ${e.message || e}`);
    // Don't call destroy() - just reset state
    resetLittleFSState();
  }
}

/**
 * Open FatFS partition
 */
async function openFatFS(partition) {
  try {
    logMsg(`Reading FatFS partition "${partition.name}" (${formatSize(partition.size)})...`);
    
    // Read entire partition
    const partitionProgress = document.getElementById("partitionProgress");
    const progressBar = partitionProgress.querySelector("div");
    partitionProgress.classList.remove("hidden");
    
    const data = await espStub.readFlash(
      partition.offset,
      partition.size,
      (packet, progress, totalSize) => {
        const percent = Math.floor((progress / totalSize) * 100);
        progressBar.style.width = percent + "%";
      }
    );
    
    partitionProgress.classList.add("hidden");
    progressBar.style.width = "0%";
    
    logMsg('Mounting FatFS filesystem...');
    logMsg(`Partition size: ${formatSize(partition.size)} (${partition.size} bytes)`);
    
    // Load FatFS module
    const basePath = window.location.pathname.endsWith('/') 
      ? window.location.pathname 
      : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    const modulePath = `${basePath}src/wasm/fatfs/index.js`;
    const module = await import(modulePath);
    const { createFatFSFromImage, createFatFS } = module;
    
    // Use 4096 block size (ESP32 standard)
    let blockSize = 4096;
    let blockCount = Math.max(1, Math.floor(partition.size / blockSize));
    if (blockCount <= 0) {
      blockCount = 1;
    }
    
    let fs = null;
    
    // First try to mount existing FatFS from image
    try {
      logMsg(`Trying to mount FatFS with block size ${blockSize} (${blockCount} blocks)...`);
      
      fs = await createFatFSFromImage(data, {
        blockSize: blockSize,
        blockCount: blockCount,
      });
      
      logMsg(`FatFS instance created, attempting to list files...`);
      const files = fs.list();
      logMsg(`Successfully listed ${files.length} files/directories`);
      logMsg(`Successfully mounted FatFS`);
    } catch (err) {
      logMsg(`Failed to mount existing FatFS: ${err.message || err}`);
      
      // If mounting fails, create a new empty formatted filesystem
      // Note: This does NOT use the image data - it creates a blank filesystem
      if (createFatFS) {
        try {
          logMsg(`Creating new blank FatFS (not using image data)...`);
          fs = await createFatFS({
            blockSize: blockSize,
            blockCount: blockCount,
            formatOnInit: true,
          });
          logMsg(`Created new formatted FatFS`);
          logMsg(`Partition appears blank/unformatted. You can format and save to initialize it.`);
        } catch (createErr) {
          logMsg(`Failed to create new FatFS: ${createErr.message || createErr}`);
          throw err; // Throw original error
        }
      } else {
        throw err;
      }
    }
    
    if (!fs) {
      throw new Error('Failed to mount FatFS with any block size. The partition may not contain a valid FAT filesystem or may be corrupted.');
    }
    
    // Store filesystem instance and block size
    currentLittleFS = fs;
    currentLittleFSPartition = partition;
    currentLittleFSPath = '/';
    currentLittleFSBlockSize = blockSize;
    currentFilesystemType = 'fatfs';
    
    // Update UI
    littlefsPartitionName.textContent = partition.name;
    littlefsPartitionSize.textContent = formatSize(partition.size);
    littlefsDiskVersion.textContent = 'FAT';
    
    // Show manager
    littlefsManager.classList.remove('hidden');
    
    // Enable all operations for FatFS (including directories)
    butLittlefsUpload.disabled = false;
    butLittlefsMkdir.disabled = false;
    butLittlefsWrite.disabled = false;
    
    // Load files
    refreshLittleFS();
    
    logMsg('FatFS filesystem opened successfully');
  } catch (e) {
    errorMsg(`Failed to open FatFS: ${e.message || e}`);
    console.error('FatFS open error:', e);
    resetLittleFSState();
  }
}

/**
 * Open SPIFFS partition
 */
async function openSPIFFS(partition) {
  try {
    logMsg(`Reading SPIFFS partition "${partition.name}" (${formatSize(partition.size)})...`);
    
    // Read entire partition
    const partitionProgress = document.getElementById("partitionProgress");
    const progressBar = partitionProgress.querySelector("div");
    partitionProgress.classList.remove("hidden");
    
    const data = await espStub.readFlash(
      partition.offset,
      partition.size,
      (packet, progress, totalSize) => {
        const percent = Math.floor((progress / totalSize) * 100);
        progressBar.style.width = percent + "%";
      }
    );
    
    partitionProgress.classList.add("hidden");
    progressBar.style.width = "0%";
    
    logMsg('Parsing SPIFFS filesystem...');
    logMsg(`Partition size: ${formatSize(partition.size)} (${partition.size} bytes)`);
    
    // Import SPIFFS module
    const basePath = window.location.pathname.endsWith('/') 
      ? window.location.pathname 
      : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    const modulePath = `${basePath}js/modules/esptool.js`;

    const { SpiffsFS, SpiffsReader, SpiffsBuildConfig, DEFAULT_SPIFFS_CONFIG } = await import(modulePath);
    
    // Create build config with partition size
    const config = new SpiffsBuildConfig({
      ...DEFAULT_SPIFFS_CONFIG,
      imgSize: partition.size,
    });
    
    // Create reader and parse existing files
    const reader = new SpiffsReader(data, config);
    reader.parse();
    
    // Get file list
    const files = reader.listFiles();
    logMsg(`Found ${files.length} files in SPIFFS`);
    
    // Create a wrapper object that mimics LittleFS interface with full read/write support
    const spiffsWrapper = {
      _reader: reader,
      _files: files,
      _partition: partition,
      _config: config,
      _originalData: data, // Store original image data
      _modified: false,
      
      list: function(path = '/') {
        // Normalize path
        const normalizedPath = path === '/' ? '' : path.replace(/^\//, '').replace(/\/$/, '');
        
        // Get all files with proper path property for UI compatibility
        const allFiles = this._files.map(f => {
          const fileName = f.name.startsWith('/') ? f.name.substring(1) : f.name;
          return {
            name: fileName,
            path: '/' + fileName, // Add path property for UI
            type: 'file',
            size: f.size,
            _data: f.data
          };
        });
        
        // If root, return all files
        if (!normalizedPath) {
          return allFiles;
        }
        
        // Filter by path prefix
        const prefix = normalizedPath + '/';
        return allFiles.filter(f => f.name.startsWith(prefix));
      },
      
      read: function(path) {
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        const file = this._files.find(f => {
          const fname = f.name.startsWith('/') ? f.name.substring(1) : f.name;
          return fname === normalizedPath;
        });
        return file ? file.data : null;
      },
      
      readFile: function(path) {
        // Alias for read() to match LittleFS interface
        return this.read(path);
      },
      
      write: function(path, data) {
        // Determine the filename format used in original files
        // Check if original files have leading slash
        const hasLeadingSlash = this._files.length > 0 && this._files[0].name.startsWith('/');
        
        // Normalize path for comparison
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        
        // Store filename in the same format as original files
        const storedName = hasLeadingSlash ? '/' + normalizedPath : normalizedPath;
        
        // Check if file already exists
        const existingIndex = this._files.findIndex(f => {
          const fname = f.name.startsWith('/') ? f.name.substring(1) : f.name;
          return fname === normalizedPath;
        });
        
        // Update or add file
        if (existingIndex >= 0) {
          this._files[existingIndex] = {
            name: storedName,
            size: data.length,
            data: data
          };
        } else {
          this._files.push({
            name: storedName,
            size: data.length,
            data: data
          });
        }
        
        this._modified = true;
      },
      
      writeFile: function(path, data) {
        // Alias for write() to match LittleFS interface
        return this.write(path, data);
      },
      
      addFile: function(path, data) {
        // Alias for write() to match alternative interface
        return this.write(path, data);
      },
      
      remove: function(path) {
        // Normalize path
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        
        // Find and remove file
        const index = this._files.findIndex(f => {
          const fname = f.name.startsWith('/') ? f.name.substring(1) : f.name;
          return fname === normalizedPath;
        });
        
        if (index >= 0) {
          this._files.splice(index, 1);
          this._modified = true;
        } else {
          throw new Error(`File not found: ${path}`);
        }
      },
      
      deleteFile: function(path) {
        // Alias for remove() to match LittleFS interface
        return this.remove(path);
      },
      
      delete: function(path, options) {
        // For compatibility with LittleFS delete method
        // SPIFFS doesn't have directories, so just delete the file
        return this.remove(path);
      },
      
      mkdir: function() {
        throw new Error('SPIFFS does not support directories. Files are stored in a flat structure.');
      },
      
      toImage: function() {
        // If not modified, return original data
        if (!this._modified) {
          return this._originalData || new Uint8Array(this._partition.size);
        }
        
        // Create new SPIFFS filesystem with all files
        const fs = new SpiffsFS(this._partition.size, this._config);
        
        // Add all files - preserve original filename format
        for (const file of this._files) {
          // Use the filename exactly as stored in _files
          // This preserves whether it has a leading slash or not
          const fileName = file.name;
          
          // Log for debugging
          console.log(`Adding file to SPIFFS: "${fileName}" (${file.data.length} bytes)`);
          
          fs.createFile(fileName, file.data);
        }
        
        // Generate binary image
        const image = fs.toBinary();
        console.log(`Generated SPIFFS image: ${image.length} bytes`);
        return image;
      }
    };
    
    // Store filesystem instance
    currentLittleFS = spiffsWrapper;
    currentLittleFSPartition = partition;
    currentLittleFSPath = '/';
    currentLittleFSBlockSize = config.blockSize;
    currentFilesystemType = 'spiffs';
    
    // Update UI
    littlefsPartitionName.textContent = partition.name;
    littlefsPartitionSize.textContent = formatSize(partition.size);
    littlefsDiskVersion.textContent = 'SPIFFS';
    
    // Show manager
    littlefsManager.classList.remove('hidden');
    
    // Enable write operations for SPIFFS (but not mkdir since SPIFFS is flat)
    butLittlefsUpload.disabled = false;
    butLittlefsMkdir.disabled = true; // SPIFFS doesn't support directories
    butLittlefsWrite.disabled = false;
    
    // Load files
    refreshLittleFS();
    
    logMsg('SPIFFS filesystem opened successfully');
    logMsg('Note: SPIFFS is a flat filesystem - directories are not supported.');
  } catch (e) {
    errorMsg(`Failed to open SPIFFS: ${e.message || e}`);
    console.error('SPIFFS open error:', e);
    resetLittleFSState();
  }
}

/**
 * Estimate LittleFS storage footprint for a single file (data + metadata block)
 */
function littlefsEstimateFileFootprint(size) {
  const block = currentLittleFSBlockSize || 4096;
  const dataBytes = Math.max(1, Math.ceil(size / block)) * block;
  const metadataBytes = block; // per-file metadata block
  return dataBytes + metadataBytes;
}

/**
 * Estimate total LittleFS usage for a set of entries
 */
function littlefsEstimateUsage(entries) {
  const block = currentLittleFSBlockSize || 4096;
  let total = block * 2; // root metadata copies
  
  for (const entry of entries || []) {
    if (entry.type === 'dir') {
      total += block;
    } else {
      total += littlefsEstimateFileFootprint(entry.size || 0);
    }
  }
  
  return total;
}

/**
 * Refresh LittleFS file list
 */
function refreshLittleFS() {
  if (!currentLittleFS) return;
  
  try {
    // Calculate usage based on all files (like ESPConnect)
    const allFiles = currentLittleFS.list('/');
    const usedBytes = littlefsEstimateUsage(allFiles);
    const totalBytes = currentLittleFSPartition.size;
    const usedPercent = Math.round((usedBytes / totalBytes) * 100);
    
    littlefsUsageBar.style.width = usedPercent + '%';
    littlefsUsageText.textContent = `Used: ${formatSize(usedBytes)} / ${formatSize(totalBytes)} (${usedPercent}%)`;
    
    // Update breadcrumb
    littlefsBreadcrumb.textContent = currentLittleFSPath || '/';
    butLittlefsUp.disabled = currentLittleFSPath === '/' || !currentLittleFSPath;
    
    // List files
    const entries = currentLittleFS.list(currentLittleFSPath);
    
    // Clear table
    littlefsFileList.innerHTML = '';
    
    if (entries.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="4" class="empty-state">No files in this directory</td>';
      littlefsFileList.appendChild(row);
      return;
    }
    
    // Sort: directories first, then files
    entries.sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.path.localeCompare(b.path);
    });
    
    // Add rows
    entries.forEach(entry => {
      const row = document.createElement('tr');
      
      // Name
      const nameCell = document.createElement('td');
      const nameDiv = document.createElement('div');
      nameDiv.className = 'file-name' + (entry.type === 'dir' ? ' clickable' : '');
      
      const icon = document.createElement('span');
      icon.className = 'file-icon';
      icon.textContent = entry.type === 'dir' ? '📁' : '📄';
      
      const name = entry.path.split('/').filter(Boolean).pop() || '/';
      const nameText = document.createElement('span');
      nameText.textContent = name;
      
      nameDiv.appendChild(icon);
      nameDiv.appendChild(nameText);
      
      if (entry.type === 'dir') {
        nameDiv.onclick = () => navigateLittleFS(entry.path);
      }
      
      nameCell.appendChild(nameDiv);
      row.appendChild(nameCell);
      
      // Type
      const typeCell = document.createElement('td');
      typeCell.textContent = entry.type === 'dir' ? 'Directory' : 'File';
      row.appendChild(typeCell);
      
      // Size
      const sizeCell = document.createElement('td');
      sizeCell.textContent = entry.type === 'file' ? formatSize(entry.size) : '-';
      row.appendChild(sizeCell);
      
      // Actions
      const actionsCell = document.createElement('td');
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'file-actions';
      
      if (entry.type === 'file') {
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => downloadLittleFSFile(entry.path);
        actionsDiv.appendChild(downloadBtn);
      }
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = () => deleteLittleFSFile(entry.path, entry.type);
      actionsDiv.appendChild(deleteBtn);
      
      actionsCell.appendChild(actionsDiv);
      row.appendChild(actionsCell);
      
      littlefsFileList.appendChild(row);
    });
  } catch (e) {
    errorMsg(`Failed to refresh file list: ${e.message || e}`);
  }
}

/**
 * Navigate to a directory in LittleFS
 */
function navigateLittleFS(path) {
  currentLittleFSPath = path;
  refreshLittleFS();
}

/**
 * Navigate up one directory
 */
function clickLittlefsUp() {
  if (currentLittleFSPath === '/' || !currentLittleFSPath) return;
  
  const parts = currentLittleFSPath.split('/').filter(Boolean);
  parts.pop();
  currentLittleFSPath = '/' + parts.join('/');
  if (currentLittleFSPath !== '/' && !currentLittleFSPath.endsWith('/')) {
    currentLittleFSPath += '/';
  }
  refreshLittleFS();
}

/**
 * Refresh button handler
 */
function clickLittlefsRefresh() {
  refreshLittleFS();
  logMsg(`${getFilesystemDisplayName()} file list refreshed`);
}

/**
 * Backup LittleFS image
 */
async function clickLittlefsBackup() {
  if (!currentLittleFS || !currentLittleFSPartition) return;
  
  try {
    logMsg(`Creating ${getFilesystemDisplayName()} backup image...`);
    const image = currentLittleFS.toImage();
    
    const fsType = currentFilesystemType || 'filesystem';
    const filename = `${currentLittleFSPartition.name}_${fsType}_backup.bin`;
    await saveDataToFile(image, filename);
    
    logMsg(`${getFilesystemDisplayName()} backup saved as "${filename}"`);
  } catch (e) {
    errorMsg(`Failed to backup ${getFilesystemDisplayName()}: ${e.message || e}`);
  }
}

/**
 * Write LittleFS image to flash
 */
async function clickLittlefsWrite() {
  if (!currentLittleFS || !currentLittleFSPartition) return;
  
  const confirmed = confirm(
    `Write modified filesystem to flash?\n\n` +
    `Partition: ${currentLittleFSPartition.name}\n` +
    `Offset: 0x${currentLittleFSPartition.offset.toString(16)}\n` +
    `Size: ${formatSize(currentLittleFSPartition.size)}\n\n` +
    `This will overwrite the current filesystem on the device!`
  );
  
  if (!confirmed) return;
  
  try {
    logMsg(`Creating ${getFilesystemDisplayName()} image...`);
    const image = currentLittleFS.toImage();
    logMsg(`Image created: ${formatSize(image.length)}`);
    
    if (image.length > currentLittleFSPartition.size) {
      errorMsg(`Image size (${formatSize(image.length)}) exceeds partition size (${formatSize(currentLittleFSPartition.size)})`);
      return;
    }
    
    // Disable buttons during write
    butLittlefsRefresh.disabled = true;
    butLittlefsBackup.disabled = true;
    butLittlefsWrite.disabled = true;
    butLittlefsClose.disabled = true;
    butLittlefsUpload.disabled = true;
    butLittlefsMkdir.disabled = true;
    
    logMsg(`Writing ${formatSize(image.length)} to partition "${currentLittleFSPartition.name}" at 0x${currentLittleFSPartition.offset.toString(16)}...`);
    
    // Use the LittleFS usage bar as progress indicator
    const usageBar = document.getElementById("littlefsUsageBar");
    const usageText = document.getElementById("littlefsUsageText");
    const originalUsageBarWidth = usageBar.style.width;
    const originalUsageText = usageText.textContent;
    
    // Convert Uint8Array to ArrayBuffer (CRITICAL: flashData expects ArrayBuffer, not Uint8Array)
    // This matches the ESPConnect implementation
    const imageBuffer = image.buffer.slice(image.byteOffset, image.byteOffset + image.byteLength);
    
    // Write the image to flash with progress indication
    await espStub.flashData(
      imageBuffer,
      (bytesWritten, totalBytes) => {
        const percent = Math.floor((bytesWritten / totalBytes) * 100);
        usageBar.style.width = percent + "%";
        usageText.textContent = `Writing: ${formatSize(bytesWritten)} / ${formatSize(totalBytes)} (${percent}%)`;
      },
      currentLittleFSPartition.offset
    );
    
    // Restore original usage display
    usageBar.style.width = originalUsageBarWidth;
    usageText.textContent = originalUsageText;
    
    logMsg(`${getFilesystemDisplayName()} successfully written to flash!`);
    logMsg(`To use the new filesystem, reset your device.`);
    
  } catch (e) {
    errorMsg(`Failed to write ${getFilesystemDisplayName()} to flash: ${e.message || e}`);
  } finally {
    // Re-enable buttons
    butLittlefsRefresh.disabled = false;
    butLittlefsBackup.disabled = false;
    butLittlefsWrite.disabled = false;
    butLittlefsClose.disabled = false;
    butLittlefsUpload.disabled = !littlefsFileInput.files.length;
    butLittlefsMkdir.disabled = false;
  }
}

/**
 * Close LittleFS manager
 */
function clickLittlefsClose() {
  const fsName = getFilesystemDisplayName() || 'Filesystem';
  
  if (currentLittleFS) {
    try {
      // Only call destroy if it exists (LittleFS has it, FatFS/SPIFFS don't)
      if (typeof currentLittleFS.destroy === 'function') {
        currentLittleFS.destroy();
      }
    } catch (e) {
      console.error(`Error destroying ${fsName}:`, e);
    }
    currentLittleFS = null;
  }
  
  currentLittleFSPartition = null;
  currentLittleFSPath = '/';
  currentFilesystemType = null;
  littlefsManager.classList.add('hidden');
  logMsg(`${fsName} manager closed`);
}

/**
 * Upload file to LittleFS
 */
async function clickLittlefsUpload() {
  if (!currentLittleFS || !littlefsFileInput.files.length) return;
  
  const file = littlefsFileInput.files[0];
  
  try {
    logMsg(`Uploading file "${file.name}"...`);
    
    const data = await file.arrayBuffer();
    const uint8Data = new Uint8Array(data);
    
    // Construct target path
    let targetPath = currentLittleFSPath;
    if (!targetPath.endsWith('/')) targetPath += '/';
    targetPath += file.name;
    
    // Ensure parent directories exist
    const segments = targetPath.split('/').filter(Boolean);
    if (segments.length > 1) {
      let built = '';
      for (let i = 0; i < segments.length - 1; i++) {
        built += `/${segments[i]}`;
        try {
          currentLittleFS.mkdir(built);
        } catch (e) {
          // Ignore if directory already exists
        }
      }
    }
    
    // Write file to LittleFS - EXACTLY like ESPConnect
    if (typeof currentLittleFS.writeFile === 'function') {
      currentLittleFS.writeFile(targetPath, uint8Data);
    } else if (typeof currentLittleFS.addFile === 'function') {
      currentLittleFS.addFile(targetPath, uint8Data);
    }
    
    // Verify by reading back
    const readBack = currentLittleFS.readFile(targetPath);
    logMsg(`File written: ${readBack.length} bytes at ${targetPath}`);
    
    // Clear input
    littlefsFileInput.value = '';
    butLittlefsUpload.disabled = true;
    
    // Refresh list
    refreshLittleFS();
    
    logMsg(`File "${file.name}" uploaded successfully`);
  } catch (e) {
    errorMsg(`Failed to upload file: ${e.message || e}`);
  }
}

/**
 * Create new directory
 */
function clickLittlefsMkdir() {
  if (!currentLittleFS) return;
  
  const dirName = prompt('Enter directory name:');
  if (!dirName || !dirName.trim()) return;
  
  try {
    let targetPath = currentLittleFSPath;
    if (!targetPath.endsWith('/')) targetPath += '/';
    targetPath += dirName.trim();
    
    currentLittleFS.mkdir(targetPath);
    refreshLittleFS();
    
    logMsg(`Directory "${dirName}" created successfully`);
  } catch (e) {
    errorMsg(`Failed to create directory: ${e.message || e}`);
  }
}

/**
 * Download file from LittleFS
 */
async function downloadLittleFSFile(path) {
  if (!currentLittleFS) return;
  
  try {
    logMsg(`Downloading file "${path}"...`);
    
    const data = currentLittleFS.readFile(path);
    const filename = path.split('/').filter(Boolean).pop() || 'file.bin';
    
    await saveDataToFile(data, filename);
    
    logMsg(`File "${filename}" downloaded successfully`);
  } catch (e) {
    errorMsg(`Failed to download file: ${e.message || e}`);
  }
}

/**
 * Delete file or directory from LittleFS
 */
function deleteLittleFSFile(path, type) {
  if (!currentLittleFS) return;
  
  const name = path.split('/').filter(Boolean).pop() || path;
  const confirmed = confirm(`Delete ${type} "${name}"?`);
  
  if (!confirmed) return;
  
  try {
    if (type === 'dir') {
      currentLittleFS.delete(path, { recursive: true });
    } else {
      currentLittleFS.deleteFile(path);
    }
    
    refreshLittleFS();
    logMsg(`${type === 'dir' ? 'Directory' : 'File'} "${name}" deleted successfully`);
  } catch (e) {
    errorMsg(`Failed to delete ${type}: ${e.message || e}`);
  }
}
