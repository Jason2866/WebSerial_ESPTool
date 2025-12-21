const { app, BrowserWindow, Menu, session, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// Only required for Windows Squirrel installer
if (process.platform === 'win32') {
  try {
    if (require('electron-squirrel-startup')) {
      app.quit();
    }
  } catch (e) {
    // Module not available, ignore
  }
}

let mainWindow;

// Store granted serial port devices
const grantedDevices = new Map();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icons', 'icon.png'),
    title: 'WebSerial ESPTool',
    autoHideMenuBar: false,
  });

  // Load the index.html of the app
  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Setup serial port handlers for this window's session
  setupSerialPortHandlers(mainWindow.webContents.session);
}

function setupSerialPortHandlers(ses) {
  let lastSelectedPort = null;
  let esp32s2ReconnectPending = false;
  let portSelectionQueue = [];
  
  // Handle serial port selection - shows when navigator.serial.requestPort() is called
  ses.on('select-serial-port', (event, portList, webContents, callback) => {
    event.preventDefault();

    console.log('Available serial ports:', portList.map(p => ({
      portId: p.portId,
      portName: p.portName,
      displayName: p.displayName
    })));

    if (portList && portList.length > 0) {
      // Try to find ESP-compatible port
      const espPort = portList.find(port => {
        const name = (port.displayName || port.portName || '').toLowerCase();
        return name.includes('cp210') ||
               name.includes('ch910') ||
               name.includes('ch340') ||
               name.includes('ch341') ||
               name.includes('ch343') ||
               name.includes('ftdi') ||
               name.includes('usb') ||
               name.includes('uart') ||
               name.includes('silicon labs') ||
               name.includes('esp');
      });

      // Select ESP-compatible port or first available
      const selectedPort = espPort || portList[0];
      console.log('Selected port:', selectedPort.portId, selectedPort.displayName || selectedPort.portName);
      lastSelectedPort = selectedPort;
      
      callback(selectedPort.portId);
    } else {
      console.log('No serial ports available - queuing selection');
      // No ports available yet - queue this callback for when a port appears
      portSelectionQueue.push(callback);
    }
  });

  // Track port additions - handle ESP32-S2 reconnect
  ses.on('serial-port-added', (event, port) => {
    console.log('Serial port added:', port);
    
    // If we have queued port selections, handle them now
    if (portSelectionQueue.length > 0) {
      console.log('Processing queued port selection');
      const callback = portSelectionQueue.shift();
      callback(port.portId);
      lastSelectedPort = port;
    }
    
    // Check if this looks like an ESP32-S2 CDC port appearing after ROM port disappeared
    if (lastSelectedPort && port.portName !== lastSelectedPort.portName) {
      const name = (port.displayName || port.portName || '').toLowerCase();
      if (name.includes('esp') || name.includes('usb') || name.includes('uart')) {
        console.log('ESP32-S2 reconnect detected - new CDC port available');
        esp32s2ReconnectPending = true;
      }
    }
  });

  // Track port removals - detect ESP32-S2 disconnect
  ses.on('serial-port-removed', (event, port) => {
    console.log('Serial port removed:', port);
    
    // If the last selected port was removed, prepare for reconnect
    if (lastSelectedPort && port.portId === lastSelectedPort.portId) {
      console.log('Last selected port removed - may be ESP32-S2 mode switch');
      // Don't clear lastSelectedPort yet, we might need it for comparison
    }
  });

  // Grant permission for serial port access checks
  ses.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'serial') {
      return true;
    }
    return true;
  });

  // Handle device permission requests  
  ses.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'serial') {
      if (details.device) {
        grantedDevices.set(details.device.deviceId, details.device);
      }
      return true;
    }
    return true;
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About WebSerial ESPTool',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/Jason2866/WebSerial_ESPTool');
          }
        },
        {
          label: 'ESP32 Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://docs.espressif.com/');
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createMenu();
  createWindow();

  app.on('activate', () => {
    // On macOS re-create a window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ============================================
// IPC Handlers for File Operations
// ============================================

// Save file dialog and write data
ipcMain.handle('save-file', async (event, { data, defaultFilename, filters }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultFilename,
    filters: filters || [
      { name: 'Binary Files', extensions: ['bin'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePath) {
    return { success: false, canceled: true };
  }

  try {
    // Convert data to Buffer if it's a Uint8Array
    const buffer = Buffer.from(data);
    fs.writeFileSync(result.filePath, buffer);
    return { success: true, filePath: result.filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open file dialog and read data
ipcMain.handle('open-file', async (event, { filters }) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters || [
      { name: 'Binary Files', extensions: ['bin'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, canceled: true };
  }

  try {
    const filePath = result.filePaths[0];
    const data = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    return { 
      success: true, 
      filePath, 
      filename,
      data: Array.from(data) // Convert Buffer to array for IPC transfer
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Show input dialog (replacement for prompt())
ipcMain.handle('show-prompt', async (event, { message, defaultValue }) => {
  // Use a simple approach - return the default value
  // In Electron, we use the save dialog instead of prompt
  return defaultValue;
});

// Show message box
ipcMain.handle('show-message', async (event, { type, title, message, buttons }) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: type || 'info',
    title: title || 'WebSerial ESPTool',
    message: message,
    buttons: buttons || ['OK']
  });
  return result.response;
});

// Show confirm dialog
ipcMain.handle('show-confirm', async (event, { message }) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    title: 'Confirm',
    message: message,
    buttons: ['OK', 'Cancel']
  });
  return result.response === 0; // true if OK clicked
});
