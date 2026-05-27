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
  ESP_ERASE_REGION,
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
  ESP32_BASEFUSEADDR,
  ESP32_APB_CTL_DATE_ADDR,
  ESP32S2_EFUSE_BLOCK1_ADDR,
  ESP32S3_EFUSE_BLOCK1_ADDR,
  ESP32C2_EFUSE_BLOCK2_ADDR,
  ESP32C5_EFUSE_BLOCK1_ADDR,
  ESP32C6_EFUSE_BLOCK1_ADDR,
  ESP32C61_EFUSE_BLOCK1_ADDR,
  ESP32H2_EFUSE_BLOCK1_ADDR,
  ESP32P4_EFUSE_BLOCK1_ADDR,
  ESP32S31_EFUSE_BLOCK1_ADDR,
  ESP32S31_RTC_CNTL_WDTWPROTECT_REG,
  ESP32S31_RTC_CNTL_WDTCONFIG0_REG,
  ESP32S31_RTC_CNTL_WDTCONFIG1_REG,
  ESP32S31_RTC_CNTL_WDT_WKEY,
  SlipReadError,
  ESP32S2_RTC_CNTL_WDTWPROTECT_REG,
  ESP32S2_RTC_CNTL_WDTCONFIG0_REG,
  ESP32S2_RTC_CNTL_WDTCONFIG1_REG,
  ESP32S2_RTC_CNTL_WDT_WKEY,
  ESP32S2_RTC_CNTL_OPTION1_REG,
  ESP32S2_RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK,
  ESP32S3_RTC_CNTL_WDTWPROTECT_REG,
  ESP32S3_RTC_CNTL_WDTCONFIG0_REG,
  ESP32S3_RTC_CNTL_WDTCONFIG1_REG,
  ESP32S3_RTC_CNTL_WDT_WKEY,
  ESP32S3_RTC_CNTL_OPTION1_REG,
  ESP32S3_RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK,
  ESP32C3_EFUSE_RD_MAC_SPI_SYS_3_REG,
  ESP32C3_EFUSE_RD_MAC_SPI_SYS_5_REG,
  ESP32C5_UART_CLKDIV_REG,
  ESP32C5_PCR_SYSCLK_CONF_REG,
  ESP32C5_PCR_SYSCLK_XTAL_FREQ_V,
  ESP32C5_PCR_SYSCLK_XTAL_FREQ_S,
  ESP32P4_RTC_CNTL_WDTWPROTECT_REG,
  ESP32P4_RTC_CNTL_WDTCONFIG0_REG,
  ESP32P4_RTC_CNTL_WDTCONFIG1_REG,
  ESP32P4_RTC_CNTL_WDT_WKEY,
  ESP32P4_RTC_CNTL_OPTION1_REG,
  ESP32P4_RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK,
  ESP32P4_LP_SYSTEM_REG_ANA_XPD_PAD_GROUP_REG,
  ESP32P4_PMU_EXT_LDO_P0_0P1A_ANA_REG,
  ESP32P4_PMU_ANA_0P1A_EN_CUR_LIM_0,
  ESP32P4_PMU_EXT_LDO_P0_0P1A_REG,
  ESP32P4_PMU_0P1A_TARGET0_0,
  ESP32P4_PMU_0P1A_FORCE_TIEH_SEL_0,
  ESP32P4_PMU_DATE_REG,
  ESP32S2_UARTDEV_BUF_NO,
  ESP32S2_UARTDEV_BUF_NO_USB_OTG,
  ESP32S3_UARTDEV_BUF_NO,
  ESP32S3_UARTDEV_BUF_NO_USB_OTG,
  ESP32S3_UARTDEV_BUF_NO_USB_JTAG_SERIAL,
  ESP32C3_UARTDEV_BUF_NO_USB_JTAG_SERIAL,
  ESP32C3_BUF_UART_NO_OFFSET,
  ESP32C5_UARTDEV_BUF_NO,
  ESP32C5_UARTDEV_BUF_NO_USB_JTAG_SERIAL,
  ESP32C6_UARTDEV_BUF_NO,
  ESP32C6_UARTDEV_BUF_NO_USB_JTAG_SERIAL,
  ESP32C61_UARTDEV_BUF_NO_REV_LE2,
  ESP32C61_UARTDEV_BUF_NO_REV_GT2,
  ESP32C61_UARTDEV_BUF_NO_USB_JTAG_SERIAL_REV_LE2,
  ESP32C61_UARTDEV_BUF_NO_USB_JTAG_SERIAL_REV_GT2,
  ESP32H2_UARTDEV_BUF_NO,
  ESP32H2_UARTDEV_BUF_NO_USB_JTAG_SERIAL,
  ESP32H4_UARTDEV_BUF_NO,
  ESP32H4_UARTDEV_BUF_NO_USB_JTAG_SERIAL,
  ESP32P4_UARTDEV_BUF_NO_REV0,
  ESP32P4_UARTDEV_BUF_NO_REV300,
  ESP32P4_UARTDEV_BUF_NO_USB_OTG,
  ESP32P4_UARTDEV_BUF_NO_USB_JTAG_SERIAL,
} from "./const";
import { getStubCode } from "./stubs";
import { hexFormatter, padTo, sleep, slipEncode, toHex } from "./util";
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
  __chipFamily?: ChipFamily;
  __chipName: string | null = null;
  __chipRevision: number | null = null;
  __chipVariant: string | null = null;
  _efuses = new Array(4).fill(0);
  _flashsize = 4 * 1024 * 1024;
  debug = false;
  IS_STUB = false;
  connected = true;
  flashSize: string | null = null;

  __inputBuffer?: number[];
  __inputBufferReadIndex?: number;
  __totalBytesRead?: number;
  public currentBaudRate: number = ESP_ROM_BAUD;
  private _maxUSBSerialBaudrate?: number;
  public __reader?: ReadableStreamDefaultReader<Uint8Array>;
  private SLIP_END = 0xc0;
  private SLIP_ESC = 0xdb;
  private SLIP_ESC_END = 0xdc;
  private SLIP_ESC_ESC = 0xdd;
  private _isESP32S2NativeUSB: boolean = false;
  private _initializationSucceeded: boolean = false;
  private __commandLock: Promise<[number, number[]]> = Promise.resolve([0, []]);
  private __isReconfiguring: boolean = false;
  private __abandonCurrentOperation: boolean = false;
  private _suppressDisconnect: boolean = false;
  private __consoleMode: boolean = false;
  public _isUsbJtagOrOtg: boolean | undefined = undefined;

  /**
   * Check if device is using USB-JTAG or USB-OTG (not external serial chip)
   * Returns undefined if not yet determined
   */
  public get isUsbJtagOrOtg(): boolean | undefined {
    return this._parent ? this._parent._isUsbJtagOrOtg : this._isUsbJtagOrOtg;
  }

  // Adaptive speed adjustment for flash read operations
  private __adaptiveBlockMultiplier: number = 1;
  private __adaptiveMaxInFlightMultiplier: number = 1;
  private __consecutiveSuccessfulChunks: number = 0;
  private __lastAdaptiveAdjustment: number = 0;
  private __isCDCDevice: boolean = false;
  private __isCP210x: boolean = false;

  private get _isCP210x(): boolean {
    return this._parent ? this._parent._isCP210x : this.__isCP210x;
  }

  private set _isCP210x(value: boolean) {
    if (this._parent) {
      this._parent._isCP210x = value;
    } else {
      this.__isCP210x = value;
    }
  }

  constructor(
    public port: SerialPort,
    public logger: Logger,
    private _parent?: ESPLoader,
  ) {
    super();
  }

  // Chip properties with parent delegation
  // chipFamily accessed before initialization as designed
  get chipFamily(): ChipFamily {
    return this._parent ? this._parent.chipFamily : this.__chipFamily!;
  }

  set chipFamily(value: ChipFamily) {
    if (this._parent) {
      this._parent.chipFamily = value;
    } else {
      this.__chipFamily = value;
    }
  }

  get chipName(): string | null {
    return this._parent ? this._parent.chipName : this.__chipName;
  }

  set chipName(value: string | null) {
    if (this._parent) {
      this._parent.chipName = value;
    } else {
      this.__chipName = value;
    }
  }

  get chipRevision(): number | null {
    return this._parent ? this._parent.chipRevision : this.__chipRevision;
  }

  set chipRevision(value: number | null) {
    if (this._parent) {
      this._parent.chipRevision = value;
    } else {
      this.__chipRevision = value;
    }
  }

  get chipVariant(): string | null {
    return this._parent ? this._parent.chipVariant : this.__chipVariant;
  }

  set chipVariant(value: string | null) {
    if (this._parent) {
      this._parent.chipVariant = value;
    } else {
      this.__chipVariant = value;
    }
  }

  // Console mode with parent delegation
  private get _consoleMode(): boolean {
    return this._parent ? this._parent._consoleMode : this.__consoleMode;
  }

  private set _consoleMode(value: boolean) {
    if (this._parent) {
      this._parent._consoleMode = value;
    } else {
      this.__consoleMode = value;
    }
  }

  // Public setter for console mode (used by script.js)
  public setConsoleMode(value: boolean): void {
    this._consoleMode = value;
  }

  private get _inputBuffer(): number[] {
    if (this._parent) {
      return this._parent._inputBuffer;
    }
    if (this.__inputBuffer === undefined) {
      throw new Error("_inputBuffer accessed before initialization");
    }
    return this.__inputBuffer;
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
        0x12: { name: "ESP32-P4 Native USB", maxBaudrate: 2000000 },
        0x1001: { name: "ESP32 Native USB", maxBaudrate: 2000000 },
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

        // Silicon Labs CP210x family workaround:
        // The Windows VCP driver has a small receive buffer that drops bytes
        // during sustained high-speed flash reads. Flag the device so the
        // readFlash code path uses smaller block/maxInFlight values.
        if (portInfo.usbVendorId === 0x10c4) {
          this._isCP210x = true;
          this.logger.log(
            "CP210x detected - using throttled flash read parameters " +
              "(workaround for Silicon Labs Windows VCP driver buffer issue).",
          );
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

    // Power on flash for ESP32-P4 Rev 301 (must be done before loading stub)
    if (this.chipFamily === CHIP_FAMILY_ESP32P4 && this.chipRevision === 301) {
      await this.powerOnFlash();
    }

    // Detect if device is using USB-JTAG/Serial or USB-OTG (not external serial chip)
    // This is needed to determine the correct reset strategy for console mode
    try {
      this._isUsbJtagOrOtg = await this.detectUsbConnectionType();
      this.logger.debug(
        `USB connection type: ${this._isUsbJtagOrOtg ? "USB-JTAG/OTG" : "External Serial Chip"}`,
      );
    } catch (err) {
      this.logger.debug(`Could not detect USB connection type: ${err}`);
    }

    try {
      const usbMode = await this.getUsbMode();
      this.logger.debug(
        `USB mode (register): ${usbMode.mode} (uartNo=${usbMode.uartNo})`,
      );
    } catch (err) {
      this.logger.debug(`Could not detect USB mode: ${err}`);
    }

    // Read the OTP data for this chip and store into this.efuses array
    const FlAddr = getSpiFlashAddresses(this.getChipFamily());
    const AddrMAC = FlAddr.macFuse;
    for (let i = 0; i < 4; i++) {
      this._efuses[i] = await this.readRegister(AddrMAC + 4 * i);
    }
    const revisionInfo =
      this.chipRevision !== null && this.chipRevision !== undefined
        ? ` (revision ${this.chipRevision})`
        : "";
    this.logger.log(`Connected to ${this.chipName}${revisionInfo}`);
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

        this.chipRevision = await this.getChipRevision();
        this.logger.debug(`${this.chipName} revision: ${this.chipRevision}`);

        if (
          this.chipFamily === CHIP_FAMILY_ESP32P4 &&
          this.chipRevision >= 300
        ) {
          this.chipVariant = "rev300";
        } else if (this.chipFamily === CHIP_FAMILY_ESP32P4) {
          this.chipVariant = "rev0";
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

    this.chipRevision = await this.getChipRevision();
    this.logger.debug(`${this.chipName} revision: ${this.chipRevision}`);

    if (this.chipFamily === CHIP_FAMILY_ESP32P4) {
      this.chipVariant = this.chipRevision >= 300 ? "rev300" : "rev0";
      this.logger.debug(`ESP32-P4 variant: ${this.chipVariant}`);
    }

    this.logger.debug(
      `Detected chip via magic value: ${toHex(chipMagicValue >>> 0, 8)} (${this.chipName})`,
    );
  }

  async getChipRevision(): Promise<number> {
    let minor = 0;
    let major = 0;

    switch (this.chipFamily) {
      case CHIP_FAMILY_ESP32: {
        const efuse3 = await this.readRegister(ESP32_BASEFUSEADDR + 4 * 3);
        const efuse5 = await this.readRegister(ESP32_BASEFUSEADDR + 4 * 5);
        minor = (efuse5 >> 24) & 0x3;
        const revBit0 = (efuse3 >> 15) & 0x1;
        const revBit1 = (efuse5 >> 20) & 0x1;
        const apb = await this.readRegister(ESP32_APB_CTL_DATE_ADDR);
        const revBit2 = (apb >> 31) & 0x1;
        const combined = (revBit2 << 2) | (revBit1 << 1) | revBit0;
        major =
          ({ 0: 0, 1: 1, 3: 2, 7: 3 } as Record<number, number>)[combined] ?? 0;
        break;
      }
      case CHIP_FAMILY_ESP32S2: {
        const w3 = await this.readRegister(ESP32S2_EFUSE_BLOCK1_ADDR + 4 * 3);
        const w4 = await this.readRegister(ESP32S2_EFUSE_BLOCK1_ADDR + 4 * 4);
        const hi = (w3 >> 20) & 0x01;
        const lo = (w4 >> 4) & 0x07;
        minor = (hi << 3) + lo;
        major = (w3 >> 18) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32S3: {
        const w3 = await this.readRegister(ESP32S3_EFUSE_BLOCK1_ADDR + 4 * 3);
        const w5 = await this.readRegister(ESP32S3_EFUSE_BLOCK1_ADDR + 4 * 5);
        const hi = (w5 >> 23) & 0x01;
        const lo = (w3 >> 18) & 0x07;
        minor = (hi << 3) + lo;
        major = (w5 >> 24) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32C2: {
        const w1 = await this.readRegister(ESP32C2_EFUSE_BLOCK2_ADDR + 4 * 1);
        minor = (w1 >> 16) & 0x0f;
        major = (w1 >> 20) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32C3: {
        const w3 = await this.readRegister(ESP32C3_EFUSE_RD_MAC_SPI_SYS_3_REG);
        const w5 = await this.readRegister(ESP32C3_EFUSE_RD_MAC_SPI_SYS_5_REG);
        const hi = (w5 >> 23) & 0x01;
        const lo = (w3 >> 18) & 0x07;
        minor = (hi << 3) + lo;
        major = (w5 >> 24) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32C5: {
        const w2 = await this.readRegister(ESP32C5_EFUSE_BLOCK1_ADDR + 4 * 2);
        minor = w2 & 0x0f;
        major = (w2 >> 4) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32C6: {
        const w3 = await this.readRegister(ESP32C6_EFUSE_BLOCK1_ADDR + 4 * 3);
        minor = (w3 >> 18) & 0x0f;
        major = (w3 >> 22) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32C61: {
        const w2 = await this.readRegister(ESP32C61_EFUSE_BLOCK1_ADDR + 4 * 2);
        minor = w2 & 0x0f;
        major = (w2 >> 4) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32H2: {
        const w3 = await this.readRegister(ESP32H2_EFUSE_BLOCK1_ADDR + 4 * 3);
        minor = (w3 >> 18) & 0x07;
        major = (w3 >> 21) & 0x03;
        break;
      }
      case CHIP_FAMILY_ESP32H4: {
        break;
      }
      case CHIP_FAMILY_ESP32H21: {
        break;
      }
      case CHIP_FAMILY_ESP32P4: {
        const w2 = await this.readRegister(ESP32P4_EFUSE_BLOCK1_ADDR + 4 * 2);
        minor = w2 & 0x0f;
        major = (((w2 >> 23) & 1) << 2) | ((w2 >> 4) & 0x03);
        break;
      }
      case CHIP_FAMILY_ESP32S31: {
        const w2 = await this.readRegister(ESP32S31_EFUSE_BLOCK1_ADDR + 4 * 2);
        minor = w2 & 0x0f;
        major = (w2 >> 4) & 0x03;
        break;
      }
    }

    return major * 100 + minor;
  }

  /**
   * Power on the flash chip for ESP32-P4 Rev 301 (ECO6)
   * The flash chip is powered off by default on ECO6, when the default flash
   * voltage changed from 1.8V to 3.3V. This is to prevent damage to 1.8V flash chips.
   */
  async powerOnFlash(): Promise<void> {
    if (this.chipFamily !== CHIP_FAMILY_ESP32P4) {
      return; // Only needed for ESP32-P4
    }

    if (this.chipRevision !== 301) {
      return; // Only needed for Rev 301 (ECO6)
    }

    this.logger.debug("Powering on flash for ESP32-P4 Rev 301 (ECO6)");

    // Power up pad group
    await this.writeRegister(ESP32P4_LP_SYSTEM_REG_ANA_XPD_PAD_GROUP_REG, 1);
    await sleep(10); // 0.01 seconds

    // Flash power up sequence
    const pmuAnaReg = await this.readRegister(
      ESP32P4_PMU_EXT_LDO_P0_0P1A_ANA_REG,
    );
    await this.writeRegister(
      ESP32P4_PMU_EXT_LDO_P0_0P1A_ANA_REG,
      pmuAnaReg | ESP32P4_PMU_ANA_0P1A_EN_CUR_LIM_0,
    );

    const pmuReg = await this.readRegister(ESP32P4_PMU_EXT_LDO_P0_0P1A_REG);
    await this.writeRegister(
      ESP32P4_PMU_EXT_LDO_P0_0P1A_REG,
      pmuReg | ESP32P4_PMU_0P1A_FORCE_TIEH_SEL_0,
    );

    const pmuDateReg = await this.readRegister(ESP32P4_PMU_DATE_REG);
    await this.writeRegister(ESP32P4_PMU_DATE_REG, pmuDateReg | (3 << 0));

    await sleep(0.05); // 0.00005 seconds = 0.05 ms

    const pmuAnaReg2 = await this.readRegister(
      ESP32P4_PMU_EXT_LDO_P0_0P1A_ANA_REG,
    );
    await this.writeRegister(
      ESP32P4_PMU_EXT_LDO_P0_0P1A_ANA_REG,
      pmuAnaReg2 & ~ESP32P4_PMU_ANA_0P1A_EN_CUR_LIM_0,
    );

    const pmuReg2 = await this.readRegister(ESP32P4_PMU_EXT_LDO_P0_0P1A_REG);
    await this.writeRegister(
      ESP32P4_PMU_EXT_LDO_P0_0P1A_REG,
      pmuReg2 & ~ESP32P4_PMU_0P1A_TARGET0_0,
    );

    // Update eFuse voltage to PMU
    const pmuReg3 = await this.readRegister(ESP32P4_PMU_EXT_LDO_P0_0P1A_REG);
    await this.writeRegister(ESP32P4_PMU_EXT_LDO_P0_0P1A_REG, pmuReg3 | 0x80);

    const pmuReg4 = await this.readRegister(ESP32P4_PMU_EXT_LDO_P0_0P1A_REG);
    await this.writeRegister(
      ESP32P4_PMU_EXT_LDO_P0_0P1A_REG,
      pmuReg4 & ~ESP32P4_PMU_0P1A_FORCE_TIEH_SEL_0,
    );

    await sleep(2); // 0.0018 seconds = 1.8 ms, rounded to 2ms

    this.logger.debug("Flash powered on successfully");
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
   * Get MAC address from efuses
   */
  async getMacAddress(): Promise<string> {
    if (!this._initializationSucceeded) {
      throw new Error(
        "getMacAddress() requires initialize() to have completed successfully",
      );
    }
    const macBytes = this.macAddr(); // chip-family-aware
    return macBytes
      .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
      .join(":");
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
        const chunk = Array.from(value as Uint8Array);
        Array.prototype.push.apply(this._inputBuffer, chunk);

        // Track total bytes read from serial port
        this._totalBytesRead += value.length;
      }
    } catch {
      //      this.logger.error("Read loop got disconnected");
    } finally {
      // Always reset reconfiguring flag when read loop ends
      // This prevents "Cannot write during port reconfiguration" errors
      // when the read loop dies unexpectedly
      this._isReconfiguring = false;

      // Release reader if still locked
      if (this._reader) {
        try {
          this._reader.releaseLock();
          this.logger.debug("Reader released in readLoop cleanup");
        } catch (err) {
          this.logger.debug(`Reader release error in readLoop: ${err}`);
        }
        this._reader = undefined;
      }
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

    // Only dispatch disconnect event if not suppressed
    if (!this._suppressDisconnect) {
      this.dispatchEvent(new Event("disconnect"));
    }
    this._suppressDisconnect = false;
    this.logger.debug("Finished read loop");
  }

  state_DTR = false;
  state_RTS = false;

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

  async setDTRandRTS(dtr: boolean, rts: boolean) {
    this.state_DTR = dtr;
    this.state_RTS = rts;
    await this.port.setSignals({
      dataTerminalReady: dtr,
      requestToSend: rts,
    });
  }

  private async runSignalSequence(
    steps: Array<{ dtr?: boolean; rts?: boolean; delayMs?: number }>,
  ): Promise<void> {
    const webusb =
      (this.port as unknown as { isWebUSB?: boolean }).isWebUSB === true;
    for (const step of steps) {
      if (step.dtr !== undefined && step.rts !== undefined) {
        if (webusb) {
          await this.setDTRandRTSWebUSB(step.dtr, step.rts);
        } else {
          await this.setDTRandRTS(step.dtr, step.rts);
        }
      } else {
        if (step.dtr !== undefined) {
          if (webusb) {
            await this.setDTRWebUSB(step.dtr);
          } else {
            await this.setDTR(step.dtr);
          }
        }
        if (step.rts !== undefined) {
          if (webusb) {
            await this.setRTSWebUSB(step.rts);
          } else {
            await this.setRTS(step.rts);
          }
        }
      }
      if (step.delayMs) await sleep(step.delayMs);
    }
  }

  /**
   * @name hardResetUSBJTAGSerial
   * USB-JTAG/Serial reset for Web Serial (Desktop)
   */
  async hardResetUSBJTAGSerial() {
    await this.runSignalSequence([
      { rts: false },
      { dtr: false, delayMs: 100 },
      { dtr: true, rts: false, delayMs: 100 },
      { rts: true },
      { dtr: false, rts: true, delayMs: 100 },
      { dtr: false, rts: false, delayMs: 200 },
    ]);
  }

  /**
   * @name hardResetClassic
   * Classic reset for Web Serial (Desktop) DTR = IO0, RTS = EN
   */
  async hardResetClassic() {
    await this.runSignalSequence([
      { dtr: false, rts: true, delayMs: 100 },
      { dtr: true, rts: false, delayMs: 50 },
      { dtr: false, delayMs: 200 },
    ]);
  }

  /**
   * Reset to firmware mode (not bootloader) for Web Serial
   * Keeps IO0=HIGH during reset so chip boots into firmware
   */
  async hardResetToFirmware() {
    await this.runSignalSequence([
      { dtr: false, rts: true, delayMs: 100 },
      { rts: false, delayMs: 50 },
      { delayMs: 200 },
    ]);
  }

  /**
   * @name hardResetUnixTight
   * Unix Tight reset for Web Serial (Desktop) - sets DTR and RTS simultaneously
   */
  async hardResetUnixTight() {
    await this.runSignalSequence([
      { dtr: true, rts: true },
      { dtr: false, rts: false },
      { dtr: false, rts: true, delayMs: 100 },
      { dtr: true, rts: false, delayMs: 50 },
      { dtr: false, rts: false },
      { dtr: false, delayMs: 200 },
    ]);
  }

  // ============================================================================
  // WebUSB (Android) - DTR/RTS Signal Handling & Reset Strategies
  // ============================================================================

  async setRTSWebUSB(state: boolean) {
    this.state_RTS = state;
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
      requestToSend: this.state_RTS, // Explicitly preserve current RTS state
    });
  }

  async setDTRandRTSWebUSB(dtr: boolean, rts: boolean) {
    this.state_DTR = dtr;
    this.state_RTS = rts;
    await (this.port as WebUSBSerialPort).setSignals({
      dataTerminalReady: dtr,
      requestToSend: rts,
    });
  }

  /**
   * @name hardResetUSBJTAGSerialInvertedDTRWebUSB
   * USB-JTAG/Serial reset with inverted DTR for WebUSB (Android)
   */
  async hardResetUSBJTAGSerialInvertedDTRWebUSB() {
    await this.runSignalSequence([
      { rts: false, dtr: true, delayMs: 100 },
      { dtr: false, rts: false, delayMs: 100 },
      { rts: true, dtr: true, delayMs: 100 },
      { dtr: true, rts: false, delayMs: 200 },
    ]);
  }

  /**
   * @name hardResetClassicLongDelayWebUSB
   * Classic reset with longer delays for WebUSB (Android)
   * Specifically for CP2102/CH340 which may need more time
   */
  async hardResetClassicLongDelayWebUSB() {
    await this.runSignalSequence([
      { dtr: false, rts: true, delayMs: 500 },
      { dtr: true, rts: false, delayMs: 200 },
      { dtr: false, delayMs: 500 },
    ]);
  }

  /**
   * @name hardResetClassicShortDelayWebUSB
   * Classic reset with shorter delays for WebUSB (Android)
   */
  async hardResetClassicShortDelayWebUSB() {
    await this.runSignalSequence([
      { dtr: false, rts: true, delayMs: 50 },
      { dtr: true, rts: false, delayMs: 25 },
      { dtr: false, delayMs: 100 },
    ]);
  }

  /**
   * @name hardResetInvertedWebUSB
   * Inverted reset sequence for WebUSB (Android) - both signals inverted
   */
  async hardResetInvertedWebUSB() {
    await this.runSignalSequence([
      { dtr: true, rts: false, delayMs: 100 },
      { dtr: false, rts: true, delayMs: 50 },
      { dtr: true, delayMs: 200 },
    ]);
  }

  /**
   * @name hardResetInvertedDTRWebUSB
   * Only DTR inverted for WebUSB (Android)
   */
  async hardResetInvertedDTRWebUSB() {
    await this.runSignalSequence([
      { dtr: true, rts: true, delayMs: 100 },
      { dtr: false, rts: false, delayMs: 50 },
      { dtr: true, delayMs: 200 },
    ]);
  }

  /**
   * @name hardResetInvertedRTSWebUSB
   * Only RTS inverted for WebUSB (Android)
   */
  async hardResetInvertedRTSWebUSB() {
    await this.runSignalSequence([
      { dtr: false, rts: false, delayMs: 100 },
      { dtr: true, rts: true, delayMs: 50 },
      { dtr: false, delayMs: 200 },
    ]);
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

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    // Detect if this is a USB-Serial chip (needs different sync approach)
    const isUSBSerialChip = !isUSBJTAGSerial && !isEspressifUSB;

    // WebUSB (Android) uses different reset methods than Web Serial (Desktop)
    if (this.isWebUSB()) {
      // For USB-Serial chips (CP2102, CH340, etc.), try inverted strategies first

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
            fn: async () => {
              return await self.hardResetUSBJTAGSerial();
            },
          });

          // Strategy 2: USB-JTAG/Serial Inverted DTR (works in JTAG mode)
          resetStrategies.push({
            name: "USB-JTAG/Serial Inverted DTR (WebUSB) - ESP32-S2",
            fn: async () => {
              return await self.hardResetUSBJTAGSerialInvertedDTRWebUSB();
            },
          });

          // Strategy 3: UnixTight (CDC fallback)
          resetStrategies.push({
            name: "UnixTight (WebUSB) - ESP32-S2 CDC",
            fn: async () => {
              return await self.hardResetUnixTight();
            },
          });

          // Strategy 4: Classic reset (CDC fallback)
          resetStrategies.push({
            name: "Classic (WebUSB) - ESP32-S2 CDC",
            fn: async () => {
              return await self.hardResetClassic();
            },
          });
        } else {
          // Other USB-JTAG chips: Try Inverted DTR first - works best for ESP32-H2 and other JTAG chips
          resetStrategies.push({
            name: "USB-JTAG/Serial Inverted DTR (WebUSB)",
            fn: async () => {
              return await self.hardResetUSBJTAGSerialInvertedDTRWebUSB();
            },
          });
          resetStrategies.push({
            name: "USB-JTAG/Serial (WebUSB)",
            fn: async () => {
              return await self.hardResetUSBJTAGSerial();
            },
          });
          resetStrategies.push({
            name: "Inverted DTR Classic (WebUSB)",
            fn: async () => {
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
            fn: async () => {
              return await self.hardResetUnixTight();
            },
          });
          resetStrategies.push({
            name: "Classic (WebUSB) - CH34x",
            fn: async () => {
              return await self.hardResetClassic();
            },
          });
          resetStrategies.push({
            name: "Inverted Both (WebUSB) - CH34x",
            fn: async () => {
              return await self.hardResetInvertedWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted RTS (WebUSB) - CH34x",
            fn: async () => {
              return await self.hardResetInvertedRTSWebUSB();
            },
          });
          resetStrategies.push({
            name: "Inverted DTR (WebUSB) - CH34x",
            fn: async () => {
              return await self.hardResetInvertedDTRWebUSB();
            },
          });
        } else if (isCP2102) {
          // CP2102: UnixTight works best (tested and confirmed)
          // Try it first, then fallback to other strategies

          resetStrategies.push({
            name: "UnixTight (WebUSB) - CP2102",
            fn: async () => {
              return await self.hardResetUnixTight();
            },
          });

          resetStrategies.push({
            name: "Classic (WebUSB) - CP2102",
            fn: async () => {
              return await self.hardResetClassic();
            },
          });

          resetStrategies.push({
            name: "Inverted Both (WebUSB) - CP2102",
            fn: async () => {
              return await self.hardResetInvertedWebUSB();
            },
          });

          resetStrategies.push({
            name: "Inverted RTS (WebUSB) - CP2102",
            fn: async () => {
              return await self.hardResetInvertedRTSWebUSB();
            },
          });

          resetStrategies.push({
            name: "Inverted DTR (WebUSB) - CP2102",
            fn: async () => {
              return await self.hardResetInvertedDTRWebUSB();
            },
          });
        } else {
          // For other USB-Serial chips, try UnixTight first, then multiple strategies
          resetStrategies.push({
            name: "UnixTight (WebUSB)",
            fn: async () => {
              return await self.hardResetUnixTight();
            },
          });
          resetStrategies.push({
            name: "Classic (WebUSB)",
            fn: async function () {
              return await self.hardResetClassic();
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

      // Add general fallback strategies only for Native USB chips (not USB-Serial)
      // and only for chips not already handled by specific blocks above
      if (
        !isUSBSerialChip &&
        !isCP2102 &&
        !isESP32S2NativeUSB &&
        !isUSBJTAGSerial
      ) {
        // Classic reset (for chips not handled above)
        if (portInfo.usbVendorId !== 0x1a86) {
          resetStrategies.push({
            name: "Classic (WebUSB)",
            fn: async function () {
              return await self.hardResetClassic();
            },
          });
        }

        // UnixTight reset (sets DTR/RTS simultaneously)
        resetStrategies.push({
          name: "UnixTight (WebUSB)",
          fn: async function () {
            return await self.hardResetUnixTight();
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
        if (!isEspressifUSB) {
          resetStrategies.push({
            name: "USB-JTAG/Serial fallback (WebUSB)",
            fn: async function () {
              return await self.hardResetUSBJTAGSerial();
            },
          });
        }
      }
    } else {
      // Strategy: USB-JTAG/Serial reset
      if (isUSBJTAGSerial || isEspressifUSB) {
        resetStrategies.push({
          name: "USB-JTAG/Serial",
          fn: async function () {
            return await self.hardResetUSBJTAGSerial();
          },
        });
      }

      // Strategy: UnixTight reset
      resetStrategies.push({
        name: "UnixTight",
        fn: async function () {
          return await self.hardResetUnixTight();
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
          this.logger.debug(
            `Port disconnected, skipping ${strategy.name} reset`,
          );
          continue;
        }

        // Clear abandon flag before starting new strategy
        this._abandonCurrentOperation = false;

        await strategy.fn();

        // Try to sync after reset
        // USB-Serial / native USB chips needs different sync approaches

        if (isUSBSerialChip) {
          // USB-Serial chips: Use timeout strategy (2 seconds)
          //          this.logger.log(`USB-Serial chip detected, using sync with timeout.`);
          const syncSuccess = await this.syncWithTimeout(2000);

          if (syncSuccess) {
            // Sync succeeded
            this.logger.log(
              `Connected USB Serial successfully with ${strategy.name} reset.`,
            );
            return;
          } else {
            throw new Error("Sync timeout or abandoned");
          }
        } else {
          // Native USB chips
          // Note: We use Promise.race with sync() directly instead of syncWithTimeout()
          // because syncWithTimeout causes CDC/JTAG devices to hang for unknown reasons.
          // The abandon flag in readPacket() prevents overlapping I/O.
          //          this.logger.log(`Native USB chip detected, using CDC/JTAG sync.`);
          const syncPromise = this.sync();
          const timeoutPromise = new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error("Sync timeout")), 1000),
          );

          try {
            await Promise.race([syncPromise, timeoutPromise]);
            // Sync succeeded
            this.logger.debug(
              `Connected CDC/JTAG successfully with ${strategy.name} reset.`,
            );
            return;
          } catch {
            throw new Error("Sync timeout or abandoned");
          }
        }
      } catch (error) {
        lastError = error as Error;
        //        this.logger.debug(
        //          `${strategy.name} reset failed: ${(error as Error).message}`,
        //        );

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

    // All strategies failed - reset abandon flag before throwing
    this._abandonCurrentOperation = false;

    throw new Error(
      `Couldn't sync to ESP. Try resetting manually. Last error: ${lastError?.message}`,
    );
  }

  /**
   * @name watchdogReset
   * Watchdog reset for ESP32-S2/S3/P4 with USB-OTG or USB-JTAG/Serial
   * Uses RTC watchdog timer to reset the chip - works when DTR/RTS signals are not available
   * This is an alias for rtcWdtResetChipSpecific() for backwards compatibility
   * Note: ESP32-C3, ESP32-C5, ESP32-C6 do NOT boot correctly after WDT reset
   */
  async watchdogReset() {
    await this.rtcWdtResetChipSpecific();
  }

  /**
   * RTC watchdog timer reset for ESP32-S2, ESP32-S3, ESP32-P4, and ESP32-S31
   * Uses specific registers for each chip family
   * Note: ESP32-C3 does NOT boot correctly after WDT reset
   * Note: ESP32-C5, ESP32-C6, ESP32-C61, ESP32-H2 do NOT support WDT reset (no usable RTC WDT path)
   */
  public async rtcWdtResetChipSpecific(): Promise<void> {
    this.logger.debug("Hard resetting with watchdog timer...");

    let WDTWPROTECT_REG: number;
    let WDTCONFIG0_REG: number;
    let WDTCONFIG1_REG: number;
    let WDT_WKEY: number;

    if (this.chipFamily === CHIP_FAMILY_ESP32S2) {
      WDTWPROTECT_REG = ESP32S2_RTC_CNTL_WDTWPROTECT_REG;
      WDTCONFIG0_REG = ESP32S2_RTC_CNTL_WDTCONFIG0_REG;
      WDTCONFIG1_REG = ESP32S2_RTC_CNTL_WDTCONFIG1_REG;
      WDT_WKEY = ESP32S2_RTC_CNTL_WDT_WKEY;
    } else if (this.chipFamily === CHIP_FAMILY_ESP32S3) {
      WDTWPROTECT_REG = ESP32S3_RTC_CNTL_WDTWPROTECT_REG;
      WDTCONFIG0_REG = ESP32S3_RTC_CNTL_WDTCONFIG0_REG;
      WDTCONFIG1_REG = ESP32S3_RTC_CNTL_WDTCONFIG1_REG;
      WDT_WKEY = ESP32S3_RTC_CNTL_WDT_WKEY;
    } else if (this.chipFamily === CHIP_FAMILY_ESP32P4) {
      // P4 uses LP_WDT (Low Power Watchdog Timer)
      WDTWPROTECT_REG = ESP32P4_RTC_CNTL_WDTWPROTECT_REG;
      WDTCONFIG0_REG = ESP32P4_RTC_CNTL_WDTCONFIG0_REG;
      WDTCONFIG1_REG = ESP32P4_RTC_CNTL_WDTCONFIG1_REG;
      WDT_WKEY = ESP32P4_RTC_CNTL_WDT_WKEY;
    } else if (this.chipFamily === CHIP_FAMILY_ESP32S31) {
      // S31 uses LP_WDT (Low Power Watchdog Timer)
      WDTWPROTECT_REG = ESP32S31_RTC_CNTL_WDTWPROTECT_REG;
      WDTCONFIG0_REG = ESP32S31_RTC_CNTL_WDTCONFIG0_REG;
      WDTCONFIG1_REG = ESP32S31_RTC_CNTL_WDTCONFIG1_REG;
      WDT_WKEY = ESP32S31_RTC_CNTL_WDT_WKEY;
    } else {
      throw new Error(
        `rtcWdtResetChipSpecific() is not supported for ${this.chipFamily}`,
      );
    }

    // Unlock watchdog registers
    await this.writeRegister(WDTWPROTECT_REG, WDT_WKEY, undefined, 0);

    // Set WDT timeout to 2000ms (matches Python esptool)
    await this.writeRegister(WDTCONFIG1_REG, 2000, undefined, 0);

    // Enable WDT: bit 31 = enable, bits 28-30 = stage, bit 8 = sys reset, bits 0-2 = prescaler
    const wdtConfig = (1 << 31) | (5 << 28) | (1 << 8) | 2;
    await this.writeRegister(WDTCONFIG0_REG, wdtConfig, undefined, 0);

    // Lock watchdog registers
    await this.writeRegister(WDTWPROTECT_REG, 0, undefined, 0);

    // Wait for reset to take effect
    await sleep(500);
  }

  /**
   * Reset device from bootloader mode to firmware mode
   * Automatically selects the correct reset strategy based on USB connection type
   * @param clearForceDownloadFlag - If true, clears the force download boot flag (USB-OTG only)
   * @returns true if port will change (USB-OTG), false otherwise
   */
  public async resetToFirmwareMode(
    clearForceDownloadFlag = true,
  ): Promise<boolean> {
    this.logger.debug("Resetting from bootloader to firmware mode...");

    try {
      // Detect USB connection type
      const isUsbJtagOrOtg = await this.detectUsbConnectionType();

      if (isUsbJtagOrOtg) {
        // USB-JTAG/OTG devices need special handling
        this.logger.debug("USB-JTAG/OTG detected - checking WDT reset support");

        // Get detailed USB mode information
        let usbMode: {
          mode: "uart" | "usb-jtag-serial" | "usb-otg";
          uartNo: number;
        };
        try {
          usbMode = await this.getUsbMode();
          this.logger.debug(
            `USB mode: ${usbMode.mode} (uartNo=${usbMode.uartNo})`,
          );
        } catch (err) {
          this.logger.debug(`Could not get USB mode: ${err}`);
          // Fall back to generic USB-JTAG/OTG handling
          usbMode = { mode: "usb-jtag-serial", uartNo: 0 };
        }

        // WDT reset is not needed for ESP32-C3
        // WDT reset is supported by: ESP32-S2, ESP32-S3, ESP32-P4
        // WDT reset is NOT supported by: ESP32-C5, ESP32-C6, ESP32-C61, ESP32-H2
        const supportsWdtReset =
          this.chipFamily === CHIP_FAMILY_ESP32S2 ||
          this.chipFamily === CHIP_FAMILY_ESP32S3 ||
          this.chipFamily === CHIP_FAMILY_ESP32P4 ||
          this.chipFamily === CHIP_FAMILY_ESP32S31;

        if (!supportsWdtReset) {
          this.logger.debug(
            `${this.chipName} does not support WDT reset - using classic reset instead`,
          );

          // Use classic reset for chips without WDT support
          await this.hardResetToFirmware();
          this.logger.debug("Classic reset to firmware complete");
          return false; // Port stays open
        }

        // WDT reset is supported - proceed with WDT reset logic
        this.logger.debug(
          `${this.chipName} supports WDT reset - using WDT reset strategy`,
        );

        // CRITICAL: WDT register writes require ROM (not stub) and baudrate 115200

        // If on stub, need to return to ROM first
        if (this.IS_STUB) {
          this.logger.debug("On stub - returning to ROM before WDT reset");

          // Change baudrate back to ROM baudrate if needed
          if (this.currentBaudRate !== ESP_ROM_BAUD) {
            this.logger.debug(
              `Changing baudrate from ${this.currentBaudRate} to ${ESP_ROM_BAUD}`,
            );
            await this.reconfigurePort(ESP_ROM_BAUD);
            this.currentBaudRate = ESP_ROM_BAUD;
            this.logger.debug("Baudrate changed to 115200");
          }

          // CRITICAL: Temporarily clear console mode flag so hardReset(true) works
          const wasInConsoleMode = this._consoleMode;
          this._consoleMode = false;

          // Reset to bootloader (ROM)
          await this.hardReset(true);
          await sleep(200);

          // Restore console mode flag
          this._consoleMode = wasInConsoleMode;

          // Sync with ROM
          await this.sync();
          this.IS_STUB = false;
          this.logger.debug("Now on ROM");
        } else {
          // Even if not on stub, ensure baudrate is 115200 for WDT register writes
          if (this.currentBaudRate !== ESP_ROM_BAUD) {
            this.logger.debug(
              `Not on stub, but baudrate is ${this.currentBaudRate} - changing to ${ESP_ROM_BAUD} for WDT reset`,
            );
            await this.reconfigurePort(ESP_ROM_BAUD);
            this.currentBaudRate = ESP_ROM_BAUD;
            this.logger.debug("Baudrate changed to 115200");
          }
        }

        // Clear force download boot flag if requested (USB-OTG only)
        if (clearForceDownloadFlag && usbMode.mode === "usb-otg") {
          const flagCleared = await this._clearForceDownloadBootIfNeeded();
          if (flagCleared) {
            this.logger.debug("Force download boot flag cleared");
          }
        }

        // Perform WDT reset to boot into firmware
        await this.rtcWdtResetChipSpecific();
        this.logger.debug("WDT reset performed - device will boot to firmware");

        // Check if port will change after WDT reset
        // USB-OTG (ESP32-S2/P4): Port always changes
        // USB-JTAG/Serial (ESP32-S3/C3/C5/C6/C61/H2/P4): Port may change depending on platform
        const portWillChange =
          usbMode.mode === "usb-otg" || usbMode.mode === "usb-jtag-serial";

        if (portWillChange) {
          this.logger.debug(
            `Port will change after WDT reset (${usbMode.mode}) - port reselection needed`,
          );
          return true;
        }

        return false;
      } else {
        // External serial chip - use classic reset to firmware
        this.logger.debug(
          "External serial chip detected - using classic reset",
        );

        await this.hardResetToFirmware();
        this.logger.debug("Classic reset to firmware complete");
        return false;
      }
    } catch (err) {
      this.logger.error(`Failed to reset to firmware mode: ${err}`);
      throw err;
    }
  }

  async hardReset(bootloader = false) {
    // In console mode, only allow simple hardware reset (no bootloader entry)
    if (this._consoleMode) {
      if (bootloader) {
        this.logger.debug(
          "Skipping bootloader reset - device is in console mode",
        );
        return;
      }
      // Simple hardware reset to restart firmware (IO0=HIGH)
      this.logger.debug("Performing hardware reset (console mode)...");
      await this.resetInConsoleMode();
      this.logger.debug("Hardware reset complete");
      return;
    }

    if (bootloader) {
      // Enter bootloader/flash mode
      if (this.port.getInfo().usbProductId === USB_JTAG_SERIAL_PID) {
        await this.hardResetUSBJTAGSerial();
        this.logger.debug("USB-JTAG/Serial reset to bootloader.");
      } else {
        await this.hardResetClassic();
        this.logger.debug("Classic reset to bootloader.");
      }
    } else {
      // Reset to firmware mode (exit bootloader)
      // Use intelligent reset strategy based on USB connection type
      this.logger.debug("Resetting to firmware mode...");

      // Detect USB connection type to choose correct reset method
      const isUsbJtagOrOtg = await this.detectUsbConnectionType();

      if (isUsbJtagOrOtg) {
        // USB-JTAG/OTG devices: Check if chip supports WDT reset
        // Only S2, S3, P4 support WDT reset correctly
        // C3, C5, C6, C61, H2 do NOT boot correctly after WDT reset
        const supportsWdtReset =
          this.chipFamily === CHIP_FAMILY_ESP32S2 ||
          this.chipFamily === CHIP_FAMILY_ESP32S3 ||
          this.chipFamily === CHIP_FAMILY_ESP32P4 ||
          this.chipFamily === CHIP_FAMILY_ESP32S31;

        if (supportsWdtReset) {
          this.logger.debug("USB-JTAG/OTG detected - using WDT reset");

          // Get USB mode details
          let usbMode: {
            mode: "uart" | "usb-jtag-serial" | "usb-otg";
            uartNo: number;
          };
          try {
            usbMode = await this.getUsbMode();
            this.logger.debug(
              `USB mode: ${usbMode.mode} (uartNo=${usbMode.uartNo})`,
            );
          } catch (err) {
            this.logger.debug(`Could not get USB mode: ${err}`);
            usbMode = { mode: "usb-jtag-serial", uartNo: 0 };
          }

          // Clear force download flag for USB-OTG devices
          if (usbMode.mode === "usb-otg") {
            try {
              const flagCleared = await this._clearForceDownloadBootIfNeeded();
              if (flagCleared) {
                this.logger.debug("Force download boot flag cleared");
              }
            } catch (err) {
              this.logger.debug(`Could not clear force download flag: ${err}`);
            }
          }

          // Perform WDT reset
          await this.rtcWdtResetChipSpecific();
          this.logger.debug(`${this.chipName}: WDT reset to firmware complete`);
          return;
        } else {
          // C3, C5, C6, etc. - use classic reset (like external serial chips)
          this.logger.debug(
            `${this.chipName} does not support WDT reset - using classic reset instead`,
          );
        }
      } else {
        // External serial chip: Use classic reset
        this.logger.debug(
          "External serial chip detected - using classic reset",
        );
      }

      // Classic reset: used for external serial chips and USB-JTAG chips that do not support WDT reset
      if (this.isWebUSB()) {
        // WebUSB: Use longer delays for better compatibility
        await this.setRTSWebUSB(true); // EN->LOW
        await sleep(200);
        await this.setRTSWebUSB(false);
        await sleep(200);
        this.logger.debug("Hard reset to firmware (WebUSB).");
      } else {
        // Web Serial: Standard reset
        await this.setRTS(true); // EN->LOW
        await sleep(100);
        await this.setRTS(false);
        this.logger.debug("Hard reset to firmware.");
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
          // Periodic timeout check to prevent hang on slow data
          if (Date.now() - startTime > timeout) {
            const waitingFor = partialPacket === null ? "header" : "content";
            throw new SlipReadError(
              "Timed out waiting for packet " + waitingFor,
            );
          }
          const byte = this._readByte()!;

          if (partialPacket === null) {
            // waiting for packet header
            if (byte == this.SLIP_END) {
              partialPacket = [];
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(byte));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid head of packet (" + toHex(byte) + ")",
              );
            }
          } else if (inEscape) {
            // part-way through escape sequence
            inEscape = false;
            if (byte == this.SLIP_ESC_END) {
              partialPacket.push(this.SLIP_END);
            } else if (byte == this.SLIP_ESC_ESC) {
              partialPacket.push(this.SLIP_ESC);
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(byte));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid SLIP escape (0xdb, " + toHex(byte) + ")",
              );
            }
          } else if (byte == this.SLIP_ESC) {
            // start of escape sequence
            inEscape = true;
          } else if (byte == this.SLIP_END) {
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
            partialPacket.push(byte);
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
        for (const byte of readBytes) {
          if (partialPacket === null) {
            // waiting for packet header
            if (byte == this.SLIP_END) {
              partialPacket = [];
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(byte));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid head of packet (" + toHex(byte) + ")",
              );
            }
          } else if (inEscape) {
            // part-way through escape sequence
            inEscape = false;
            if (byte == this.SLIP_ESC_END) {
              partialPacket.push(this.SLIP_END);
            } else if (byte == this.SLIP_ESC_ESC) {
              partialPacket.push(this.SLIP_ESC);
            } else {
              if (this.debug) {
                this.logger.debug("Read invalid data: " + toHex(byte));
                this.logger.debug(
                  "Remaining data in serial buffer: " +
                    hexFormatter(this._inputBuffer),
                );
              }
              throw new SlipReadError(
                "Invalid SLIP escape (0xdb, " + toHex(byte) + ")",
              );
            }
          } else if (byte == this.SLIP_ESC) {
            // start of escape sequence
            inEscape = true;
          } else if (byte == this.SLIP_END) {
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
            partialPacket.push(byte);
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

  async getC5CrystalFreqRomExpect(): Promise<number> {
    const reg = await this.readRegister(ESP32C5_PCR_SYSCLK_CONF_REG);
    return (
      (reg & ESP32C5_PCR_SYSCLK_XTAL_FREQ_V) >>> ESP32C5_PCR_SYSCLK_XTAL_FREQ_S
    );
  }

  async getC5CrystalFreqDetected(): Promise<number> {
    const UART_CLKDIV_MASK = 0xfffff;
    const uartDiv =
      (await this.readRegister(ESP32C5_UART_CLKDIV_REG)) & UART_CLKDIV_MASK;
    const estXtal = (ESP_ROM_BAUD * uartDiv) / 1e6;
    if (estXtal > 45) return 48;
    if (estXtal > 33) return 40;
    return 26;
  }

  async setBaudrate(baud: number) {
    const chipFamily = this._parent ? this._parent.chipFamily : this.chipFamily;

    if (!this.IS_STUB && chipFamily === CHIP_FAMILY_ESP32C5) {
      await this.setBaudrateC5Rom(baud);
    } else {
      try {
        const buffer = pack("<II", baud, this.IS_STUB ? ESP_ROM_BAUD : 0);
        await this.checkCommand(ESP_CHANGE_BAUDRATE, buffer);
      } catch (e) {
        this.logger.error(`Baudrate change error: ${e}`);
        throw new Error(
          `Unable to change the baud rate to ${baud}: No response from set baud rate command.`,
        );
      }
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
      this._parent.currentBaudRate = baud;
    } else {
      this.currentBaudRate = baud;
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

    this.logger.debug(`Changed baud rate to ${baud}`);
  }

  private async setBaudrateC5Rom(baud: number) {
    const crystalFreqRomExpect = await this.getC5CrystalFreqRomExpect();
    const crystalFreqDetect = await this.getC5CrystalFreqDetected();
    this.logger.log(
      `ROM expects crystal freq: ${crystalFreqRomExpect} MHz, detected ${crystalFreqDetect} MHz.`,
    );

    let baudRate = baud;
    if (crystalFreqDetect === 48 && crystalFreqRomExpect === 40) {
      baudRate = Math.trunc((baud * 40) / 48);
    } else if (crystalFreqDetect === 40 && crystalFreqRomExpect === 48) {
      baudRate = Math.trunc((baud * 48) / 40);
    }

    this.logger.log(`Changing baud rate to ${baudRate}...`);
    try {
      const buffer = pack("<II", baudRate, 0);
      await this.checkCommand(ESP_CHANGE_BAUDRATE, buffer);
    } catch (e) {
      this.logger.error(`Baudrate change error: ${e}`);
      throw new Error(
        `Unable to change the baud rate to ${baudRate}: No response from set baud rate command.`,
      );
    }
    this.logger.log("Changed.");
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
    } catch {
      //      this.logger.error(`Reconfigure port error`);
      //      throw new Error(`Unable to change the baud rate to ${baud}`);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const paddedData = padTo(new Uint8Array(binaryData), 4);
    binaryData = paddedData.buffer as ArrayBuffer;

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
    if (this.chipFamily == CHIP_FAMILY_ESP8266 && !this.IS_STUB) {
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
    this.logger.debug("Detecting Flash Size");

    const flashId = await this.flashId();
    const flashIdLowbyte = (flashId >> 16) & 0xff;

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
    this.logger.debug(
      `Loading stub for ${this.chipName}, revision: ${this.chipRevision}`,
    );
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
    this.logger.debug("Uploading stub...");
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
    this.logger.debug("Stub is now running...");
    const espStubLoader = new EspStubLoader(this.port, this.logger, this);

    // Try to autodetect the flash size.
    if (!skipFlashDetection) {
      await espStubLoader.detectFlashSize();
    }

    return espStubLoader;
  }

  __writer?: WritableStreamDefaultWriter<Uint8Array>;
  __writeChain: Promise<void> = Promise.resolve();

  private get _reader(): ReadableStreamDefaultReader<Uint8Array> | undefined {
    return this._parent ? this._parent._reader : this.__reader;
  }

  private set _reader(
    value: ReadableStreamDefaultReader<Uint8Array> | undefined,
  ) {
    if (this._parent) {
      this._parent._reader = value;
    } else {
      this.__reader = value;
    }
  }

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
      //      this.logger.debug("Port already closed, skipping disconnect");
      return;
    }

    // Wait for pending writes to complete
    try {
      await this._writeChain;
    } catch {
      //      this.logger.debug("Pending write error during disconnect");
    }

    // Release persistent writer before closing
    if (this._writer) {
      try {
        await this._writer.close();
        this._writer.releaseLock();
      } catch {
        //        this.logger.debug("Writer close/release error");
      }
      this._writer = undefined;
    } else {
      // No persistent writer exists, close stream directly
      // This path is taken when no writes have been queued
      try {
        const writer = this.port.writable.getWriter();
        await writer.close();
        writer.releaseLock();
      } catch {
        //        this.logger.debug("Direct writer close error");
      }
    }

    await new Promise((resolve) => {
      if (!this._reader) {
        resolve(undefined);
        return;
      }

      // Set a timeout to prevent hanging (important for node-usb)
      const timeout = setTimeout(() => {
        this.logger.debug("Disconnect timeout - forcing resolution");
        resolve(undefined);
      }, 1000);

      this.addEventListener(
        "disconnect",
        () => {
          clearTimeout(timeout);
          resolve(undefined);
        },
        { once: true },
      );

      // Only cancel if reader is still active
      try {
        this._reader.cancel();
      } catch {
        // Reader already released, resolve immediately
        clearTimeout(timeout);
        resolve(undefined);
      }
    });
    this.connected = false;

    // Close the port (important for node-usb adapter)
    try {
      await this.port.close();
      this.logger.debug("Port closed successfully");
    } catch (err) {
      this.logger.debug(`Port close error: ${err}`);
    }
  }

  /**
   * @name releaseReaderWriter
   * Release reader and writer locks without closing the port
   * Used when switching to console mode
   */
  async releaseReaderWriter() {
    if (this._parent) {
      await this._parent.releaseReaderWriter();
      return;
    }

    // Wait for pending writes to complete
    try {
      await this._writeChain;
    } catch {
      //      this.logger.debug("Pending write error during release");
    }

    // Release writer
    if (this._writer) {
      try {
        this._writer.releaseLock();
        this.logger.debug("Writer released");
      } catch (err) {
        this.logger.debug(`Writer release error: ${err}`);
      }
      this._writer = undefined;
    }

    // Cancel reader - let readLoop's finally block handle releaseLock()
    if (this._reader) {
      try {
        // Suppress disconnect event during console mode switching
        this._suppressDisconnect = true;

        // Cancel will cause readLoop to exit and call releaseLock() in its finally block
        await this._reader.cancel();
        this.logger.debug("Reader cancelled - waiting for readLoop to finish");

        // CRITICAL: Wait a bit for readLoop's finally block to complete
        // The finally block needs time to call releaseLock() and set _reader = undefined
        // This is much faster than waiting for browser to unlock (just waiting for JS execution)
        await sleep(50);

        this.logger.debug("ReadLoop cleanup should be complete");
      } catch (err) {
        this.logger.debug(`Reader cancel error: ${err}`);
      }
      // Don't call releaseLock() or set _reader to undefined here
      // Let readLoop's finally block handle it to avoid race conditions
    }
  }

  /**
   * @name resetToFirmware
   * Public method to reset device from bootloader to firmware for console mode
   * Automatically detects USB-JTAG/Serial and USB-OTG devices and performs appropriate reset
   * @returns true if reset was performed, false if not needed
   */
  public async resetToFirmware(): Promise<boolean> {
    return await this._resetToFirmwareIfNeeded();
  }

  /**
   * @name detectUsbConnectionType
   * Detect if device is using USB-JTAG/Serial or USB-OTG (not external serial chip)
   * Uses USB PID (Product ID) for reliable detection - does NOT require chipFamily
   * @returns true if USB-JTAG or USB-OTG, false if external serial chip
   */
  public async detectUsbConnectionType(): Promise<boolean> {
    // Use PID-based detection
    const portInfo = this.port.getInfo();
    const pid = portInfo.usbProductId;
    const vid = portInfo.usbVendorId;

    // Check if this is an Espressif device
    const isEspressif = vid === 0x303a;

    if (!isEspressif) {
      this.logger.debug("Not Espressif VID - external serial chip");
      return false;
    }

    // ESP32-S2/S3/C3/C5/C6/C61/H2/P4 USB-JTAG/OTG PIDs
    // According to official Espressif documentation:
    // https://docs.espressif.com/projects/esp-iot-solution/en/latest/usb/usb_overview/usb_device_const_COM.html
    // 0x0002 = ESP32-S2 USB-OTG, 0x0012 = ESP32-P4 USB-Serial-JTAG
    // 0x1001 = ESP32-S3, C3, C5, C6, C61, H2 USB-Serial-JTAG
    const usbJtagPids = [0x0002, 0x0012, 0x1001];
    const isUsbJtag = usbJtagPids.includes(pid || 0);

    this.logger.debug(
      `USB-JTAG/OTG detection: ${isUsbJtag ? "YES" : "NO"} (PID=0x${pid?.toString(16)})`,
    );

    return isUsbJtag;
  }

  public async getUsbMode(): Promise<{
    mode: "uart" | "usb-jtag-serial" | "usb-otg";
    uartNo: number;
  }> {
    const family = this._parent ? this._parent.chipFamily : this.chipFamily;
    const revision = this._parent
      ? (this._parent.chipRevision ?? 0)
      : (this.chipRevision ?? 0);

    let bufNoAddr: number | null = null;
    let jtagSerialVal: number | null = null;
    let otgVal: number | null = null;

    switch (family) {
      case CHIP_FAMILY_ESP32S2:
        bufNoAddr = ESP32S2_UARTDEV_BUF_NO;
        otgVal = ESP32S2_UARTDEV_BUF_NO_USB_OTG;
        break;
      case CHIP_FAMILY_ESP32S3:
        bufNoAddr = ESP32S3_UARTDEV_BUF_NO;
        jtagSerialVal = ESP32S3_UARTDEV_BUF_NO_USB_JTAG_SERIAL;
        otgVal = ESP32S3_UARTDEV_BUF_NO_USB_OTG;
        break;
      case CHIP_FAMILY_ESP32C3: {
        const bssAddr = revision < 101 ? 0x3fcdf064 : 0x3fcdf060;
        bufNoAddr = bssAddr + ESP32C3_BUF_UART_NO_OFFSET;
        jtagSerialVal = ESP32C3_UARTDEV_BUF_NO_USB_JTAG_SERIAL;
        break;
      }
      case CHIP_FAMILY_ESP32C5:
        bufNoAddr = ESP32C5_UARTDEV_BUF_NO;
        jtagSerialVal = ESP32C5_UARTDEV_BUF_NO_USB_JTAG_SERIAL;
        break;
      case CHIP_FAMILY_ESP32C6:
        bufNoAddr = ESP32C6_UARTDEV_BUF_NO;
        jtagSerialVal = ESP32C6_UARTDEV_BUF_NO_USB_JTAG_SERIAL;
        break;
      case CHIP_FAMILY_ESP32C61:
        bufNoAddr =
          revision <= 200
            ? ESP32C61_UARTDEV_BUF_NO_REV_LE2
            : ESP32C61_UARTDEV_BUF_NO_REV_GT2;
        jtagSerialVal =
          revision <= 200
            ? ESP32C61_UARTDEV_BUF_NO_USB_JTAG_SERIAL_REV_LE2
            : ESP32C61_UARTDEV_BUF_NO_USB_JTAG_SERIAL_REV_GT2;
        break;
      case CHIP_FAMILY_ESP32H2:
        bufNoAddr = ESP32H2_UARTDEV_BUF_NO;
        jtagSerialVal = ESP32H2_UARTDEV_BUF_NO_USB_JTAG_SERIAL;
        break;
      case CHIP_FAMILY_ESP32H4:
        bufNoAddr = ESP32H4_UARTDEV_BUF_NO;
        jtagSerialVal = ESP32H4_UARTDEV_BUF_NO_USB_JTAG_SERIAL;
        break;
      case CHIP_FAMILY_ESP32P4:
        bufNoAddr =
          revision < 300
            ? ESP32P4_UARTDEV_BUF_NO_REV0
            : ESP32P4_UARTDEV_BUF_NO_REV300;
        jtagSerialVal = ESP32P4_UARTDEV_BUF_NO_USB_JTAG_SERIAL;
        otgVal = ESP32P4_UARTDEV_BUF_NO_USB_OTG;
        break;
    }

    if (bufNoAddr === null) {
      return { mode: "uart", uartNo: 0 };
    }

    const uartNo = (await this.readRegister(bufNoAddr)) & 0xff;

    if (otgVal !== null && uartNo === otgVal) {
      this.logger.debug(`USB mode: USB-OTG (uartNo=${uartNo})`);
      return { mode: "usb-otg", uartNo };
    }
    if (jtagSerialVal !== null && uartNo === jtagSerialVal) {
      this.logger.debug(`USB mode: USB-JTAG/Serial (uartNo=${uartNo})`);
      return { mode: "usb-jtag-serial", uartNo };
    }

    this.logger.debug(`USB mode: UART (uartNo=${uartNo})`);
    return { mode: "uart", uartNo };
  }

  /**
   * Check if the current chip supports USB-JTAG or USB-OTG
   * @returns true if chip has native USB support (JTAG or OTG)
   */
  public supportsNativeUsb(): boolean {
    const family = this._parent ? this._parent.chipFamily : this.chipFamily;

    // Chips with USB-JTAG/Serial or USB-OTG support
    const usbChips = [
      CHIP_FAMILY_ESP32S2, // USB-OTG
      CHIP_FAMILY_ESP32S3, // USB-OTG + USB-JTAG/Serial
      CHIP_FAMILY_ESP32C3, // USB-JTAG/Serial
      CHIP_FAMILY_ESP32C5, // USB-JTAG/Serial
      CHIP_FAMILY_ESP32C6, // USB-JTAG/Serial
      CHIP_FAMILY_ESP32C61, // USB-JTAG/Serial
      CHIP_FAMILY_ESP32H2, // USB-JTAG/Serial
      CHIP_FAMILY_ESP32H4, // USB-JTAG/Serial
      CHIP_FAMILY_ESP32P4, // USB-OTG + USB-JTAG/Serial
    ];

    return usbChips.includes(family);
  }

  /**
   * @name _ensureStreamsReady
   * After a hardware reset, ensure port streams are available.
   * On WebUSB, recreates streams since they break after reset.
   * On Web Serial, waits for streams to become available.
   */
  private async _ensureStreamsReady(): Promise<void> {
    if (this.isWebUSB()) {
      try {
        await (
          this.port as unknown as { recreateStreams(): Promise<void> }
        ).recreateStreams();
        this.logger.debug("WebUSB streams recreated");

        let retries = 30;
        while (retries > 0 && !this.port.readable) {
          await sleep(100);
          retries--;
        }
        if (!this.port.readable) {
          throw new Error(
            "Readable stream not available after recreating streams",
          );
        }
        this.logger.debug("WebUSB streams are ready");
      } catch (err) {
        this.logger.error(`Failed to recreate WebUSB streams: ${err}`);
        this._consoleMode = false;
        throw err;
      }
    } else {
      let retries = 20;
      while (retries > 0 && !this.port.readable) {
        await sleep(100);
        retries--;
      }
      if (!this.port.readable) {
        this._consoleMode = false;
        throw new Error("Readable stream not available after reset");
      }
      this.logger.debug("Port streams are ready");
    }
  }

  /**
   * @name enterConsoleMode
   * Prepare device for console mode by resetting to firmware
   * Handles both USB-JTAG/OTG devices (closes port) and external serial chips (keeps port open)
   * @returns true if port was closed (USB-JTAG), false if port stays open (serial chip)
   */
  public async enterConsoleMode(): Promise<boolean> {
    // Check if port is open - if not, we need a new port selection
    if (!this.port.writable || !this.port.readable) {
      this.logger.debug("Port is not open - port selection needed");
      // Return true to signal that port selection is needed
      // The caller should handle port selection and try again
      return true;
    }

    // Re-detect USB connection type to ensure we have a definitive value
    let isUsbJtag: boolean;
    try {
      isUsbJtag = await this.detectUsbConnectionType();
      this.logger.debug(
        `USB connection type detected: ${isUsbJtag ? "USB-JTAG/OTG" : "External Serial Chip"}`,
      );

      // CRITICAL: Set the cached value so _resetToFirmwareIfNeeded() can use it
      this._isUsbJtagOrOtg = isUsbJtag;
    } catch (err) {
      // If detection fails, fall back to cached value or fail-fast
      if (this.isUsbJtagOrOtg === undefined) {
        throw new Error(
          `Cannot enter console mode: USB connection type unknown and detection failed: ${err}`,
        );
      }

      this.logger.debug(
        `USB detection failed, using cached value: ${this.isUsbJtagOrOtg}`,
      );
      isUsbJtag = this.isUsbJtagOrOtg;
    }

    // Set console mode flag BEFORE any operations
    this._consoleMode = true;

    if (isUsbJtag) {
      // USB-JTAG/OTG devices: Use reset which may close port
      const wasReset = await this._resetToFirmwareIfNeeded();
      if (wasReset) {
        return true; // port closed, caller must reopen
      }

      // Port stayed open (e.g. C3/C5/C6/H2 classic reset)
      await this._ensureStreamsReady();
      return false;
    } else {
      // External serial chip devices: Release locks and do simple reset
      try {
        await this.releaseReaderWriter();
        await sleep(100);
      } catch (err) {
        this.logger.debug(`Failed to release locks: ${err}`);
      }

      try {
        await this.hardResetToFirmware();
        this.logger.debug("Device reset to firmware mode");
      } catch (err) {
        this.logger.debug(`Could not reset device: ${err}`);
      }

      await this._ensureStreamsReady();
      return false;
    }
  }

  /**
   * @name _clearForceDownloadBootIfNeeded
   * Read and clear the force download boot flag if it is set
   * This should ONLY be called when on ROM (not stub) and before WDT reset
   * Clearing it on every connect causes issues with flash operations
   * Returns true if the flag was cleared, false if it was already clear
   */
  private async _clearForceDownloadBootIfNeeded(): Promise<boolean> {
    try {
      let regAddr: number;
      let mask: number;
      let chipName: string;

      // Get register address and mask for this chip
      if (this.chipFamily === CHIP_FAMILY_ESP32S2) {
        regAddr = ESP32S2_RTC_CNTL_OPTION1_REG;
        mask = ESP32S2_RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK;
        chipName = "ESP32-S2";
      } else if (this.chipFamily === CHIP_FAMILY_ESP32S3) {
        regAddr = ESP32S3_RTC_CNTL_OPTION1_REG;
        mask = ESP32S3_RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK;
        chipName = "ESP32-S3";
      } else if (this.chipFamily === CHIP_FAMILY_ESP32P4) {
        regAddr = ESP32P4_RTC_CNTL_OPTION1_REG;
        mask = ESP32P4_RTC_CNTL_FORCE_DOWNLOAD_BOOT_MASK;
        chipName = "ESP32-P4";
      } else {
        // Not a chip that needs this
        return false;
      }

      // Read current register value
      const currentValue = await this.readRegister(regAddr);
      this.logger.debug(
        `${chipName} force download boot register: 0x${currentValue.toString(16)} (mask: 0x${mask.toString(16)})`,
      );

      // Check if the flag is set
      const isFlagSet = (currentValue & mask) !== 0;

      if (isFlagSet) {
        this.logger.debug(
          `${chipName} force download boot flag is SET - clearing it`,
        );
        // Clear the flag by writing 0 to the masked bits
        await this.writeRegister(regAddr, 0, mask, 0);
        this.logger.debug(`${chipName} force download boot flag cleared`);
        return true;
      } else {
        this.logger.debug(
          `${chipName} force download boot flag is already CLEAR - no action needed`,
        );
        return false;
      }
    } catch (err) {
      this.logger.debug(`Error checking/clearing force download flag: ${err}`);
      return false;
    }
  }

  /**
   * @name _resetToFirmwareIfNeeded
   * Reset device from bootloader to firmware when switching to console mode
   * Detects USB-JTAG/Serial and USB-OTG devices and performs appropriate reset
   * @returns true if reconnect was performed, false otherwise
   */
  private async _resetToFirmwareIfNeeded(): Promise<boolean> {
    // Detect if we need WDT reset (USB-JTAG/OTG) or classic reset
    const isUsbJtagOrOtg = await this.detectUsbConnectionType();
    try {
      // Check if port is open - if not, assume device is already in firmware mode
      if (!this.port.writable || !this.port.readable) {
        this.logger.debug(
          "Port is not open - assuming device is already in firmware mode",
        );
        return false;
      }

      if (isUsbJtagOrOtg) {
        // USB-JTAG/OTG: DON'T release reader/writer before WDT reset
        // The WDT reset needs active communication to send register write commands
        // The port will close automatically after the WDT reset anyway
        this.logger.debug(
          "USB-JTAG/OTG: Keeping reader/writer active for WDT reset",
        );
      } else {
        // External serial chip: Release reader/writer before classic reset
        await this.releaseReaderWriter();
        this.logger.debug(
          "External serial: Reader/writer released before reset",
        );
      }

      // Use the new resetToFirmwareMode method which handles all the logic
      const portWillChange = await this.resetToFirmwareMode(true);

      if (portWillChange) {
        this.logger.debug(
          `${this.chipName}: Port will change after WDT reset - user must reselect port`,
        );

        // Dispatch event to signal port change
        this.dispatchEvent(
          new CustomEvent("usb-otg-port-change", {
            detail: {
              chipName: this.chipName,
              message: `${this.chipName} USB port changed after reset. Please select the new port.`,
              reason: "wdt-reset-to-firmware",
            },
          }),
        );

        return true;
      } else {
        // Port stays the same - release reader/writer now if not already done
        if (isUsbJtagOrOtg) {
          await this.releaseReaderWriter();
          this.logger.debug("Reader/writer released after reset");
        }
        return false;
      }
    } catch (err) {
      this.logger.error(`Reset to firmware mode failed: ${err}`);

      // For USB-JTAG/OTG, the port is likely dead after a failed reset
      // For external serial, the port is usually still fine
      if (isUsbJtagOrOtg) {
        this.logger.debug(
          "Forcing port reselection due to USB-JTAG/OTG reset failure",
        );
        return true;
      }
      this.logger.debug(
        "External serial reset failed, but port should still be usable",
      );
      return false;
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
      const savedBaudRate = this.currentBaudRate;

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
        this.logger.debug("Port closed");
      } catch (err) {
        this.logger.debug(`Port close error: ${err}`);
      }

      // Open the port
      this.logger.debug("Opening port...");
      try {
        await this.port.open({ baudRate: ESP_ROM_BAUD });
        this.connected = true;
        this.currentBaudRate = ESP_ROM_BAUD;
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

      // Power on flash for ESP32-P4 Rev 301 (must be done before loading stub)
      if (
        this.chipFamily === CHIP_FAMILY_ESP32P4 &&
        this.chipRevision === 301
      ) {
        await this.powerOnFlash();
      }

      // Load stub
      const stubLoader = await this.runStub(true);
      this.logger.debug("Stub loaded");

      // Restore baudrate if it was changed
      if (savedBaudRate !== ESP_ROM_BAUD) {
        await stubLoader.setBaudrate(savedBaudRate);

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
   * @name reconnectToBootloader
   * Close and reopen the port, then reset ESP to bootloader mode
   * This is needed after Improv or other operations that leave ESP in firmware mode
   */
  async reconnectToBootloader(): Promise<void> {
    if (this._parent) {
      await this._parent.reconnectToBootloader();
      return;
    }

    try {
      this.logger.log("Reconnecting to bootloader mode...");

      // Clear console mode flag when reconnecting to bootloader
      this._consoleMode = false;

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
        this.logger.debug("Port closed");
      } catch (err) {
        this.logger.debug(`Port close error: ${err}`);
      }

      // Open the port
      this.logger.debug("Opening port...");
      try {
        await this.port.open({ baudRate: ESP_ROM_BAUD });
        this.connected = true;
        this.currentBaudRate = ESP_ROM_BAUD;
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

      // Reset chip info and stub state
      this.__chipFamily = undefined;
      this.chipName = "Unknown Chip";
      this.chipRevision = null;
      this.chipVariant = null;
      this.IS_STUB = false;

      // Start read loop
      if (!this._parent) {
        this.__inputBuffer = [];
        this.__inputBufferReadIndex = 0;
        this.__totalBytesRead = 0;
        this.readLoop();
      }

      // Wait for readLoop to start
      await sleep(100);

      // Reset to bootloader mode using multiple strategies
      await this.connectWithResetStrategies();

      // Detect chip type
      await this.detectChip();

      this.logger.debug(`Reconnected to bootloader: ${this.chipName}`);
    } catch (err) {
      // Ensure flag is reset on error
      this._isReconfiguring = false;
      throw err;
    }
  }

  /**
   * @name exitConsoleMode
   * Exit console mode and return to bootloader
   * For ESP32-S2, uses reconnectToBootloader which will trigger port change
   * @returns true if manual reconnection is needed (ESP32-S2), false otherwise
   */
  async exitConsoleMode(): Promise<boolean> {
    if (this._parent) {
      return await this._parent.exitConsoleMode();
    }

    // Clear console mode flag
    this._consoleMode = false;

    // Check if this is a USB-OTG device (ESP32-S2 or ESP32-P4)
    const isUsbOtgChip =
      this.chipFamily === CHIP_FAMILY_ESP32S2 ||
      this.chipFamily === CHIP_FAMILY_ESP32P4;

    // For USB-OTG chips: if _isUsbJtagOrOtg is undefined, try to detect it
    // If detection fails or is undefined, assume USB-JTAG/OTG (conservative/safe path)
    let isUsbJtagOrOtg = this._isUsbJtagOrOtg;
    if (isUsbOtgChip && isUsbJtagOrOtg === undefined) {
      try {
        isUsbJtagOrOtg = await this.detectUsbConnectionType();
      } catch (err) {
        this.logger.debug(
          `USB detection failed, assuming USB-JTAG/OTG for ${this.chipName}: ${err}`,
        );
        isUsbJtagOrOtg = true; // Conservative fallback
      }
    }

    if (isUsbOtgChip && isUsbJtagOrOtg) {
      // USB-OTG devices: Need to reset to bootloader, which will cause port change
      this.logger.debug(`${this.chipName} USB: Resetting to bootloader mode`);

      // Perform hardware reset to bootloader (GPIO0=LOW)
      // This will cause the port to change from CDC (firmware) to JTAG (bootloader)
      try {
        await this.hardResetClassic();
        this.logger.debug("Reset to bootloader initiated");
      } catch (err) {
        this.logger.debug(`Reset error: ${err}`);
      }

      // Wait for reset to complete and port to change
      await sleep(500);

      this.logger.debug(
        `${this.chipName}: Port changed. Please select the bootloader port.`,
      );

      // Dispatch event to signal port change
      this.dispatchEvent(
        new CustomEvent("usb-otg-port-change", {
          detail: {
            chipName: this.chipName,
            message: `${this.chipName}: Port changed. Please select the bootloader port.`,
            reason: "exit-console-to-bootloader",
          },
        }),
      );

      // Port will change, so return true to indicate manual reconnection needed
      return true;
    }

    // For other devices, use standard reconnectToBootloader
    await this.reconnectToBootloader();
    return false; // No manual reconnection needed
  }

  /**
   * @name isConsoleResetSupported
   * Check if console reset is supported for this device
   * ESP32-S2 USB-JTAG/CDC does not support reset in console mode
   * because any reset causes USB port to be lost (hardware limitation)
   */
  isConsoleResetSupported(): boolean {
    if (this._parent) {
      return this._parent.isConsoleResetSupported();
    }

    // For ESP32-S2: if _isUsbJtagOrOtg is undefined, assume USB-JTAG/OTG (conservative)
    // This means console reset is NOT supported (safer default)
    const isS2UsbJtag =
      this.chipFamily === CHIP_FAMILY_ESP32S2 &&
      (this._isUsbJtagOrOtg === true || this._isUsbJtagOrOtg === undefined);
    return !isS2UsbJtag; // Not supported for ESP32-S2 USB-JTAG/CDC
  }

  /**
   * @name resetInConsoleMode
   * Reset device while in console mode (firmware mode)
   *
   * NOTE: For ESP32-S2 USB-JTAG/CDC, ANY reset (hardware or software) causes
   * the USB port to be lost because the device switches USB modes during reset.
   * This is a hardware limitation - use isConsoleResetSupported() to check first.
   */
  async resetInConsoleMode(): Promise<void> {
    if (this._parent) {
      return await this._parent.resetInConsoleMode();
    }

    if (!this.isConsoleResetSupported()) {
      this.logger.debug(
        "Simple Console reset not supported for ESP32-S2 USB-JTAG/CDC - using exitConsoleMode to enter bootloader",
      );
      await this.exitConsoleMode();
      this.logger.debug(
        "S2 now in bootloader mode - caller must do syncAndWdtReset on new port, then reconnect console",
      );
      return;
    }

    // For other devices: Use standard firmware reset
    try {
      this.logger.debug("Resetting device in console mode");
      await this.hardResetToFirmware();
      this.logger.debug("Device reset complete");
    } catch (err) {
      this.logger.error(`Reset failed: ${err}`);
      throw err;
    }
  }

  /**
   * @name syncAndWdtReset
   * Open a new bootloader port, sync with ROM (no stub, no reset strategies), and fire WDT reset.
   * This is used for ESP32-S2 USB-OTG devices which require WDT reset to switch modes.
   * After WDT reset the port will re-enumerate again.
   * The user must select the new port after this method is called.
   * @param newPort - The bootloader port selected by the user
   */
  async syncAndWdtReset(newPort: SerialPort): Promise<void> {
    if (this._parent) {
      await this._parent.syncAndWdtReset(newPort);
      return;
    }

    this.port = newPort;
    this.connected = false;
    this.IS_STUB = false;
    this.__inputBuffer = [];
    this.__inputBufferReadIndex = 0;
    this.__totalBytesRead = 0;

    this.logger.debug("Opening bootloader port at 115200...");
    await this.port.open({ baudRate: ESP_ROM_BAUD });
    this.connected = true;
    this.currentBaudRate = ESP_ROM_BAUD;

    // Start read loop
    this.readLoop();
    await sleep(100);

    // Sync with ROM only - no reset strategies, device is already in bootloader
    this.logger.debug("Syncing with bootloader ROM...");
    await this.sync();
    this.logger.debug("Bootloader sync OK, no stub");

    // Fire WDT reset → device boots into firmware
    this.logger.debug("Firing WDT reset...");
    await this.rtcWdtResetChipSpecific();
    this.logger.debug("WDT reset fired - device will boot to firmware");
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
    // 14 bytes length including delimiter SLIP_END (0xC0) bytes.
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
   * @param options - Optional parameters for advanced control
   *   - chunkSize: Amount of data to request from ESP in one command (bytes)
   *   - blockSize: Size of each data block sent by ESP (bytes)
   *   - maxInFlight: Maximum unacknowledged bytes (bytes)
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
    options?: {
      chunkSize?: number;
      blockSize?: number;
      maxInFlight?: number;
    },
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
    if (options?.chunkSize !== undefined) {
      // Use user-provided chunkSize if in advanced mode
      CHUNK_SIZE = options.chunkSize;
      this.logger.log(
        `Using custom chunk size: 0x${CHUNK_SIZE.toString(16)} bytes`,
      );
    } else if (this.isWebUSB()) {
      // WebUSB: Use smaller chunks to avoid SLIP timeout issues
      CHUNK_SIZE = 0x4 * 0x1000; // 4KB = 16384 bytes
    } else {
      // Web Serial: Use larger chunks for better performance
      CHUNK_SIZE = 0x40 * 0x1000;
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

          if (
            options?.blockSize !== undefined &&
            options?.maxInFlight !== undefined
          ) {
            // Use user-provided values if in advanced mode
            blockSize = options.blockSize;
            maxInFlight = options.maxInFlight;
            if (retryCount === 0) {
              this.logger.debug(
                `Using custom parameters: blockSize=${blockSize}, maxInFlight=${maxInFlight}`,
              );
            }
          } else if (this.isWebUSB()) {
            // WebUSB (Android): All devices use adaptive speed
            // All have maxTransferSize=64, baseBlockSize=31
            const maxTransferSize =
              (this.port as WebUSBSerialPort).maxTransferSize || 64;
            const baseBlockSize = Math.floor((maxTransferSize - 2) / 2); // 31 bytes

            // Use current adaptive multipliers (initialized at start of readFlash)
            blockSize = baseBlockSize * this._adaptiveBlockMultiplier;
            maxInFlight = baseBlockSize * this._adaptiveMaxInFlightMultiplier;
          } else if (this._isCP210x) {
            // Silicon Labs CP210x on Windows: the VCP driver has a small
            // receive buffer (~512 bytes typical) and drops bytes when the
            // stub bursts large SLIP packets. Use a conservative block size
            // matching the upstream esptool.py default and keep maxInFlight
            // small enough that the driver can always drain in time.
            blockSize = 1024;
            maxInFlight = 2048;
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
                  `${err.message} at byte 0x${resp.length.toString(16)}`,
                );

                // Send empty SLIP frame to abort the stub's read operation
                // The stub expects 4 bytes (ACK), if we send less it will break out
                try {
                  // Send SLIP frame with no data (just delimiters)
                  const abortFrame = [this.SLIP_END, this.SLIP_END]; // Empty SLIP frame
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
              this.logger.debug(
                `Cleared buffer and retrying (attempt ${retryCount}/${MAX_RETRIES})...`,
              );
              // Continue to retry the same chunk (will send NEW read command)
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
   * @name eraseFlash
   * Erase entire flash chip
   */
  async eraseFlash() {
    await this.checkCommand(ESP_ERASE_FLASH, [], 0, CHIP_ERASE_TIMEOUT);
  }

  /**
   * @name eraseRegion
   * Erase a specific region of flash
   */
  async eraseRegion(offset: number, size: number) {
    // Validate inputs
    if (offset < 0) {
      throw new Error(`Invalid offset: ${offset} (must be non-negative)`);
    }
    if (size < 0) {
      throw new Error(`Invalid size: ${size} (must be non-negative)`);
    }

    // No-op for zero size
    if (size === 0) {
      this.logger.log("eraseRegion: size is 0, skipping erase");
      return;
    }

    // Check for sector alignment
    if (offset % FLASH_SECTOR_SIZE !== 0) {
      throw new Error(
        `Offset ${offset} (0x${offset.toString(16)}) is not aligned to flash sector size ${FLASH_SECTOR_SIZE} (0x${FLASH_SECTOR_SIZE.toString(16)})`,
      );
    }
    if (size % FLASH_SECTOR_SIZE !== 0) {
      throw new Error(
        `Size ${size} (0x${size.toString(16)}) is not aligned to flash sector size ${FLASH_SECTOR_SIZE} (0x${FLASH_SECTOR_SIZE.toString(16)})`,
      );
    }

    // Check for reasonable bounds (prevent wrapping in pack)
    const maxValue = 0xffffffff; // 32-bit unsigned max
    if (offset > maxValue) {
      throw new Error(`Offset ${offset} exceeds maximum value ${maxValue}`);
    }
    if (size > maxValue) {
      throw new Error(`Size ${size} exceeds maximum value ${maxValue}`);
    }
    // Check for wrap-around
    if (offset + size > maxValue) {
      throw new Error(
        `Region end (offset + size = ${offset + size}) exceeds maximum addressable range ${maxValue}`,
      );
    }

    const timeout = timeoutPerMb(ERASE_REGION_TIMEOUT_PER_MB, size);
    const buffer = pack("<II", offset, size);
    await this.checkCommand(ESP_ERASE_REGION, buffer, 0, timeout);
  }
}
