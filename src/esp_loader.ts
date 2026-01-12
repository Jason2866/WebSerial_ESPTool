/// <reference types="@types/w3c-web-serial" />

import {
  CHIP_FAMILY_ESP32,
  CHIP_FAMILY_ESP32S2,
  CHIP_FAMILY_ESP32S3,
  CHIP_FAMILY_ESP32C2,
  CHIP_FAMILY_ESP32C3,
  CHIP_FAMILY_ESP32C5,
  CHIP_FAMILY_ESP32C6,
  CHIP_FAMILY_ESP32C61,
  CHIP_FAMILY_ESP32H2,
  CHIP_FAMILY_ESP32H4,
  CHIP_FAMILY_ESP32H21,
  CHIP_FAMILY_ESP32P4,
  CHIP_FAMILY_ESP32S31,
  CHIP_FAMILY_ESP8266,
  MAX_TIMEOUT,
  Logger,
  DEFAULT_TIMEOUT,
  ERASE_REGION_TIMEOUT_PER_MB,
  ESP_CHANGE_BAUDRATE,
  ESP_CHECKSUM_MAGIC,
  ESP_FLASH_BEGIN,
  ESP_FLASH_DATA,
  ESP_FLASH_END,
  ESP_MEM_BEGIN,
  ESP_MEM_DATA,
  ESP_MEM_END,
  ESP_READ_REG,
  ESP_WRITE_REG,
  ESP_SPI_ATTACH,
  ESP_SYNC,
  ESP_GET_SECURITY_INFO,
  FLASH_SECTOR_SIZE,
  FLASH_WRITE_SIZE,
  STUB_FLASH_WRITE_SIZE,
  MEM_END_ROM_TIMEOUT,
  ROM_INVALID_RECV_MSG,
  SYNC_PACKET,
  SYNC_TIMEOUT,
  USB_RAM_BLOCK,
  ChipFamily,
  ESP_ERASE_FLASH,
  ESP_READ_FLASH,
  CHIP_ERASE_TIMEOUT,
  FLASH_READ_TIMEOUT,
  timeoutPerMb,
  ESP_ROM_BAUD,
  USB_JTAG_SERIAL_PID,
  ESP_FLASH_DEFL_BEGIN,
  ESP_FLASH_DEFL_DATA,
  ESP_FLASH_DEFL_END,
  getSpiFlashAddresses,
  SpiFlashAddresses,
  DETECTED_FLASH_SIZES,
  CHIP_DETECT_MAGIC_REG_ADDR,
  CHIP_DETECT_MAGIC_VALUES,
  CHIP_ID_TO_INFO,
  ESP32P4_EFUSE_BLOCK1_ADDR,
  SlipReadError,
} from "./const";
import { getStubCode } from "./stubs";
import { hexFormatter, sleep, slipEncode, toHex } from "./util";
import { deflate } from "pako";
import { pack, unpack } from "./struct";

// Interface for WebUSB Serial Port (extends SerialPort with WebUSB-specific methods)
interface WebUSBSerialPort extends SerialPort {
  isWebUSB?: boolean;
  maxTransferSize?: number;
  setSignals(signals: {
    dataTerminalReady?: boolean;
    requestToSend?: boolean;
  }): Promise<void>;
  setBaudRate(baudRate: number): Promise<void>;
}

export class ESPLoader extends EventTarget {
  chipFamily!: ChipFamily;
  chipName: string | null = null;
  chipRevision: number | null = null;
  chipVariant: string | null = null;
  _efuses = new Array(4).fill(0);
  _flashsize = 4 * 1024 * 1024;
  debug = false;
  IS_STUB = false;
  connected = true;
  flashSize: string | null = null;

  __inputBuffer?: number[];
  __inputBufferReadIndex?: number;
  __totalBytesRead?: number;
  private _currentBaudRate: number = ESP_ROM_BAUD;
  private _maxUSBSerialBaudrate?: number;
  private _reader?: ReadableStreamDefaultReader<Uint8Array>;
  private _isESP32S2NativeUSB: boolean = false;
  private _initializationSucceeded: boolean = false;
  private __commandLock: Promise<[number, number[]]> = Promise.resolve([0, []]);
  private __isReconfiguring: boolean = false;
  private __abandonCurrentOperation: boolean = false;

  // Adaptive speed adjustment for flash read operations - DISABLED
  // Using fixed conservative values that work reliably
  private __adaptiveBlockMultiplier: number = 1;
  private __adaptiveMaxInFlightMultiplier: number = 1;
  private __consecutiveSuccessfulChunks: number = 0;
  private __lastAdaptiveAdjustment: number = 0;
  private __isCDCDevice: boolean = false;

  constructor(
    public port: SerialPort,
    public logger: Logger,
    private _parent?: ESPLoader,
  ) {
    super();
  }

  private get _inputBuffer(): number[] {
    return this._parent ? this._parent._inputBuffer : this.__inputBuffer!;
  }

  private get _inputBufferReadIndex(): number {
    return this._parent
      ? this._parent._inputBufferReadIndex
      : this.__inputBufferReadIndex || 0;
  }

  private set _inputBufferReadIndex(value: number) {
    if (this._parent) {
      this._parent._inputBufferReadIndex = value;
    } else {
      this.__inputBufferReadIndex = value;
    }
  }

  // Get available bytes in buffer (from read index to end)
  private get _inputBufferAvailable(): number {
    return this._inputBuffer.length - this._inputBufferReadIndex;
  }

  // Read one byte from buffer (ring-buffer style with index pointer)
  private _readByte(): number | undefined {
    if (this._inputBufferReadIndex >= this._inputBuffer.length) {
      return undefined;
    }
    return this._inputBuffer[this._inputBufferReadIndex++];
  }

  // Clear input buffer and reset read index
  private _clearInputBuffer(): void {
    this._inputBuffer.length = 0;
    this._inputBufferReadIndex = 0;
  }

  // Compact buffer when read index gets too large (prevent memory growth)
  private _compactInputBuffer(): void {
    if (
      this._inputBufferReadIndex > 1000 &&
      this._inputBufferReadIndex > this._inputBuffer.length / 2
    ) {
      // Remove already-read bytes and reset index
      this._inputBuffer.splice(0, this._inputBufferReadIndex);
      this._inputBufferReadIndex = 0;
    }
  }

  private get _totalBytesRead(): number {
    return this._parent
      ? this._parent._totalBytesRead
      : this.__totalBytesRead || 0;
  }

  private set _totalBytesRead(value: number) {
    if (this._parent) {
      this._parent._totalBytesRead = value;
    } else {
      this.__totalBytesRead = value;
    }
  }

  private get _commandLock(): Promise<[number, number[]]> {
    return this._parent ? this._parent._commandLock : this.__commandLock;
  }

  private set _commandLock(value: Promise<[number, number[]]>) {
    if (this._parent) {
      this._parent._commandLock = value;
    } else {
      this.__commandLock = value;
    }
  }

  private get _isReconfiguring(): boolean {
    return this._parent
      ? this._parent._isReconfiguring
      : this.__isReconfiguring;
  }

  private set _isReconfiguring(value: boolean) {
    if (this._parent) {
      this._parent._isReconfiguring = value;
    } else {
      this.__isReconfiguring = value;
    }
  }

  private get _abandonCurrentOperation(): boolean {
    return this._parent
      ? this._parent._abandonCurrentOperation
      : this.__abandonCurrentOperation;
  }

  private set _abandonCurrentOperation(value: boolean) {
    if (this._parent) {
      this._parent._abandonCurrentOperation = value;
    } else {
      this.__abandonCurrentOperation = value;
    }
  }

  private get _adaptiveBlockMultiplier(): number {
    return this._parent
      ? this._parent._adaptiveBlockMultiplier
      : this.__adaptiveBlockMultiplier;
  }

  private set _adaptiveBlockMultiplier(value: number) {
    if (this._parent) {
      this._parent._adaptiveBlockMultiplier = value;
    } else {
      this.__adaptiveBlockMultiplier = value;
    }
  }

  private get _adaptiveMaxInFlightMultiplier(): number {
    return this._parent
      ? this._parent._adaptiveMaxInFlightMultiplier
      : this.__adaptiveMaxInFlightMultiplier;
  }

  private set _adaptiveMaxInFlightMultiplier(value: number) {
    if (this._parent) {
      this._parent._adaptiveMaxInFlightMultiplier = value;
    } else {
      this.__adaptiveMaxInFlightMultiplier = value;
    }
  }

  private get _consecutiveSuccessfulChunks(): number {
    return this._parent
      ? this._parent._consecutiveSuccessfulChunks
      : this.__consecutiveSuccessfulChunks;
  }

  private set _consecutiveSuccessfulChunks(value: number) {
    if (this._parent) {
      this._parent._consecutiveSuccessfulChunks = value;
    } else {
      this.__consecutiveSuccessfulChunks = value;
    }
  }

  private get _lastAdaptiveAdjustment(): number {
    return this._parent
      ? this._parent._lastAdaptiveAdjustment
      : this.__lastAdaptiveAdjustment;
  }

  private set _lastAdaptiveAdjustment(value: number) {
    if (this._parent) {
      this._parent._lastAdaptiveAdjustment = value;
    } else {
      this.__lastAdaptiveAdjustment = value;
    }
  }

  private get _isCDCDevice(): boolean {
    return this._parent ? this._parent._isCDCDevice : this.__isCDCDevice;
  }

  private set _isCDCDevice(value: boolean) {
    if (this._parent) {
      this._parent._isCDCDevice = value;
    } else {
      this.__isCDCDevice = value;
    }
  }

  private detectUSBSerialChip(
    vendorId: number,
    productId: number,
  ): { name: string; maxBaudrate?: number } {
    // Common USB-Serial chip vendors and their products
    const chips: Record<
      number,
      Record<number, { name: string; maxBaudrate?: number }>
    > = {
      0x1a86: {
        // QinHeng Electronics
        0x7522: { name: "CH340", maxBaudrate: 460800 },
        0x7523: { name: "CH340", maxBaudrate: 460800 },
        0x7584: { name: "CH340", maxBaudrate: 460800 },
        0x5523: { name: "CH341", maxBaudrate: 2000000 },
        0x55d3: { name: "CH343", maxBaudrate: 6000000 },
        0x55d4: { name: "CH9102", maxBaudrate: 6000000 },
        0x55d8: { name: "CH9101", maxBaudrate: 3000000 },
      },
      0x10c4: {
        // Silicon Labs
        0xea60: { name: "CP2102(n)", maxBaudrate: 3000000 },
        0xea70: { name: "CP2105", maxBaudrate: 2000000 },
        0xea71: { name: "CP2108", maxBaudrate: 2000000 },
      },
      0x0403: {
        // FTDI
        0x6001: { name: "FT232R", maxBaudrate: 3000000 },
        0x6010: { name: "FT2232", maxBaudrate: 3000000 },
        0x6011: { name: "FT4232", maxBaudrate: 3000000 },
        0x6014: { name: "FT232H", maxBaudrate: 12000000 },
        0x6015: { name: "FT230X", maxBaudrate: 3000000 },
      },
      0x303a: {
        // Espressif (native USB)
        0x2: { name: "ESP32-S2 Native USB", maxBaudrate: 2000000 },
        0x1001: { name: "ESP32 Native USB", maxBaudrate: 2000000 },
        0x1002: { name: "ESP32 Native USB", maxBaudrate: 2000000 },
        0x4002: { name: "ESP32 Native USB", maxBaudrate: 2000000 },
        0x1000: { name: "ESP32 Native USB", maxBaudrate: 2000000 },
      },
    };

    const vendor = chips[vendorId];
    if (vendor && vendor[productId]) {
      return vendor[productId];
    }

    return {
      name: `Unknown (VID: 0x${vendorId.toString(16)}, PID: 0x${productId.toString(16)})`,
    };
  }

  async initialize() {
    if (!this._parent) {
      this.__inputBuffer = [];
      this.__inputBufferReadIndex = 0;
      this.__totalBytesRead = 0;

      // Detect and log USB-Serial chip info
      const portInfo = this.port.getInfo();
      if (portInfo.usbVendorId && portInfo.usbProductId) {
        const chipInfo = this.detectUSBSerialChip(
          portInfo.usbVendorId,
          portInfo.usbProductId,
        );
        this.logger.log(
          `USB-Serial: ${chipInfo.name} (VID: 0x${portInfo.usbVendorId.toString(16)}, PID: 0x${portInfo.usbProductId.toString(16)})`,
        );
        if (chipInfo.maxBaudrate) {
          this._maxUSBSerialBaudrate = chipInfo.maxBaudrate;
          this.logger.log(`Max baudrate: ${chipInfo.maxBaudrate}`);
        }
        // Detect ESP32-S2 Native USB
        if (portInfo.usbVendorId === 0x303a && portInfo.usbProductId === 0x2) {
          this._isESP32S2NativeUSB = true;
        }

        // Detect CDC devices for adaptive speed adjustment
        // Espressif Native USB (VID: 0x303a) or CH343 (VID: 0x1a86, PID: 0x55d3)
        if (
          portInfo.usbVendorId === 0x303a ||
          (portInfo.usbVendorId === 0x1a86 && portInfo.usbProductId === 0x55d3)
        ) {
          this._isCDCDevice = true;
        }
      }

      // Don't await this promise so it doesn't block rest of method.
      this.readLoop();
    }

    // Try to connect with different reset strategies
    await this.connectWithResetStrategies();

    // Detect chip type
    await this.detectChip();

    // Read the OTP data for this chip and store into this.efuses array
    const FlAddr = getSpiFlashAddresses(this.getChipFamily());
    const AddrMAC = FlAddr.macFuse;
    for (let i = 0; i < 4; i++) {
      this._efuses[i] = await this.readRegister(AddrMAC + 4 * i);
    }
    this.logger.log(`Chip type ${this.chipName}`);
    this.logger.debug(
      `Bootloader flash offset: 0x${FlAddr.flashOffs.toString(16)}`,
    );

    // Mark initialization as successful
    this._initializationSucceeded = true;
  }

  /**
   * Detect chip type using GET_SECURITY_INFO (for newer chips) or magic value (for older chips)
   */
  async detectChip() {
    try {
      // Try GET_SECURITY_INFO command first (ESP32-C3 and later)
      const securityInfo = await this.getSecurityInfo();
      const chipId = securityInfo.chipId;

      const chipInfo = CHIP_ID_TO_INFO[chipId];
      if (chipInfo) {
        this.chipName = chipInfo.name;
        this.chipFamily = chipInfo.family;

        // Get chip revision for ESP32-P4
        if (this.chipFamily === CHIP_FAMILY_ESP32P4) {
          this.chipRevision = await this.getChipRevision();
          this.logger.debug(`ESP32-P4 revision: ${this.chipRevision}`);

          // Set chip variant based on revision
          if (this.chipRevision >= 300) {
            this.chipVariant = "rev300";
          } else {
            this.chipVariant = "rev0";
          }
          this.logger.debug(`ESP32-P4 variant: ${this.chipVariant}`);
        }

        this.logger.debug(
          `Detected chip via IMAGE_CHIP_ID: ${chipId} (${this.chipName})`,
        );
        return;
      }

      this.logger.debug(
        `Unknown IMAGE_CHIP_ID: ${chipId}, falling back to magic value detection`,
      );
    } catch (error) {
      // GET_SECURITY_INFO not supported, fall back to magic value detection
      this.logger.debug(
        `GET_SECURITY_INFO failed, using magic value detection: ${error}`,
      );

      // Drain input buffer for CP210x compatibility on Windows
      // This ensures all error responses are cleared before continuing
      await this.drainInputBuffer(200);

      // Clear input buffer and re-sync to recover from failed command
      this._clearInputBuffer();
      await sleep(SYNC_TIMEOUT);

      // Re-sync with the chip to ensure clean communication
      try {
        await this.sync();
      } catch (syncErr) {
        this.logger.debug(
          `Re-sync after GET_SECURITY_INFO failure: ${syncErr}`,
        );
      }
    }

    // Fallback: Use magic value detection for ESP8266, ESP32, ESP32-S2
    const chipMagicValue = await this.readRegister(CHIP_DETECT_MAGIC_REG_ADDR);
    const chip = CHIP_DETECT_MAGIC_VALUES[chipMagicValue >>> 0];
    if (chip === undefined) {
      throw new Error(
        `Unknown Chip: Hex: ${toHex(
          chipMagicValue >>> 0,
          8,
        ).toLowerCase()} Number: ${chipMagicValue}`,
      );
    }
    this.chipName = chip.name;
    this.chipFamily = chip.family;

    if (this.chipFamily === CHIP_FAMILY_ESP32P4) {
      this.chipRevision = await this.getChipRevision();
      this.logger.debug(`ESP32-P4 revision: ${this.chipRevision}`);

      if (this.chipRevision >= 300) {
        this.chipVariant = "rev300";
      } else {
        this.chipVariant = "rev0";
      }
      this.logger.debug(`ESP32-P4 variant: ${this.chipVariant}`);
    }

    this.logger.debug(
      `Detected chip via magic value: ${toHex(chipMagicValue >>> 0, 8)} (${this.chipName})`,
    );
  }

  /**
   * Get chip revision for ESP32-P4
   */
  async getChipRevision(): Promise<number> {
    if (this.chipFamily !== CHIP_FAMILY_ESP32P4) {
      return 0;
    }

    // Read from EFUSE_BLOCK1 to get chip revision
    // Word 2 contains revision info for ESP32-P4
    const word2 = await this.readRegister(ESP32P4_EFUSE_BLOCK1_ADDR + 8);

    // Minor revision: bits [3:0]
    const minorRev = word2 & 0x0f;

    // Major revision: bits [23] << 2 | bits [5:4]
    const majorRev = (((word2 >> 23) & 1) << 2) | ((word2 >> 4) & 0x03);

    // Revision is major * 100 + minor
    return majorRev * 100 + minorRev;
  }

  /**
   * Get security info including chip ID (ESP32-C3 and later)
   */
  async getSecurityInfo(): Promise<{
    flags: number;
    flashCryptCnt: number;
    keyPurposes: number[];
    chipId: number;
    apiVersion: number;
  }> {
    const [, responseData] = await this.checkCommand(
      ESP_GET_SECURITY_INFO,
      [],
      0,
    );

    // Some chips/ROM versions return empty response or don't support this command
    if (responseData.length === 0) {
      throw new Error(
        `GET_SECURITY_INFO not supported or returned empty response`,
      );
    }

    if (responseData.length < 12) {
      throw new Error(
        `Invalid security info response length: ${responseData.length} (expected at least 12 bytes)`,
      );
    }

    const flags = unpack("<I", responseData.slice(0, 4))[0];
    const flashCryptCnt = responseData[4];
    const keyPurposes = Array.from(responseData.slice(5, 12));
    const chipId =
      responseData.length >= 16
        ? unpack("<I", responseData.slice(12, 16))[0]
        : 0;
    const apiVersion =
      responseData.length >= 20
        ? unpack("<I", responseData.slice(16, 20))[0]
        : 0;

    return {
      flags,
      flashCryptCnt,
      keyPurposes,
      chipId,
      apiVersion,
    };
  }

  /**
   * @name readLoop
   * Reads data from the input stream and places it in the inputBuffer
   */
  async readLoop() {
    if (this.debug) {
      this.logger.debug("Starting read loop");
    }

    this._reader = this.port.readable!.getReader();

    try {
      let keepReading = true;
      while (keepReading) {
        const { value, done } = await this._reader.read();
        if (done) {
          this._reader.releaseLock();
          keepReading = false;
          break;
        }
        if (!value || value.length === 0) {
          continue;
        }

        // Always read from browser's serial buffer immediately
        // to prevent browser buffer overflow. Don't apply back-pressure here.
        const chunk = Array.from(value);
        Array.prototype.push.apply(this._inputBuffer, chunk);

        // Track total bytes read from serial port
        this._totalBytesRead += value.length;
      }
    } catch {
      this.logger.error("Read loop got disconnected");
    }
    // Disconnected!
    this.connected = false;

    // Check if this is ESP32-S2 Native USB that needs port reselection
    // Only trigger reconnect if initialization did NOT succeed (wrong port)
    if (this._isESP32S2NativeUSB && !this._initializationSucceeded) {
      this.logger.log(
        "ESP32-S2 Native USB detected - requesting port reselection",
      );
      this.dispatchEvent(
        new CustomEvent("esp32s2-usb-reconnect", {
          detail: { message: "ESP32-S2 Native USB requires port reselection" },
        }),
      );
    }

    this.dispatchEvent(new Event("disconnect"));
    this.logger.debug("Finished read loop");
  }

  sleep(ms = 100) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  state_DTR = false;

  // ============================================================================
  // Web Serial (Desktop) - DTR/RTS Signal Handling & Reset Strategies
  // ============================================================================

  async setRTS(state: boolean) {
    await this.port.setSignals({ requestToSend: state });
    // Work-around for adapters on Windows using the usbser.sys driver:
    // generate a dummy change to DTR so that the set-control-line-state
    // request is sent with the updated RTS state and the same DTR state
    // Referenced to esptool.py
    await this.setDTR(this.state_DTR);
  }

  async setDTR(state: boolean) {
    this.state_DTR = state;
    await this.port.setSignals({ dataTerminalReady: state });
  }

  /**
   * @name hardResetUSBJTAGSerial
   * USB-JTAG/Serial reset for Web Serial (Desktop)
   */
  async hardResetUSBJTAGSerial() {
    await this.setRTS(false);
    await this.setDTR(false); // Idle
    await this.sleep(100);

    await this.setDTR(true); // Set IO0
    await this.setRTS(false);
    await this.sleep(100);

    await this.setRTS(true); // Reset
    await this.setDTR(false);
    await this.setRTS(true);
    await this.sleep(100);

    await this.setDTR(false);
    await this.setRTS(false); // Chip out of reset

    await this.sleep(200);
  }

  /**
   * @name hardResetClassic
   * Classic reset for Web Serial (Desktop)
   */
  async hardResetClassic() {
    await this.setDTR(false); // IO0=HIGH
    await this.setRTS(true); // EN=LOW, chip in reset
    await this.sleep(100);
    await this.setDTR(true); // IO0=LOW
    await this.setRTS(false); // EN=HIGH, chip out of reset
    await this.sleep(50);
    await this.setDTR(false); // IO0=HIGH, done

    await this.sleep(200);
  }

  // ============================================================================
  // WebUSB (Android) - DTR/RTS Signal Handling & Reset Strategies
  // ============================================================================

  async setRTSWebUSB(state: boolean) {
    // Always specify both signals to avoid flipping the other line
    // The WebUSB setSignals() now preserves unspecified signals, but being explicit is safer
    await (this.port as WebUSBSerialPort).setSignals({
      requestToSend: state,
      dataTerminalReady: this.state_DTR,
    });
  }

  async setDTRWebUSB(state: boolean) {
    this.state_DTR = state;
    // Always specify both signals to avoid flipping the other line
    await (this.port as WebUSBSerialPort).setSignals({
      dataTerminalReady: state,
      requestToSend: undefined, // Let setSignals preserve current RTS state
    });
  }

  async setDTRandRTSWebUSB(dtr: boolean, rts: boolean) {
    this.state_DTR = dtr;
    await (this.port as WebUSBSerialPort).setSignals({
      dataTerminalReady: dtr,
      requestToSend: rts,
    });
  }

  /**
   * @name hardResetUSBJTAGSerialWebUSB
   * USB-JTAG/Serial reset for WebUSB (Android)
   */
  async hardResetUSBJTAGSerialWebUSB() {
    await this.setRTSWebUSB(false);
    await this.setDTRWebUSB(false); // Idle
    await this.sleep(100);

    await this.setDTRWebUSB(true); // Set IO0
    await this.setRTSWebUSB(false);
    await this.sleep(100);

    await this.setRTSWebUSB(true); // Reset
    await this.setDTRWebUSB(false);
    await this.setRTSWebUSB(true);
    await this.sleep(100);

    await this.setDTRWebUSB(false);
    await this.setRTSWebUSB(false); // Chip out of reset

    await this.sleep(200);
  }

  /**
   * @name hardResetUSBJTAGSerialInvertedDTRWebUSB
   * USB-JTAG/Serial reset with inverted DTR for WebUSB (Android)
   */
  async hardResetUSBJTAGSerialInvertedDTRWebUSB() {
    await this.setRTSWebUSB(false);
    await this.setDTRWebUSB(true); // Idle (DTR inverted)
    await this.sleep(100);

    await this.setDTRWebUSB(false); // Set IO0 (DTR inverted)
    await this.setRTSWebUSB(false);
    await this.sleep(100);

    await this.setRTSWebUSB(true); // Reset
    await this.setDTRWebUSB(true); // (DTR inverted)
    await this.setRTSWebUSB(true);
    await this.sleep(100);

    await this.setDTRWebUSB(true); // (DTR inverted)
    await this.setRTSWebUSB(false); // Chip out of reset

    await this.sleep(200);
  }

  /**
   * @name hardResetClassicWebUSB
   * Classic reset for WebUSB (Android)
   */
  async hardResetClassicWebUSB() {
    await this.setDTRWebUSB(false); // IO0=HIGH
    await this.setRTSWebUSB(true); // EN=LOW, chip in reset
    await this.sleep(100);
    await this.setDTRWebUSB(true); // IO0=LOW
    await this.setRTSWebUSB(false); // EN=HIGH, chip out of reset
    await this.sleep(50);
    await this.setDTRWebUSB(false); // IO0=HIGH, done
    await this.sleep(200);
  }

  /**
   * @name hardResetUnixTightWebUSB
   * Unix Tight reset for WebUSB (Android) - sets DTR and RTS simultaneously
   */
  async hardResetUnixTightWebUSB() {
    await this.setDTRandRTSWebUSB(false, false);
    await this.setDTRandRTSWebUSB(true, true);
    await this.setDTRandRTSWebUSB(false, true); // IO0=HIGH & EN=LOW, chip in reset
    await this.sleep(100);
    await this.setDTRandRTSWebUSB(true, false); // IO0=LOW & EN=HIGH, chip out of reset
    await this.sleep(50);
    await this.setDTRandRTSWebUSB(false, false); // IO0=HIGH, done
    await this.setDTRWebUSB(false); // Ensure IO0=HIGH
    await this.sleep(200);
  }

  /**
   * @name hardResetClassicLongDelayWebUSB
   * Classic reset with longer delays for WebUSB (Android)
   * Specifically for CP2102/CH340 which may need more time
   */
  async hardResetClassicLongDelayWebUSB() {
    await this.setDTRWebUSB(false); // IO0=HIGH
    await this.setRTSWebUSB(true); // EN=LOW, chip in reset
    await this.sleep(500); // Extra long delay
    await this.setDTRWebUSB(true); // IO0=LOW
    await this.setRTSWebUSB(false); // EN=HIGH, chip out of reset
    await this.sleep(200);
    await this.setDTRWebUSB(false); // IO0=HIGH, done
    await this.sleep(500); // Extra long delay
  }

  /**
   * @name hardResetClassicShortDelayWebUSB
   * Classic reset with shorter delays for WebUSB (Android)
   */
  async hardResetClassicShortDelayWebUSB() {
    await this.setDTRWebUSB(false); // IO0=HIGH
    await this.setRTSWebUSB(true); // EN=LOW, chip in reset
    await this.sleep(50);
    await this.setDTRWebUSB(true); // IO0=LOW
    await this.setRTSWebUSB(false); // EN=HIGH, chip out of reset
    await this.sleep(25);
    await this.setDTRWebUSB(false); // IO0=HIGH, done
    await this.sleep(100);
  }

  /**
   * @name hardResetInvertedWebUSB
   * Inverted reset sequence for WebUSB (Android) - both signals inverted
   */
  async hardResetInvertedWebUSB() {
    await this.setDTRWebUSB(true); // IO0=HIGH (inverted)
    await this.setRTSWebUSB(false); // EN=LOW, chip in reset (inverted)
    await this.sleep(100);
    await this.setDTRWebUSB(false); // IO0=LOW (inverted)
    await this.setRTSWebUSB(true); // EN=HIGH, chip out of reset (inverted)
    await this.sleep(50);
    await this.setDTRWebUSB(true); // IO0=HIGH, done (inverted)
    await this.sleep(200);
  }

  /**
   * @name hardResetInvertedDTRWebUSB
   * Only DTR inverted for WebUSB (Android)
   */
  async hardResetInvertedDTRWebUSB() {
    await this.setDTRWebUSB(true); // IO0=HIGH (DTR inverted)
    await this.setRTSWebUSB(true); // EN=LOW, chip in reset (RTS normal)
    await this.sleep(100);
    await this.setDTRWebUSB(false); // IO0=LOW (DTR inverted)
    await this.setRTSWebUSB(false); // EN=HIGH, chip out of reset (RTS normal)
    await this.sleep(50);
    await this.setDTRWebUSB(true); // IO0=HIGH, done (DTR inverted)
    await this.sleep(200);
  }

  /**
   * @name hardResetInvertedRTSWebUSB
   * Only RTS inverted for WebUSB (Android)
   */
  async hardResetInvertedRTSWebUSB() {
    await this.setDTRWebUSB(false); // IO0=HIGH (DTR normal)
    await this.setRTSWebUSB(false); // EN=LOW, chip in reset (RTS inverted)
    await this.sleep(100);
    await this.setDTRWebUSB(true); // IO0=LOW (DTR normal)
    await this.setRTSWebUSB(true); // EN=HIGH, chip out of reset (RTS inverted)
    await this.sleep(50);
    await this.setDTRWebUSB(false); // IO0=HIGH, done (DTR normal)
    await this.sleep(200);
  }

  /**
   * Check if we're using WebUSB (Android) or Web Serial (Desktop)
   */
  private isWebUSB(): boolean {
    // WebUSBSerial class has isWebUSB flag - this is the most reliable check
    return (this.port as WebUSBSerialPort).isWebUSB === true;
  }

  /**
   * @name connectWithResetStrategies
   * Try different reset strategies to enter bootloader mode
   * Similar to esptool.py's connect() method with multiple reset strategies
   */
  async connectWithResetStrategies() {
    const portInfo = this.port.getInfo();
    const isUSBJTAGSerial = portInfo.usbProductId === USB_JTAG_SERIAL_PID;
    const isEspressifUSB = portInfo.usbVendorId === 0x303a;

    //    this.logger.log(
    //      `Detected USB: VID=0x${portInfo.usbVendorId?.toString(16) || "unknown"}, PID=0x${portInfo.usbProductId?.toString(16) || "unknown"}`,
    //    );

    // Define reset strategies to try in order
    const resetStrategies: Array<{ name: string; fn: () => Promise<void> }> =
      [];

    const self = this;

    // WebUSB (Android) uses different reset methods than Web Serial (Desktop)
    if (this.isWebUSB()) {
      // For USB-Serial chips (CP2102, CH340, etc.), try inverted strategies first
      const isUSBSerialChip = !isUSBJTAGSerial && !isEspressifUSB;

      // Detect specific chip types once
      const isCP2102 = portInfo.usbVendorId === 0x10c4;
      const isCH34x = portInfo.usbVendorId === 0x1a86;

      // Check for ESP32-S2 Native USB (VID: 0x303a, PID: 0x0002)
      const isESP32S2NativeUSB =
        portInfo.usbVendorId === 0x303a && portInfo.usbProductId === 0x0002;

      // WebUSB Strategy 1: USB-JTAG/Serial reset (for Native USB only)
      if (isUSBJTAGSerial || isEspressifUSB) {
        if (isESP32S2NativeUSB) {
          // ESP32-S2 Native USB: Try multiple strategies
          // The device might be in JTAG mode OR CDC mode

          // Strategy 1: USB-JTAG/Serial (works in CDC mode on Desktop)
          resetStrategies.push({
            name: "USB-JTAG/Serial (WebUSB) - ESP32-S2",
            fn: async function () {
              return await self.hardResetUSBJTAGSerialWebUSB();
            },
          });

          // Strategy 2: USB-JTAG/Serial Inverted DTR (works in JTAG mode)
          resetStrategies.push({
            name: "USB-JTAG/Serial Inverted DTR (WebUSB) - ESP32-S2",
            fn: async function () {
              return await self.hardResetUSBJTAGSerialInvertedDTRWebUSB();
            },
          });

          // Strategy 3: UnixTight (CDC fallback)
          resetStrategies.push({
            name: "UnixTight (WebUSB) - ESP32-S2 CDC",
            fn: async function () {
              return await self.hardResetUnixTightWebUSB();
            },
          });

          // Strategy 4: Classic reset (CDC fallback)
          resetStrategies.push({
            name: "Classic (WebUSB) - ESP32-S2 CDC",
            fn: async function () {
              return await self.hardResetClassicWebUSB();
            },
          });
        } else {
          // Other USB-JTAG chips: Try Inverted DTR first - works best for ESP32-H2 and other JTAG chips
          resetStrategies.push({
            name: "USB-JTAG/Serial Inverted DTR (WebUSB)",
            fn: async function () {
              return await self.hardResetUSBJTAGSerialInvertedDTRWebUSB();
            },
          });
          resetStrategies.push({
            name: "USB-JTAG/Serial (WebUSB)",
            fn: async function () {
              return await self.hardResetUSBJTAGSerialWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted DTR Classic (WebUSB)",
            fn: async function () {
              return await self.hardResetInvertedDTRWebUSB();
            },
          });
        }
      }

      // For USB-Serial chips, try inverted strategies first
      if (isUSBSerialChip) {
        if (isCH34x) {
          // CH340/CH343: UnixTight works best (like CP2102)
          resetStrategies.push({
            name: "UnixTight (WebUSB) - CH34x",
            fn: async function () {
              return await self.hardResetUnixTightWebUSB();
            },
          });
          resetStrategies.push({
            name: "Classic (WebUSB) - CH34x",
            fn: async function () {
              return await self.hardResetClassicWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted Both (WebUSB) - CH34x",
            fn: async function () {
              return await self.hardResetInvertedWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted RTS (WebUSB) - CH34x",
            fn: async function () {
              return await self.hardResetInvertedRTSWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted DTR (WebUSB) - CH34x",
            fn: async function () {
              return await self.hardResetInvertedDTRWebUSB();
            },
          });
        } else if (isCP2102) {
          // CP2102: UnixTight works best (tested and confirmed)
          // Try it first, then fallback to other strategies

          resetStrategies.push({
            name: "UnixTight (WebUSB) - CP2102",
            fn: async function () {
              return await self.hardResetUnixTightWebUSB();
            },
          });

          resetStrategies.push({
            name: "Classic (WebUSB) - CP2102",
            fn: async function () {
              return await self.hardResetClassicWebUSB();
            },
          });

          resetStrategies.push({
            name: "Inverted Both (WebUSB) - CP2102",
            fn: async function () {
              return await self.hardResetInvertedWebUSB();
            },
          });

          resetStrategies.push({
            name: "Inverted RTS (WebUSB) - CP2102",
            fn: async function () {
              return await self.hardResetInvertedRTSWebUSB();
            },
          });

          resetStrategies.push({
            name: "Inverted DTR (WebUSB) - CP2102",
            fn: async function () {
              return await self.hardResetInvertedDTRWebUSB();
            },
          });
        } else {
          // For other USB-Serial chips, try UnixTight first, then multiple strategies
          resetStrategies.push({
            name: "UnixTight (WebUSB)",
            fn: async function () {
              return await self.hardResetUnixTightWebUSB();
            },
          });
          resetStrategies.push({
            name: "Classic (WebUSB)",
            fn: async function () {
              return await self.hardResetClassicWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted Both (WebUSB)",
            fn: async function () {
              return await self.hardResetInvertedWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted RTS (WebUSB)",
            fn: async function () {
              return await self.hardResetInvertedRTSWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted DTR (WebUSB)",
            fn: async function () {
              return await self.hardResetInvertedDTRWebUSB();
            },
          });
        }
      }

      // Add general fallback strategies only for non-CP2102 and non-ESP32-S2 Native USB chips
      if (!isCP2102 && !isESP32S2NativeUSB) {
        // Classic reset (for chips not handled above)
        if (portInfo.usbVendorId !== 0x1a86) {
          resetStrategies.push({
            name: "Classic (WebUSB)",
            fn: async function () {
              return await self.hardResetClassicWebUSB();
            },
          });
        }

        // UnixTight reset (sets DTR/RTS simultaneously)
        resetStrategies.push({
          name: "UnixTight (WebUSB)",
          fn: async function () {
            return await self.hardResetUnixTightWebUSB();
          },
        });

        // WebUSB Strategy: Classic with long delays
        resetStrategies.push({
          name: "Classic Long Delay (WebUSB)",
          fn: async function () {
            return await self.hardResetClassicLongDelayWebUSB();
          },
        });

        // WebUSB Strategy: Classic with short delays
        resetStrategies.push({
          name: "Classic Short Delay (WebUSB)",
          fn: async function () {
            return await self.hardResetClassicShortDelayWebUSB();
          },
        });

        // WebUSB Strategy: USB-JTAG/Serial fallback
        if (!isUSBJTAGSerial && !isEspressifUSB) {
          resetStrategies.push({
            name: "USB-JTAG/Serial fallback (WebUSB)",
            fn: async function () {
              return await self.hardResetUSBJTAGSerialWebUSB();
            },
          });
        }
      }
    } else {
      // Web Serial (Desktop) strategies
      // Strategy: USB-JTAG/Serial reset
      if (isUSBJTAGSerial || isEspressifUSB) {
        resetStrategies.push({
          name: "USB-JTAG/Serial",
          fn: async function () {
            return await self.hardResetUSBJTAGSerial();
          },
        });
      }

      // Strategy: Classic reset
      resetStrategies.push({
        name: "Classic",
        fn: async function () {
          return await self.hardResetClassic();
        },
      });

      // Strategy: USB-JTAG/Serial fallback
      if (!isUSBJTAGSerial && !isEspressifUSB) {
        resetStrategies.push({
          name: "USB-JTAG/Serial (fallback)",
          fn: async function () {
            return await self.hardResetUSBJTAGSerial();
          },
        });
      }
    }

    let lastError: Error | null = null;

    // Try each reset strategy with timeout
    for (const strategy of resetStrategies) {
      try {
        // Check if port is still open, if not, skip this strategy
        if (!this.connected || !this.port.writable) {
          this.logger.log(`Port disconnected, skipping ${strategy.name} reset`);
          continue;
        }

        // Clear abandon flag before starting new strategy
        this._abandonCurrentOperation = false;

        await strategy.fn();

        // Try to sync after reset with internally time-bounded sync (3 seconds per strategy)
        const syncSuccess = await this.syncWithTimeout(3000);

        if (syncSuccess) {
          // Sync succeeded
          this.logger.log(
            `Connected successfully with ${strategy.name} reset.`,
          );
          return;
        } else {
          throw new Error("Sync timeout or abandoned");
        }
      } catch (error) {
        lastError = error as Error;
        this.logger.log(
          `${strategy.name} reset failed: ${(error as Error).message}`,
        );

        // Set abandon flag to stop any in-flight operations
        this._abandonCurrentOperation = true;

        // Wait a bit for in-flight operations to abort
        await sleep(100);

        // If port got disconnected, we can't try more strategies
        if (!this.connected || !this.port.writable) {
          this.logger.log(`Port disconnected during reset attempt`);
          break;
        }

        // Clear buffers before trying next strategy
        this._clearInputBuffer();
        await this.drainInputBuffer(200);
        await this.flushSerialBuffers();
      }
    }

    // All strategies failed
    throw new Error(
      `Couldn't sync to ESP. Try resetting manually. Last error: ${lastError?.message}`,
    );
  }

  async hardReset(bootloader = false) {
    if (bootloader) {
      // enter flash mode
      if (this.port.getInfo().usbProductId === USB_JTAG_SERIAL_PID) {
        await this.hardResetUSBJTAGSerial();
        this.logger.log("USB-JTAG/Serial reset.");
      } else {
        // Use different reset strategy for WebUSB (Android) vs Web Serial (Desktop)
        if (this.isWebUSB()) {
          await this.hardResetClassicWebUSB();
          this.logger.log("Classic reset (WebUSB/Android).");
        } else {
          await this.hardResetClassic();
          this.logger.log("Classic reset.");
        }
      }
    } else {
      // just reset (no bootloader mode)
      if (this.isWebUSB()) {
        // WebUSB: Use longer delays for better compatibility
        await this.setRTS(true); // EN->LOW
        await this.sleep(200);
        await this.setRTS(false);
        await this.sleep(200);
        this.logger.log("Hard reset (WebUSB).");
      } else {
        // Web Serial: Standard reset
        await this.setRTS(true); // EN->LOW
        await this.sleep(100);
        await this.setRTS(false);
        this.logger.log("Hard reset.");
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  /**
   * @name macAddr
   * The MAC address burned into the OTP memory of the ESP chip
   */
  macAddr() {
    const macAddr = new Array(6).fill(0);
    const mac0 = this._efuses[0];
    const mac1 = this._efuses[1];
    const mac2 = this._efuses[2];
    const mac3 = this._efuses[3];
    let oui;
    if (this.chipFamily == CHIP_FAMILY_ESP8266) {
      if (mac3 != 0) {
        oui = [(mac3 >> 16) & 0xff, (mac3 >> 8) & 0xff, mac3 & 0xff];
      } else if (((mac1 >> 16) & 0xff) == 0) {
        oui = [0x18, 0xfe, 0x34];
      } else if (((mac1 >> 16) & 0xff) == 1) {
        oui = [0xac, 0xd0, 0x74];
      } else {
        throw new Error("Couldnt determine OUI");
      }

      macAddr[0] = oui[0];
      macAddr[1] = oui[1];
      macAddr[2] = oui[2];
      macAddr[3] = (mac1 >> 8) & 0xff;
      macAddr[4] = mac1 & 0xff;
      macAddr[5] = (mac0 >> 24) & 0xff;
    } else if (this.chipFamily == CHIP_FAMILY_ESP32) {
      macAddr[0] = (mac2 >> 8) & 0xff;
      macAddr[1] = mac2 & 0xff;
      macAddr[2] = (mac1 >> 24) & 0xff;
      macAddr[3] = (mac1 >> 16) & 0xff;
      macAddr[4] = (mac1 >> 8) & 0xff;
      macAddr[5] = mac1 & 0xff;
    } else if (
      this.chipFamily == CHIP_FAMILY_ESP32S2 ||
      this.chipFamily == CHIP_FAMILY_ESP32S3 ||
      this.chipFamily == CHIP_FAMILY_ESP32C2 ||
      this.chipFamily == CHIP_FAMILY_ESP32C3 ||
      this.chipFamily == CHIP_FAMILY_ESP32C5 ||
      this.chipFamily == CHIP_FAMILY_ESP32C6 ||
      this.chipFamily == CHIP_FAMILY_ESP32C61 ||
      this.chipFamily == CHIP_FAMILY_ESP32H2 ||
      this.chipFamily == CHIP_FAMILY_ESP32H4 ||
      this.chipFamily == CHIP_FAMILY_ESP32H21 ||
      this.chipFamily == CHIP_FAMILY_ESP32P4 ||
      this.chipFamily == CHIP_FAMILY_ESP32S31
    ) {
      macAddr[0] = (mac1 >> 8) & 0xff;
      macAddr[1] = mac1 & 0xff;
      macAddr[2] = (mac0 >> 24) & 0xff;
      macAddr[3] = (mac0 >> 16) & 0xff;
      macAddr[4] = (mac0 >> 8) & 0xff;
      macAddr[5] = mac0 & 0xff;
    } else {
      throw new Error("Unknown chip family");
    }
    return macAddr;
  }

  async readRegister(reg: number) {
    if (this.debug) {
      this.logger.debug("Reading from Register " + toHex(reg, 8));
    }
    const packet = pack("<I", reg);
    await this.sendCommand(ESP_READ_REG, packet);
    const [val] = await this.getResponse(ESP_READ_REG);
    return val;
  }

  /**
   * @name checkCommand
   * Send a command packet, check that the command succeeded and
   * return a tuple with the value and data.
   * See the ESP Serial Protocol for more details on what value/data are
   *
   * Commands are serialized to prevent concurrent execution which can cause
   * WritableStream lock contention on CP210x adapters under Windows
   */
  async checkCommand(
    opcode: number,
    buffer: number[],
    checksum = 0,
    timeout = DEFAULT_TIMEOUT,
  ): Promise<[number, number[]]> {
    // Serialize command execution to prevent lock contention
    const executeCommand = async (): Promise<[number, number[]]> => {
      timeout = Math.min(timeout, MAX_TIMEOUT);
      await this.sendCommand(opcode, buffer, checksum);
      const [value, responseData] = await this.getResponse(opcode, timeout);

      if (responseData === null) {
        throw new Error("Didn't get enough status bytes");
      }

      let data = responseData;
      let statusLen = 0;

      if (this.IS_STUB || this.chipFamily == CHIP_FAMILY_ESP8266) {
        statusLen = 2;
      } else if (
        [
          CHIP_FAMILY_ESP32,
          CHIP_FAMILY_ESP32S2,
          CHIP_FAMILY_ESP32S3,
          CHIP_FAMILY_ESP32C2,
          CHIP_FAMILY_ESP32C3,
          CHIP_FAMILY_ESP32C5,
          CHIP_FAMILY_ESP32C6,
          CHIP_FAMILY_ESP32C61,
          CHIP_FAMILY_ESP32H2,
          CHIP_FAMILY_ESP32H4,
          CHIP_FAMILY_ESP32H21,
          CHIP_FAMILY_ESP32P4,
          CHIP_FAMILY_ESP32S31,
        ].includes(this.chipFamily)
      ) {
        statusLen = 4;
      } else {
        // When chipFamily is not yet set (e.g., during GET_SECURITY_INFO in detectChip),
        // assume modern chips use 4-byte status
        if (opcode === ESP_GET_SECURITY_INFO) {
          statusLen = 4;
        } else if ([2, 4].includes(data.length)) {
          statusLen = data.length;
        } else {
          // Default to 2-byte status if we can't determine
          // This prevents silent data corruption when statusLen would be 0
          statusLen = 2;
          this.logger.debug(
            `Unknown chip family, defaulting to 2-byte status (opcode: ${toHex(opcode)}, data.length: ${data.length})`,
          );
        }
      }

      if (data.length < statusLen) {
        throw new Error("Didn't get enough status bytes");
      }
      const status = data.slice(-statusLen, data.length);
      data = data.slice(0, -statusLen);
      if (this.debug) {
        this.logger.debug("status", status);
        this.logger.debug("value", value);
        this.logger.debug("data", data);
      }
      if (status[0] == 1) {
        if (status[1] == ROM_INVALID_RECV_MSG) {
          // Unsupported command can result in more than one error response
          // Use drainInputBuffer for CP210x compatibility on Windows
          await this.drainInputBuffer(200);
          throw new Error("Invalid (unsupported) command " + toHex(opcode));
        } else {
          throw new Error("Command failure error code " + toHex(status[1]));
        }
      }

      return [value, data];
    };

    // Chain command execution through the lock
    // Use both .then() handlers to ensure lock continues even on error
    this._commandLock = this._commandLock.then(executeCommand, executeCommand);
    return this._commandLock;
  }

  /**
   * @name sendCommand
   * Send a slip-encoded, checksummed command over the UART,
   * does not check response
   */
  async sendCommand(opcode: number, buffer: number[], checksum = 0) {
    const packet = slipEncode([
      ...pack("<BBHI", 0x00, opcode, buffer.length, checksum),
      ...buffer,
    ]);

    if (this.debug) {
      this.logger.debug(
        `Writing ${packet.length} byte${packet.length == 1 ? "" : "s"}:`,
        packet,
      );
    }
    await this.writeToStream(packet);
  }

  /**
   * @name readPacket
   * Generator to read SLIP packets from a serial port.
   * Yields one full SLIP packet at a time, raises exception on timeout or invalid data.
   *
   * Two implementations:
   * - Burst: CDC devices (Native USB) and CH343 - very fast processing
   * - Byte-by-byte: CH340, CP2102, and other USB-Serial adapters - stable fast processing
   */
  async readPacket(timeout: number): Promise<number[]> {
    let partialPacket: number[] | null = null;
    let inEscape = false;

    // CDC devices use burst processing, non-CDC use byte-by-byte
    if (this._isCDCDevice) {
      // Burst version: Process all available bytes in one pass for ultra-high-speed transfers
      // Used for: CDC devices (all platforms) and CH343
      const startTime = Date.now();

      while (true) {
        // Check abandon flag (for reset strategy timeout)
        if (this._abandonCurrentOperation) {
          throw new SlipReadError(
            "Operation abandoned (reset strategy timeout)",
          );
        }

        // Check timeout
        if (Date.now() - startTime > timeout) {
          const waitingFor = partialPacket === null ? "header" : "content";
          throw new SlipReadError("Timed out waiting for packet " + waitingFor);
        }

        // If no data available, wait a bit
        if (this._inputBufferAvailable === 0) {
          await sleep(1);
          continue;
        }

        // Process all available bytes without going back to outer loop
        // This is critical for handling high-speed burst transfers
        while (this._inputBufferAvailable > 0) {
          const b = this._readByte()!;

          if (partialPacket === null) {
            // waiting for packet header
            if (b == 0xc0) {
              partialPacket = [];
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(b));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid head of packet (" + toHex(b) + ")",
              );
            }
          } else if (inEscape) {
            // part-way through escape sequence
            inEscape = false;
            if (b == 0xdc) {
              partialPacket.push(0xc0);
            } else if (b == 0xdd) {
              partialPacket.push(0xdb);
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(b));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid SLIP escape (0xdb, " + toHex(b) + ")",
              );
            }
          } else if (b == 0xdb) {
            // start of escape sequence
            inEscape = true;
          } else if (b == 0xc0) {
            // end of packet
            if (this.debug)
              this.logger.debug(
                "Received full packet: " + hexFormatter(partialPacket),
              );
            // Compact buffer periodically to prevent memory growth
            this._compactInputBuffer();
            return partialPacket;
          } else {
            // normal byte in packet
            partialPacket.push(b);
          }
        }
      }
    } else {
      // Byte-by-byte version: Stable for non CDC USB-Serial adapters (CH340, CP2102, etc.)
      let readBytes: number[] = [];
      while (true) {
        // Check abandon flag (for reset strategy timeout)
        if (this._abandonCurrentOperation) {
          throw new SlipReadError(
            "Operation abandoned (reset strategy timeout)",
          );
        }

        const stamp = Date.now();
        readBytes = [];
        while (Date.now() - stamp < timeout) {
          if (this._inputBufferAvailable > 0) {
            readBytes.push(this._readByte()!);
            break;
          } else {
            // Reduced sleep time for faster response during high-speed transfers
            await sleep(1);
          }
        }
        if (readBytes.length == 0) {
          const waitingFor = partialPacket === null ? "header" : "content";
          throw new SlipReadError("Timed out waiting for packet " + waitingFor);
        }
        if (this.debug)
          this.logger.debug(
            "Read " + readBytes.length + " bytes: " + hexFormatter(readBytes),
          );
        for (const b of readBytes) {
          if (partialPacket === null) {
            // waiting for packet header
            if (b == 0xc0) {
              partialPacket = [];
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(b));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid head of packet (" + toHex(b) + ")",
              );
            }
          } else if (inEscape) {
            // part-way through escape sequence
            inEscape = false;
            if (b == 0xdc) {
              partialPacket.push(0xc0);
            } else if (b == 0xdd) {
              partialPacket.push(0xdb);
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(b));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid SLIP escape (0xdb, " + toHex(b) + ")",
              );
            }
          } else if (b == 0xdb) {
            // start of escape sequence
            inEscape = true;
          } else if (b == 0xc0) {
            // end of packet
            if (this.debug)
              this.logger.debug(
                "Received full packet: " + hexFormatter(partialPacket),
              );
            // Compact buffer periodically to prevent memory growth
            this._compactInputBuffer();
            return partialPacket;
          } else {
            // normal byte in packet
            partialPacket.push(b);
          }
        }
      }
    }
  }

  /**
   * @name getResponse
   * Read response data and decodes the slip packet, then parses
   * out the value/data and returns as a tuple of (value, data) where
   * each is a list of bytes
   */
  async getResponse(
    opcode: number,
    timeout = DEFAULT_TIMEOUT,
  ): Promise<[number, number[]]> {
    for (let i = 0; i < 100; i++) {
      const packet = await this.readPacket(timeout);

      if (packet.length < 8) {
        continue;
      }

      const [resp, opRet, , val] = unpack("<BBHI", packet.slice(0, 8));

      if (resp != 1) {
        continue;
      }
      const data = packet.slice(8);
      if (opcode == null || opRet == opcode) {
        return [val, data];
      }
      if (data[0] != 0 && data[1] == ROM_INVALID_RECV_MSG) {
        // Unsupported command can result in more than one error response
        // Use drainInputBuffer for CP210x compatibility on Windows
        await this.drainInputBuffer(200);
        throw new Error(`Invalid (unsupported) command ${toHex(opcode)}`);
      }
    }
    throw new Error("Response doesn't match request");
  }

  /**
   * @name checksum
   * Calculate checksum of a blob, as it is defined by the ROM
   */
  checksum(data: number[], state = ESP_CHECKSUM_MAGIC) {
    for (const b of data) {
      state ^= b;
    }
    return state;
  }

  async setBaudrate(baud: number) {
    if (this.chipFamily == CHIP_FAMILY_ESP8266) {
      throw new Error("Changing baud rate is not supported on the ESP8266");
    }

    try {
      // Send ESP_ROM_BAUD(115200) as the old one if running STUB otherwise 0
      const buffer = pack("<II", baud, this.IS_STUB ? ESP_ROM_BAUD : 0);
      await this.checkCommand(ESP_CHANGE_BAUDRATE, buffer);
    } catch (e) {
      this.logger.error(`Baudrate change error: ${e}`);
      throw new Error(
        `Unable to change the baud rate to ${baud}: No response from set baud rate command.`,
      );
    }

    if (this._parent) {
      await this._parent.reconfigurePort(baud);
    } else {
      await this.reconfigurePort(baud);
    }

    // Wait for port to be ready after baudrate change
    await sleep(SYNC_TIMEOUT);

    // Track current baudrate for reconnect
    if (this._parent) {
      this._parent._currentBaudRate = baud;
    } else {
      this._currentBaudRate = baud;
    }

    // Warn if baudrate exceeds USB-Serial chip capability
    const maxBaud = this._parent
      ? this._parent._maxUSBSerialBaudrate
      : this._maxUSBSerialBaudrate;
    if (maxBaud && baud > maxBaud) {
      this.logger.log(
        `⚠️  WARNING: Baudrate ${baud} exceeds USB-Serial chip limit (${maxBaud})!`,
      );
      this.logger.log(
        `⚠️  This may cause data corruption or connection failures!`,
      );
    }

    this.logger.log(`Changed baud rate to ${baud}`);
  }

  async reconfigurePort(baud: number) {
    // Block new writes during the entire reconfiguration (all paths)
    this._isReconfiguring = true;

    try {
      // Wait for pending writes to complete
      try {
        await this._writeChain;
      } catch (err) {
        this.logger.debug(`Pending write error during reconfigure: ${err}`);
      }

      // WebUSB: Check if we should use setBaudRate() or close/reopen
      if (this.isWebUSB()) {
        const portInfo = this.port.getInfo();
        const isCH343 =
          portInfo.usbVendorId === 0x1a86 && portInfo.usbProductId === 0x55d3;

        // CH343 is a CDC device and MUST use close/reopen
        // Other chips (CH340, CP2102, FTDI) MUST use setBaudRate()
        if (
          !isCH343 &&
          typeof (this.port as WebUSBSerialPort).setBaudRate === "function"
        ) {
          //          this.logger.log(
          //            `[WebUSB] Changing baudrate to ${baud} using setBaudRate()...`,
          //          );
          await (this.port as WebUSBSerialPort).setBaudRate(baud);
          //          this.logger.log(`[WebUSB] Baudrate changed to ${baud}`);

          // Give the chip time to adjust to new baudrate
          await sleep(100);
          return;
        } else if (isCH343) {
          //          this.logger.log(
          //            `[WebUSB] CH343 detected - using close/reopen for baudrate change`,
          //          );
        }
      }

      // Web Serial or CH343: Close and reopen port
      // Release persistent writer before closing
      if (this._writer) {
        try {
          this._writer.releaseLock();
        } catch (err) {
          this.logger.debug(`Writer release error during reconfigure: ${err}`);
        }
        this._writer = undefined;
      }

      // SerialPort does not allow to be reconfigured while open so we close and re-open
      // reader.cancel() causes the Promise returned by the read() operation running on
      // the readLoop to return immediately with { value: undefined, done: true } and thus
      // breaking the loop and exiting readLoop();
      await this._reader?.cancel();
      await this.port.close();

      // Reopen Port
      await this.port.open({ baudRate: baud });

      // Clear buffer again
      await this.flushSerialBuffers();

      // Restart Readloop
      this.readLoop();
    } catch (e) {
      this.logger.error(`Reconfigure port error: ${e}`);
      throw new Error(`Unable to change the baud rate to ${baud}: ${e}`);
    } finally {
      // Always reset flag, even on error or early return
      this._isReconfiguring = false;
    }
  }

  /**
   * @name syncWithTimeout
   * Sync with timeout that can be abandoned (for reset strategy loop)
   * This is internally time-bounded and checks the abandon flag
   */
  async syncWithTimeout(timeoutMs: number): Promise<boolean> {
    const startTime = Date.now();

    for (let i = 0; i < 5; i++) {
      // Check if we've exceeded the timeout
      if (Date.now() - startTime > timeoutMs) {
        return false;
      }

      // Check abandon flag
      if (this._abandonCurrentOperation) {
        return false;
      }

      this._clearInputBuffer();

      try {
        const response = await this._sync();
        if (response) {
          await sleep(SYNC_TIMEOUT);
          return true;
        }
      } catch (e) {
        // Check abandon flag after error
        if (this._abandonCurrentOperation) {
          return false;
        }
      }

      await sleep(SYNC_TIMEOUT);
    }

    return false;
  }

  /**
   * @name sync
   * Put into ROM bootload mode & attempt to synchronize with the
   * ESP ROM bootloader, we will retry a few times
   */
  async sync() {
    for (let i = 0; i < 5; i++) {
      this._clearInputBuffer();
      const response = await this._sync();
      if (response) {
        await sleep(SYNC_TIMEOUT);
        return true;
      }
      await sleep(SYNC_TIMEOUT);
    }

    throw new Error("Couldn't sync to ESP. Try resetting.");
  }

  /**
   * @name _sync
   * Perform a soft-sync using AT sync packets, does not perform
   * any hardware resetting
   */
  async _sync() {
    await this.sendCommand(ESP_SYNC, SYNC_PACKET);

    for (let i = 0; i < 8; i++) {
      try {
        const [, data] = await this.getResponse(ESP_SYNC, SYNC_TIMEOUT);
        if (data.length > 1 && data[0] == 0 && data[1] == 0) {
          return true;
        }
      } catch (e) {
        if (this.debug) {
          this.logger.debug(`Sync attempt ${i + 1} failed: ${e}`);
        }
      }
    }
    return false;
  }

  /**
   * @name getFlashWriteSize
   * Get the Flash write size based on the chip
   */
  getFlashWriteSize() {
    if (this.IS_STUB) {
      return STUB_FLASH_WRITE_SIZE;
    }
    return FLASH_WRITE_SIZE;
  }

  /**
   * @name flashData
   * Program a full, uncompressed binary file into SPI Flash at
   *   a given offset. If an ESP32 and md5 string is passed in, will also
   *   verify memory. ESP8266 does not have checksum memory verification in
   *   ROM
   */
  async flashData(
    binaryData: ArrayBuffer,
    updateProgress: (bytesWritten: number, totalBytes: number) => void,
    offset = 0,
    compress = false,
  ) {
    if (binaryData.byteLength >= 8) {
      // unpack the (potential) image header
      const header = Array.from(new Uint8Array(binaryData, 0, 4));
      const headerMagic = header[0];
      const headerFlashMode = header[2];
      const headerFlashSizeFreq = header[3];

      this.logger.log(
        `Image header, Magic=${toHex(headerMagic)}, FlashMode=${toHex(
          headerFlashMode,
        )}, FlashSizeFreq=${toHex(headerFlashSizeFreq)}`,
      );
    }

    const uncompressedFilesize = binaryData.byteLength;
    let compressedFilesize = 0;

    let dataToFlash;
    let timeout = DEFAULT_TIMEOUT;

    if (compress) {
      dataToFlash = deflate(new Uint8Array(binaryData), {
        level: 9,
      }).buffer;
      compressedFilesize = dataToFlash.byteLength;
      this.logger.log(
        `Writing data with filesize: ${uncompressedFilesize}. Compressed Size: ${compressedFilesize}`,
      );
      timeout = await this.flashDeflBegin(
        uncompressedFilesize,
        compressedFilesize,
        offset,
      );
    } else {
      this.logger.log(`Writing data with filesize: ${uncompressedFilesize}`);
      dataToFlash = binaryData;
      await this.flashBegin(uncompressedFilesize, offset);
    }

    let block = [];
    let seq = 0;
    let written = 0;
    let position = 0;
    const stamp = Date.now();
    const flashWriteSize = this.getFlashWriteSize();

    const filesize = compress ? compressedFilesize : uncompressedFilesize;

    while (filesize - position > 0) {
      if (this.debug) {
        this.logger.log(
          `Writing at ${toHex(offset + seq * flashWriteSize, 8)} `,
        );
      }
      if (filesize - position >= flashWriteSize) {
        block = Array.from(
          new Uint8Array(dataToFlash, position, flashWriteSize),
        );
      } else {
        // Pad the last block only if we are sending uncompressed data.
        block = Array.from(
          new Uint8Array(dataToFlash, position, filesize - position),
        );
        if (!compress) {
          block = block.concat(
            new Array(flashWriteSize - block.length).fill(0xff),
          );
        }
      }
      if (compress) {
        await this.flashDeflBlock(block, seq, timeout);
      } else {
        await this.flashBlock(block, seq);
      }
      seq += 1;
      // If using compression we update the progress with the proportional size of the block taking into account the compression ratio.
      // This way we report progress on the uncompressed size
      written += compress
        ? Math.round((block.length * uncompressedFilesize) / compressedFilesize)
        : block.length;
      position += flashWriteSize;
      updateProgress(
        Math.min(written, uncompressedFilesize),
        uncompressedFilesize,
      );
    }
    this.logger.log(
      "Took " + (Date.now() - stamp) + "ms to write " + filesize + " bytes",
    );

    // Only send flashF finish if running the stub because ir causes the ROM to exit and run user code
    if (this.IS_STUB) {
      await this.flashBegin(0, 0);
      if (compress) {
        await this.flashDeflFinish();
      } else {
        await this.flashFinish();
      }
    }
  }

  /**
   * @name flashBlock
   * Send one block of data to program into SPI Flash memory
   */
  async flashBlock(data: number[], seq: number, timeout = DEFAULT_TIMEOUT) {
    await this.checkCommand(
      ESP_FLASH_DATA,
      pack("<IIII", data.length, seq, 0, 0).concat(data),
      this.checksum(data),
      timeout,
    );
  }
  async flashDeflBlock(data: number[], seq: number, timeout = DEFAULT_TIMEOUT) {
    await this.checkCommand(
      ESP_FLASH_DEFL_DATA,
      pack("<IIII", data.length, seq, 0, 0).concat(data),
      this.checksum(data),
      timeout,
    );
  }

  /**
   * @name flashBegin
   * Prepare for flashing by attaching SPI chip and erasing the
   *   number of blocks requred.
   */
  async flashBegin(size = 0, offset = 0, encrypted = false) {
    // Flush serial buffers before flash write operation
    await this.flushSerialBuffers();

    let eraseSize;
    const flashWriteSize = this.getFlashWriteSize();
    if (
      !this.IS_STUB &&
      [
        CHIP_FAMILY_ESP32,
        CHIP_FAMILY_ESP32S2,
        CHIP_FAMILY_ESP32S3,
        CHIP_FAMILY_ESP32C2,
        CHIP_FAMILY_ESP32C3,
        CHIP_FAMILY_ESP32C5,
        CHIP_FAMILY_ESP32C6,
        CHIP_FAMILY_ESP32C61,
        CHIP_FAMILY_ESP32H2,
        CHIP_FAMILY_ESP32H4,
        CHIP_FAMILY_ESP32H21,
        CHIP_FAMILY_ESP32P4,
        CHIP_FAMILY_ESP32S31,
      ].includes(this.chipFamily)
    ) {
      await this.checkCommand(ESP_SPI_ATTACH, new Array(8).fill(0));
    }
    const numBlocks = Math.floor((size + flashWriteSize - 1) / flashWriteSize);
    if (this.chipFamily == CHIP_FAMILY_ESP8266) {
      eraseSize = this.getEraseSize(offset, size);
    } else {
      eraseSize = size;
    }

    const timeout = this.IS_STUB
      ? DEFAULT_TIMEOUT
      : timeoutPerMb(ERASE_REGION_TIMEOUT_PER_MB, size);

    const stamp = Date.now();
    let buffer = pack("<IIII", eraseSize, numBlocks, flashWriteSize, offset);
    if (
      this.chipFamily == CHIP_FAMILY_ESP32 ||
      this.chipFamily == CHIP_FAMILY_ESP32S2 ||
      this.chipFamily == CHIP_FAMILY_ESP32S3 ||
      this.chipFamily == CHIP_FAMILY_ESP32C2 ||
      this.chipFamily == CHIP_FAMILY_ESP32C3 ||
      this.chipFamily == CHIP_FAMILY_ESP32C5 ||
      this.chipFamily == CHIP_FAMILY_ESP32C6 ||
      this.chipFamily == CHIP_FAMILY_ESP32C61 ||
      this.chipFamily == CHIP_FAMILY_ESP32H2 ||
      this.chipFamily == CHIP_FAMILY_ESP32H4 ||
      this.chipFamily == CHIP_FAMILY_ESP32H21 ||
      this.chipFamily == CHIP_FAMILY_ESP32P4 ||
      this.chipFamily == CHIP_FAMILY_ESP32S31
    ) {
      buffer = buffer.concat(pack("<I", encrypted ? 1 : 0));
    }
    this.logger.log(
      "Erase size " +
        eraseSize +
        ", blocks " +
        numBlocks +
        ", block size " +
        toHex(flashWriteSize, 4) +
        ", offset " +
        toHex(offset, 4) +
        ", encrypted " +
        (encrypted ? "yes" : "no"),
    );
    await this.checkCommand(ESP_FLASH_BEGIN, buffer, 0, timeout);
    if (size != 0 && !this.IS_STUB) {
      this.logger.log(
        "Took " + (Date.now() - stamp) + "ms to erase " + numBlocks + " bytes",
      );
    }
    return numBlocks;
  }

  /**
   * @name flashDeflBegin
   *
   */

  async flashDeflBegin(size = 0, compressedSize = 0, offset = 0) {
    // Start downloading compressed data to Flash (performs an erase)
    // Returns number of blocks to write.
    const flashWriteSize = this.getFlashWriteSize();
    const numBlocks = Math.floor(
      (compressedSize + flashWriteSize - 1) / flashWriteSize,
    );
    const eraseBlocks = Math.floor(
      (size + flashWriteSize - 1) / flashWriteSize,
    );
    let writeSize = 0;
    let timeout = 0;

    if (this.IS_STUB) {
      writeSize = size; // stub expects number of bytes here, manages erasing internally
      timeout = timeoutPerMb(ERASE_REGION_TIMEOUT_PER_MB, writeSize); // ROM performs the erase up front
    } else {
      writeSize = eraseBlocks * flashWriteSize; // ROM expects rounded up to erase block size
      timeout = DEFAULT_TIMEOUT;
    }
    const buffer = pack("<IIII", writeSize, numBlocks, flashWriteSize, offset);

    await this.checkCommand(ESP_FLASH_DEFL_BEGIN, buffer, 0, timeout);

    return timeout;
  }

  async flashFinish() {
    const buffer = pack("<I", 1);
    await this.checkCommand(ESP_FLASH_END, buffer);
  }

  async flashDeflFinish() {
    const buffer = pack("<I", 1);
    await this.checkCommand(ESP_FLASH_DEFL_END, buffer);
  }

  getBootloaderOffset() {
    const bootFlashOffs = getSpiFlashAddresses(this.getChipFamily());
    const BootldrFlashOffs = bootFlashOffs.flashOffs;
    return BootldrFlashOffs;
  }

  async flashId() {
    const SPIFLASH_RDID = 0x9f;
    const result = await this.runSpiFlashCommand(SPIFLASH_RDID, [], 24);
    return result;
  }

  getChipFamily() {
    return this._parent ? this._parent.chipFamily : this.chipFamily;
  }

  async writeRegister(
    address: number,
    value: number,
    mask = 0xffffffff,
    delayUs = 0,
    delayAfterUs = 0,
  ) {
    let buffer = pack("<IIII", address, value, mask, delayUs);
    if (delayAfterUs > 0) {
      // add a dummy write to a date register as an excuse to have a delay
      buffer = buffer.concat(
        pack(
          "<IIII",
          getSpiFlashAddresses(this.getChipFamily()).uartDateReg,
          0,
          0,
          delayAfterUs,
        ),
      );
    }
    await this.checkCommand(ESP_WRITE_REG, buffer);
  }

  async setDataLengths(
    spiAddresses: SpiFlashAddresses,
    mosiBits: number,
    misoBits: number,
  ) {
    if (spiAddresses.mosiDlenOffs != -1) {
      // Actual MCUs have a more sophisticated way to set up "user" commands
      const SPI_MOSI_DLEN_REG =
        spiAddresses.regBase + spiAddresses.mosiDlenOffs;
      const SPI_MISO_DLEN_REG =
        spiAddresses.regBase + spiAddresses.misoDlenOffs;
      if (mosiBits > 0) {
        await this.writeRegister(SPI_MOSI_DLEN_REG, mosiBits - 1);
      }
      if (misoBits > 0) {
        await this.writeRegister(SPI_MISO_DLEN_REG, misoBits - 1);
      }
    } else {
      const SPI_DATA_LEN_REG = spiAddresses.regBase + spiAddresses.usr1Offs;
      const SPI_MOSI_BITLEN_S = 17;
      const SPI_MISO_BITLEN_S = 8;
      const mosiMask = mosiBits == 0 ? 0 : mosiBits - 1;
      const misoMask = misoBits == 0 ? 0 : misoBits - 1;
      const value =
        (misoMask << SPI_MISO_BITLEN_S) | (mosiMask << SPI_MOSI_BITLEN_S);
      await this.writeRegister(SPI_DATA_LEN_REG, value);
    }
  }
  async waitDone(spiCmdReg: number, spiCmdUsr: number) {
    for (let i = 0; i < 10; i++) {
      const cmdValue = await this.readRegister(spiCmdReg);
      if ((cmdValue & spiCmdUsr) == 0) {
        return;
      }
    }
    throw Error("SPI command did not complete in time");
  }

  async runSpiFlashCommand(
    spiflashCommand: number,
    data: number[],
    readBits = 0,
  ) {
    // Run an arbitrary SPI flash command.

    // This function uses the "USR_COMMAND" functionality in the ESP
    // SPI hardware, rather than the precanned commands supported by
    // hardware. So the value of spiflash_command is an actual command
    // byte, sent over the wire.

    // After writing command byte, writes 'data' to MOSI and then
    // reads back 'read_bits' of reply on MISO. Result is a number.

    // SPI_USR register flags
    const SPI_USR_COMMAND = 1 << 31;
    const SPI_USR_MISO = 1 << 28;
    const SPI_USR_MOSI = 1 << 27;

    // SPI registers, base address differs
    const spiAddresses = getSpiFlashAddresses(this.getChipFamily());
    const base = spiAddresses.regBase;
    const SPI_CMD_REG = base;
    const SPI_USR_REG = base + spiAddresses.usrOffs;
    const SPI_USR2_REG = base + spiAddresses.usr2Offs;
    const SPI_W0_REG = base + spiAddresses.w0Offs;

    // SPI peripheral "command" bitmasks for SPI_CMD_REG
    const SPI_CMD_USR = 1 << 18;

    // shift values
    const SPI_USR2_COMMAND_LEN_SHIFT = 28;

    if (readBits > 32) {
      throw new Error(
        "Reading more than 32 bits back from a SPI flash operation is unsupported",
      );
    }
    if (data.length > 64) {
      throw new Error(
        "Writing more than 64 bytes of data with one SPI command is unsupported",
      );
    }

    const dataBits = data.length * 8;
    const oldSpiUsr = await this.readRegister(SPI_USR_REG);
    const oldSpiUsr2 = await this.readRegister(SPI_USR2_REG);

    let flags = SPI_USR_COMMAND;

    if (readBits > 0) {
      flags |= SPI_USR_MISO;
    }
    if (dataBits > 0) {
      flags |= SPI_USR_MOSI;
    }

    await this.setDataLengths(spiAddresses, dataBits, readBits);

    await this.writeRegister(SPI_USR_REG, flags);
    await this.writeRegister(
      SPI_USR2_REG,
      (7 << SPI_USR2_COMMAND_LEN_SHIFT) | spiflashCommand,
    );
    if (dataBits == 0) {
      await this.writeRegister(SPI_W0_REG, 0); // clear data register before we read it
    } else {
      const padLen = (4 - (data.length % 4)) % 4;
      data = data.concat(new Array(padLen).fill(0x00)); // pad to 32-bit multiple

      const words = unpack("I".repeat(Math.floor(data.length / 4)), data);
      let nextReg = SPI_W0_REG;

      this.logger.debug(`Words Length: ${words.length}`);

      for (const word of words) {
        this.logger.debug(
          `Writing word ${toHex(word)} to register offset ${toHex(nextReg)}`,
        );
        await this.writeRegister(nextReg, word);
        nextReg += 4;
      }
    }
    await this.writeRegister(SPI_CMD_REG, SPI_CMD_USR);
    await this.waitDone(SPI_CMD_REG, SPI_CMD_USR);

    const status = await this.readRegister(SPI_W0_REG);
    // restore some SPI controller registers
    await this.writeRegister(SPI_USR_REG, oldSpiUsr);
    await this.writeRegister(SPI_USR2_REG, oldSpiUsr2);
    return status;
  }
  async detectFlashSize() {
    this.logger.log("Detecting Flash Size");

    const flashId = await this.flashId();
    const manufacturer = flashId & 0xff;
    const flashIdLowbyte = (flashId >> 16) & 0xff;

    this.logger.log(`FlashId: ${toHex(flashId)}`);
    this.logger.log(`Flash Manufacturer: ${manufacturer.toString(16)}`);
    this.logger.log(
      `Flash Device: ${((flashId >> 8) & 0xff).toString(
        16,
      )}${flashIdLowbyte.toString(16)}`,
    );

    this.flashSize = DETECTED_FLASH_SIZES[flashIdLowbyte];
    this.logger.log(`Auto-detected Flash size: ${this.flashSize}`);
  }

  /**
   * @name getEraseSize
   * Calculate an erase size given a specific size in bytes.
   *   Provides a workaround for the bootloader erase bug on ESP8266.
   */
  getEraseSize(offset: number, size: number) {
    const sectorsPerBlock = 16;
    const sectorSize = FLASH_SECTOR_SIZE;
    const numSectors = Math.floor((size + sectorSize - 1) / sectorSize);
    const startSector = Math.floor(offset / sectorSize);

    let headSectors = sectorsPerBlock - (startSector % sectorsPerBlock);
    if (numSectors < headSectors) {
      headSectors = numSectors;
    }

    if (numSectors < 2 * headSectors) {
      return Math.floor(((numSectors + 1) / 2) * sectorSize);
    }

    return (numSectors - headSectors) * sectorSize;
  }

  /**
   * @name memBegin (592)
   * Start downloading an application image to RAM
   */
  async memBegin(
    size: number,
    blocks: number,
    blocksize: number,
    offset: number,
  ) {
    return await this.checkCommand(
      ESP_MEM_BEGIN,
      pack("<IIII", size, blocks, blocksize, offset),
    );
  }

  /**
   * @name memBlock (609)
   * Send a block of an image to RAM
   */
  async memBlock(data: number[], seq: number) {
    return await this.checkCommand(
      ESP_MEM_DATA,
      pack("<IIII", data.length, seq, 0, 0).concat(data),
      this.checksum(data),
    );
  }

  /**
   * @name memFinish (615)
   * Leave download mode and run the application
   *
   * Sending ESP_MEM_END usually sends a correct response back, however sometimes
   * (with ROM loader) the executed code may reset the UART or change the baud rate
   * before the transmit FIFO is empty. So in these cases we set a short timeout and
   * ignore errors.
   */
  async memFinish(entrypoint = 0) {
    const timeout = this.IS_STUB ? DEFAULT_TIMEOUT : MEM_END_ROM_TIMEOUT;
    const data = pack("<II", entrypoint == 0 ? 1 : 0, entrypoint);
    return await this.checkCommand(ESP_MEM_END, data, 0, timeout);
  }

  async runStub(skipFlashDetection = false): Promise<EspStubLoader> {
    const stub = await getStubCode(this.chipFamily, this.chipRevision);

    // No stub available for this chip, return ROM loader
    if (stub === null) {
      this.logger.log(
        `Stub flasher is not yet supported on ${this.chipName}, using ROM loader`,
      );
      return this as unknown as EspStubLoader;
    }

    // We're transferring over USB, right?
    const ramBlock = USB_RAM_BLOCK;

    // Upload
    this.logger.log("Uploading stub...");
    for (const field of ["text", "data"] as const) {
      const fieldData = stub[field];
      const offset = stub[`${field}_start` as "text_start" | "data_start"];
      const length = fieldData.length;
      const blocks = Math.floor((length + ramBlock - 1) / ramBlock);
      await this.memBegin(length, blocks, ramBlock, offset);
      for (const seq of Array(blocks).keys()) {
        const fromOffs = seq * ramBlock;
        let toOffs = fromOffs + ramBlock;
        if (toOffs > length) {
          toOffs = length;
        }
        await this.memBlock(fieldData.slice(fromOffs, toOffs), seq);
      }
    }
    await this.memFinish(stub.entry);

    const p = await this.readPacket(500);
    const pChar = String.fromCharCode(...p);

    if (pChar != "OHAI") {
      throw new Error("Failed to start stub. Unexpected response: " + pChar);
    }
    this.logger.log("Stub is now running...");
    const espStubLoader = new EspStubLoader(this.port, this.logger, this);

    // Try to autodetect the flash size.
    if (!skipFlashDetection) {
      await espStubLoader.detectFlashSize();
    }

    return espStubLoader;
  }

  __writer?: WritableStreamDefaultWriter<Uint8Array>;
  __writeChain: Promise<void> = Promise.resolve();

  private get _writer(): WritableStreamDefaultWriter<Uint8Array> | undefined {
    return this._parent ? this._parent._writer : this.__writer;
  }

  private set _writer(
    value: WritableStreamDefaultWriter<Uint8Array> | undefined,
  ) {
    if (this._parent) {
      this._parent._writer = value;
    } else {
      this.__writer = value;
    }
  }

  private get _writeChain(): Promise<void> {
    return this._parent ? this._parent._writeChain : this.__writeChain;
  }

  private set _writeChain(value: Promise<void>) {
    if (this._parent) {
      this._parent._writeChain = value;
    } else {
      this.__writeChain = value;
    }
  }

  async writeToStream(data: number[]) {
    if (!this.port.writable) {
      this.logger.debug("Port writable stream not available, skipping write");
      return;
    }

    if (this._isReconfiguring) {
      throw new Error("Cannot write during port reconfiguration");
    }

    // Queue writes to prevent lock contention (critical for CP2102 on Windows)
    this._writeChain = this._writeChain
      .then(
        async () => {
          // Check if port is still writable before attempting write
          if (!this.port.writable) {
            throw new Error("Port became unavailable during write");
          }

          // Get or create persistent writer
          if (!this._writer) {
            try {
              this._writer = this.port.writable.getWriter();
            } catch (err) {
              this.logger.error(`Failed to get writer: ${err}`);
              throw err;
            }
          }

          // Perform the write
          await this._writer.write(new Uint8Array(data));
        },
        async () => {
          // Previous write failed, but still attempt this write
          this.logger.debug(
            "Previous write failed, attempting recovery for current write",
          );
          if (!this.port.writable) {
            throw new Error("Port became unavailable during write");
          }

          // Writer was likely cleaned up by previous error, create new one
          if (!this._writer) {
            try {
              this._writer = this.port.writable.getWriter();
            } catch (err) {
              this.logger.debug(`Failed to get writer in recovery: ${err}`);
              throw new Error("Cannot acquire writer lock");
            }
          }

          await this._writer.write(new Uint8Array(data));
        },
      )
      .catch((err) => {
        this.logger.error(`Write error: ${err}`);
        // Ensure writer is cleaned up on any error
        if (this._writer) {
          try {
            this._writer.releaseLock();
          } catch {
            // Ignore release errors
          }
          this._writer = undefined;
        }
        // Re-throw to propagate error
        throw err;
      });

    // Always await the write chain to ensure errors are caught
    await this._writeChain;
  }

  async disconnect() {
    if (this._parent) {
      await this._parent.disconnect();
      return;
    }
    if (!this.port.writable) {
      this.logger.debug("Port already closed, skipping disconnect");
      return;
    }

    try {
      // Wait for pending writes to complete
      try {
        await this._writeChain;
      } catch (err) {
        this.logger.debug(`Pending write error during disconnect: ${err}`);
      }

      // Block new writes during disconnect
      this._isReconfiguring = true;

      // Release persistent writer before closing
      if (this._writer) {
        try {
          await this._writer.close();
          this._writer.releaseLock();
        } catch (err) {
          this.logger.debug(`Writer close/release error: ${err}`);
        }
        this._writer = undefined;
      } else {
        // No persistent writer exists, close stream directly
        // This path is taken when no writes have been queued
        try {
          const writer = this.port.writable.getWriter();
          await writer.close();
          writer.releaseLock();
        } catch (err) {
          this.logger.debug(`Direct writer close error: ${err}`);
        }
      }

      await new Promise((resolve) => {
        if (!this._reader) {
          resolve(undefined);
          return;
        }
        this.addEventListener("disconnect", resolve, { once: true });
        this._reader!.cancel();
      });
      this.connected = false;
    } finally {
      this._isReconfiguring = false;
    }
  }

  /**
   * @name reconnectAndResume
   * Reconnect the serial port to flush browser buffers and reload stub
   */
  async reconnect(): Promise<void> {
    if (this._parent) {
      await this._parent.reconnect();
      return;
    }

    try {
      this.logger.log("Reconnecting serial port...");

      this.connected = false;
      this.__inputBuffer = [];
      this.__inputBufferReadIndex = 0;

      // Wait for pending writes to complete
      try {
        await this._writeChain;
      } catch (err) {
        this.logger.debug(`Pending write error during reconnect: ${err}`);
      }

      // Block new writes during port close/open
      this._isReconfiguring = true;

      // Release persistent writer
      if (this._writer) {
        try {
          this._writer.releaseLock();
        } catch (err) {
          this.logger.debug(`Writer release error during reconnect: ${err}`);
        }
        this._writer = undefined;
      }

      // Cancel reader
      if (this._reader) {
        try {
          await this._reader.cancel();
        } catch (err) {
          this.logger.debug(`Reader cancel error: ${err}`);
        }
        this._reader = undefined;
      }

      // Close port
      try {
        await this.port.close();
        this.logger.log("Port closed");
      } catch (err) {
        this.logger.debug(`Port close error: ${err}`);
      }

      // Open the port
      this.logger.debug("Opening port...");
      try {
        await this.port.open({ baudRate: ESP_ROM_BAUD });
        this.connected = true;
      } catch (err) {
        throw new Error(`Failed to open port: ${err}`);
      }

      // Verify port streams are available
      if (!this.port.readable || !this.port.writable) {
        throw new Error(
          `Port streams not available after open (readable: ${!!this.port.readable}, writable: ${!!this.port.writable})`,
        );
      }

      // Port is now open and ready - allow writes for initialization
      this._isReconfiguring = false;

      // Save chip info and flash size (no need to detect again)
      const savedChipFamily = this.chipFamily;
      const savedChipName = this.chipName;
      const savedChipRevision = this.chipRevision;
      const savedChipVariant = this.chipVariant;
      const savedFlashSize = this.flashSize;

      // Reinitialize
      await this.hardReset(true);

      if (!this._parent) {
        this.__inputBuffer = [];
        this.__inputBufferReadIndex = 0;
        this.__totalBytesRead = 0;
        this.readLoop();
      }

      await this.flushSerialBuffers();
      await this.sync();

      // Restore chip info
      this.chipFamily = savedChipFamily;
      this.chipName = savedChipName;
      this.chipRevision = savedChipRevision;
      this.chipVariant = savedChipVariant;
      this.flashSize = savedFlashSize;

      this.logger.debug(`Reconnect complete (chip: ${this.chipName})`);

      // Verify port is ready
      if (!this.port.writable || !this.port.readable) {
        throw new Error("Port not ready after reconnect");
      }

      // Load stub
      const stubLoader = await this.runStub(true);
      this.logger.debug("Stub loaded");

      // Restore baudrate if it was changed
      if (this._currentBaudRate !== ESP_ROM_BAUD) {
        await stubLoader.setBaudrate(this._currentBaudRate);

        // Verify port is still ready after baudrate change
        if (!this.port.writable || !this.port.readable) {
          throw new Error(
            `Port not ready after baudrate change (readable: ${!!this.port.readable}, writable: ${!!this.port.writable})`,
          );
        }
      }

      // The stub is now running on the chip
      // stubLoader has this instance as _parent, so all operations go through this
      // We just need to mark this instance as running stub code
      this.IS_STUB = true;

      this.logger.debug("Reconnection successful");
    } catch (err) {
      // Ensure flag is reset on error
      this._isReconfiguring = false;
      throw err;
    }
  }

  /**
   * @name drainInputBuffer
   * Actively drain the input buffer by reading data for a specified time.
   * Simple approach for some drivers (especially CP210x on Windows) that have
   * issues with buffer flushing.
   *
   * Based on esptool.py fix: https://github.com/espressif/esptool/commit/5338ea054e5099ac7be235c54034802ac8a43162
   *
   * @param bufferingTime - Time in milliseconds to wait for the buffer to fill
   */
  async drainInputBuffer(bufferingTime = 200): Promise<void> {
    // Wait for the buffer to fill
    await sleep(bufferingTime);

    // Unsupported command response is sent 8 times and has
    // 14 bytes length including delimiter 0xC0 bytes.
    // At least part of it is read as a command response,
    // but to be safe, read it all.
    const bytesToDrain = 14 * 8;
    let drained = 0;

    // Drain the buffer by reading available data
    const drainStart = Date.now();
    const drainTimeout = 100; // Short timeout for draining

    while (drained < bytesToDrain && Date.now() - drainStart < drainTimeout) {
      if (this._inputBufferAvailable > 0) {
        const byte = this._readByte();
        if (byte !== undefined) {
          drained++;
        }
      } else {
        // Small sleep to avoid busy waiting
        await sleep(1);
      }
    }

    if (drained > 0) {
      this.logger.debug(`Drained ${drained} bytes from input buffer`);
    }

    // Final clear of application buffer
    if (!this._parent) {
      this.__inputBuffer = [];
      this.__inputBufferReadIndex = 0;
    }
  }

  /**
   * @name flushSerialBuffers
   * Flush any pending data in the TX and RX serial port buffers
   * This clears both the application RX buffer and waits for hardware buffers to drain
   */
  async flushSerialBuffers(): Promise<void> {
    // Clear application buffer
    if (!this._parent) {
      this.__inputBuffer = [];
      this.__inputBufferReadIndex = 0;
    }

    // Wait for any pending data
    await sleep(SYNC_TIMEOUT);

    // Final clear
    if (!this._parent) {
      this.__inputBuffer = [];
      this.__inputBufferReadIndex = 0;
    }

    this.logger.debug("Serial buffers flushed");
  }

  /**
   * @name readFlash
   * Read flash memory from the chip (only works with stub loader)
   * @param addr - Address to read from
   * @param size - Number of bytes to read
   * @param onPacketReceived - Optional callback function called when packet is received
   * @returns Uint8Array containing the flash data
   */
  async readFlash(
    addr: number,
    size: number,
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ): Promise<Uint8Array> {
    if (!this.IS_STUB) {
      throw new Error(
        "Reading flash is only supported in stub mode. Please run runStub() first.",
      );
    }

    // Flush serial buffers before flash read operation
    await this.flushSerialBuffers();

    this.logger.log(
      `Reading ${size} bytes from flash at address 0x${addr.toString(16)}...`,
    );

    // Initialize adaptive speed multipliers for WebUSB devices
    if (this.isWebUSB()) {
      if (this._isCDCDevice) {
        // CDC devices (CH343): Start with maximum, adaptive adjustment enabled
        this._adaptiveBlockMultiplier = 8; // blockSize = 248 bytes
        this._adaptiveMaxInFlightMultiplier = 8; // maxInFlight = 248 bytes
        this._consecutiveSuccessfulChunks = 0;
        this.logger.debug(
          `CDC device - Initialized: blockMultiplier=${this._adaptiveBlockMultiplier}, maxInFlightMultiplier=${this._adaptiveMaxInFlightMultiplier}`,
        );
      } else {
        // Non-CDC devices (CH340, CP2102): Fixed values, no adaptive adjustment
        this._adaptiveBlockMultiplier = 1; // blockSize = 31 bytes (fixed)
        this._adaptiveMaxInFlightMultiplier = 1; // maxInFlight = 31 bytes (fixed)
        this._consecutiveSuccessfulChunks = 0;
        this.logger.debug(
          `Non-CDC device - Fixed values: blockSize=31, maxInFlight=31`,
        );
      }
    }

    // Chunk size: Amount of data to request from ESP in one command
    // For WebUSB (Android), use smaller chunks to avoid timeouts and buffer issues
    // For Web Serial (Desktop), use larger chunks for better performance
    let CHUNK_SIZE: number;
    if (this.isWebUSB()) {
      // WebUSB: Use smaller chunks to avoid SLIP timeout issues
      CHUNK_SIZE = 0x4 * 0x1000; // 4KB = 16384 bytes
    } else {
      // Web Serial: Use larger chunks for better performance
      CHUNK_SIZE = 0x80 * 0x1000;
    }

    let allData = new Uint8Array(0);
    let currentAddr = addr;
    let remainingSize = size;

    while (remainingSize > 0) {
      const chunkSize = Math.min(CHUNK_SIZE, remainingSize);
      let chunkSuccess = false;
      let retryCount = 0;
      const MAX_RETRIES = 5;
      let deepRecoveryAttempted = false;

      // Retry loop for this chunk
      while (!chunkSuccess && retryCount <= MAX_RETRIES) {
        let resp = new Uint8Array(0);
        let lastAckedLength = 0; // Track last acknowledged length

        try {
          // Only log on first attempt or retries
          if (retryCount === 0) {
            this.logger.debug(
              `Reading chunk at 0x${currentAddr.toString(16)}, size: 0x${chunkSize.toString(16)}`,
            );
          }

          let blockSize: number;
          let maxInFlight: number;

          if (this.isWebUSB()) {
            // WebUSB (Android): All devices use adaptive speed
            // All have maxTransferSize=64, baseBlockSize=31
            const maxTransferSize =
              (this.port as WebUSBSerialPort).maxTransferSize || 64;
            const baseBlockSize = Math.floor((maxTransferSize - 2) / 2); // 31 bytes

            // Use current adaptive multipliers (initialized at start of readFlash)
            blockSize = baseBlockSize * this._adaptiveBlockMultiplier;
            maxInFlight = baseBlockSize * this._adaptiveMaxInFlightMultiplier;
          } else {
            // Web Serial (Desktop): Use multiples of 63 for consistency
            const base = 63;
            blockSize = base * 65; // 63 * 65 = 4095 (close to 0x1000)
            maxInFlight = base * 130; // 63 * 130 = 8190 (close to blockSize * 2)
          }

          const pkt = pack(
            "<IIII",
            currentAddr,
            chunkSize,
            blockSize,
            maxInFlight,
          );

          const [res] = await this.checkCommand(ESP_READ_FLASH, pkt);

          if (res != 0) {
            throw new Error("Failed to read memory: " + res);
          }

          while (resp.length < chunkSize) {
            // Read a SLIP packet
            let packet: number[];
            try {
              packet = await this.readPacket(FLASH_READ_TIMEOUT);
            } catch (err) {
              if (err instanceof SlipReadError) {
                this.logger.debug(
                  `SLIP read error at ${resp.length} bytes: ${err.message}`,
                );

                // Send empty SLIP frame to abort the stub's read operation
                // The stub expects 4 bytes (ACK), if we send less it will break out
                try {
                  // Send SLIP frame with no data (just delimiters)
                  const abortFrame = [0xc0, 0xc0]; // Empty SLIP frame
                  await this.writeToStream(abortFrame);
                  this.logger.debug(`Sent abort frame to stub`);

                  // Give stub time to process abort
                  await sleep(50);
                } catch (abortErr) {
                  this.logger.debug(`Abort frame error: ${abortErr}`);
                }

                // Drain input buffer to clear any stale data
                await this.drainInputBuffer(200);

                // If we've read all the data we need, break
                if (resp.length >= chunkSize) {
                  break;
                }
              }
              throw err;
            }

            if (packet && packet.length > 0) {
              const packetData = new Uint8Array(packet);

              // Append to response
              const newResp = new Uint8Array(resp.length + packetData.length);
              newResp.set(resp);
              newResp.set(packetData, resp.length);
              resp = newResp;

              // Send acknowledgment when we've received maxInFlight bytes
              // The stub sends packets until (num_sent - num_acked) >= max_in_flight
              // We MUST wait for all packets before sending ACK
              const shouldAck =
                resp.length >= chunkSize || // End of chunk
                resp.length >= lastAckedLength + maxInFlight; // Received all packets

              if (shouldAck) {
                const ackData = pack("<I", resp.length);
                const slipEncodedAck = slipEncode(ackData);
                await this.writeToStream(slipEncodedAck);

                // Update lastAckedLength to current response length
                // This ensures next ACK is sent at the right time
                lastAckedLength = resp.length;
              }
            }
          }

          // Chunk read successfully - append to all data
          const newAllData = new Uint8Array(allData.length + resp.length);
          newAllData.set(allData);
          newAllData.set(resp, allData.length);
          allData = newAllData;

          chunkSuccess = true;

          // ADAPTIVE SPEED ADJUSTMENT: Only for CDC devices
          // Non-CDC devices (CH340, CP2102) stay at fixed blockSize=31, maxInFlight=31
          if (this.isWebUSB() && this._isCDCDevice && retryCount === 0) {
            this._consecutiveSuccessfulChunks++;

            // After 2 consecutive successful chunks, increase speed gradually
            if (this._consecutiveSuccessfulChunks >= 2) {
              const maxTransferSize =
                (this.port as WebUSBSerialPort).maxTransferSize || 64;
              const baseBlockSize = Math.floor((maxTransferSize - 2) / 2); // 31 bytes

              // Maximum: blockSize=248 (8 * 31), maxInFlight=248 (8 * 31)
              const MAX_BLOCK_MULTIPLIER = 8; // 248 bytes - tested stable
              const MAX_INFLIGHT_MULTIPLIER = 8; // 248 bytes - tested stable

              let adjusted = false;

              // Increase blockSize first (up to 248), then maxInFlight
              if (this._adaptiveBlockMultiplier < MAX_BLOCK_MULTIPLIER) {
                this._adaptiveBlockMultiplier = Math.min(
                  this._adaptiveBlockMultiplier * 2,
                  MAX_BLOCK_MULTIPLIER,
                );
                adjusted = true;
              }
              // Once blockSize is at maximum, increase maxInFlight
              else if (
                this._adaptiveMaxInFlightMultiplier < MAX_INFLIGHT_MULTIPLIER
              ) {
                this._adaptiveMaxInFlightMultiplier = Math.min(
                  this._adaptiveMaxInFlightMultiplier * 2,
                  MAX_INFLIGHT_MULTIPLIER,
                );
                adjusted = true;
              }

              if (adjusted) {
                const newBlockSize =
                  baseBlockSize * this._adaptiveBlockMultiplier;
                const newMaxInFlight =
                  baseBlockSize * this._adaptiveMaxInFlightMultiplier;
                this.logger.debug(
                  `Speed increased: blockSize=${newBlockSize}, maxInFlight=${newMaxInFlight}`,
                );
                this._lastAdaptiveAdjustment = Date.now();
              }

              // Reset counter
              this._consecutiveSuccessfulChunks = 0;
            }
          }
        } catch (err) {
          retryCount++;

          // ADAPTIVE SPEED ADJUSTMENT: Only for CDC devices
          // Non-CDC devices stay at fixed values
          if (this.isWebUSB() && this._isCDCDevice && retryCount === 1) {
            // Only reduce if we're above minimum
            if (
              this._adaptiveBlockMultiplier > 1 ||
              this._adaptiveMaxInFlightMultiplier > 1
            ) {
              // Reduce to minimum on error
              this._adaptiveBlockMultiplier = 1; // 31 bytes (for CH343)
              this._adaptiveMaxInFlightMultiplier = 1; // 31 bytes
              this._consecutiveSuccessfulChunks = 0; // Reset success counter

              const maxTransferSize =
                (this.port as WebUSBSerialPort).maxTransferSize || 64;
              const baseBlockSize = Math.floor((maxTransferSize - 2) / 2);
              const newBlockSize =
                baseBlockSize * this._adaptiveBlockMultiplier;
              const newMaxInFlight =
                baseBlockSize * this._adaptiveMaxInFlightMultiplier;

              this.logger.debug(
                `Error at higher speed - reduced to minimum: blockSize=${newBlockSize}, maxInFlight=${newMaxInFlight}`,
              );
            } else {
              // Already at minimum and still failing - this is a real error
              this.logger.debug(
                `Error at minimum speed (blockSize=31, maxInFlight=31) - not a speed issue`,
              );
            }
          }

          // Check if it's a timeout error or SLIP error
          if (err instanceof SlipReadError) {
            if (retryCount <= MAX_RETRIES) {
              this.logger.log(
                `${err.message} at 0x${currentAddr.toString(16)}. Draining buffer and retrying (attempt ${retryCount}/${MAX_RETRIES})...`,
              );

              try {
                await this.drainInputBuffer(200);

                // Clear application buffer
                await this.flushSerialBuffers();

                // Wait before retry to let hardware settle
                await sleep(SYNC_TIMEOUT);

                // Continue to retry the same chunk (will send NEW read command)
              } catch (drainErr) {
                this.logger.debug(`Buffer drain error: ${drainErr}`);
              }
            } else {
              // All retries exhausted - attempt recovery by reloading stub
              // IMPORTANT: Do NOT close port to keep ESP32 in bootloader mode
              if (!deepRecoveryAttempted) {
                deepRecoveryAttempted = true;

                this.logger.log(
                  `All retries exhausted at 0x${currentAddr.toString(16)}. Attempting recovery (close and reopen port)...`,
                );

                try {
                  // Reconnect will close port, reopen, and reload stub
                  await this.reconnect();

                  this.logger.log(
                    "Deep recovery successful. Resuming read from current position...",
                  );

                  // Reset retry counter to give it another chance after recovery
                  retryCount = 0;
                  continue;
                } catch (recoveryErr) {
                  throw new Error(
                    `Failed to read chunk at 0x${currentAddr.toString(16)} after ${MAX_RETRIES} retries and recovery failed: ${recoveryErr}`,
                  );
                }
              } else {
                // Recovery already attempted, give up
                throw new Error(
                  `Failed to read chunk at 0x${currentAddr.toString(16)} after ${MAX_RETRIES} retries and recovery attempt`,
                );
              }
            }
          } else {
            // Non-SLIP error, don't retry
            throw err;
          }
        }
      }

      // Update progress (use empty array since we already appended to allData)
      if (onPacketReceived) {
        onPacketReceived(new Uint8Array(chunkSize), allData.length, size);
      }

      currentAddr += chunkSize;
      remainingSize -= chunkSize;

      this.logger.debug(
        `Total progress: 0x${allData.length.toString(16)} from 0x${size.toString(16)} bytes`,
      );
    }

    return allData;
  }
}

class EspStubLoader extends ESPLoader {
  /*
    The Stubloader has commands that run on the uploaded Stub Code in RAM
    rather than built in commands.
  */
  IS_STUB = true;

  /**
   * @name memBegin (592)
   * Start downloading an application image to RAM
   */
  async memBegin(
    size: number,
    _blocks: number,
    _blocksize: number,
    offset: number,
  ): Promise<[number, number[]]> {
    const stub = await getStubCode(this.chipFamily, this.chipRevision);

    // Stub may be null for chips without stub support
    if (stub === null) {
      return [0, []];
    }

    const load_start = offset;
    const load_end = offset + size;
    this.logger.debug(
      `Load range: ${toHex(load_start, 8)}-${toHex(load_end, 8)}`,
    );
    this.logger.debug(
      `Stub data: ${toHex(stub.data_start, 8)}, len: ${stub.data.length}, text: ${toHex(stub.text_start, 8)}, len: ${stub.text.length}`,
    );
    for (const [start, end] of [
      [stub.data_start, stub.data_start + stub.data.length],
      [stub.text_start, stub.text_start + stub.text.length],
    ]) {
      if (load_start < end && load_end > start) {
        throw new Error(
          "Software loader is resident at " +
            toHex(start, 8) +
            "-" +
            toHex(end, 8) +
            ". " +
            "Can't load binary at overlapping address range " +
            toHex(load_start, 8) +
            "-" +
            toHex(load_end, 8) +
            ". " +
            "Try changing the binary loading address.",
        );
      }
    }
    return [0, []];
  }

  /**
   * @name getEraseSize
   * depending on flash chip model the erase may take this long (maybe longer!)
   */
  async eraseFlash() {
    await this.checkCommand(ESP_ERASE_FLASH, [], 0, CHIP_ERASE_TIMEOUT);
  }
}
