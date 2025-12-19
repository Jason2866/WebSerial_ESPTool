/**
 * @name slipEncode
 * Take an array buffer and return back a new array where
 * 0xdb is replaced with 0xdb 0xdd and 0xc0 is replaced with 0xdb 0xdc
 */
const slipEncode = (buffer) => {
    let encoded = [0xc0];
    for (const byte of buffer) {
        if (byte == 0xdb) {
            encoded = encoded.concat([0xdb, 0xdd]);
        }
        else if (byte == 0xc0) {
            encoded = encoded.concat([0xdb, 0xdc]);
        }
        else {
            encoded.push(byte);
        }
    }
    encoded.push(0xc0);
    return encoded;
};
/**
 * @name toByteArray
 * Convert a string to a byte array
 */
const toByteArray = (str) => {
    const byteArray = [];
    for (let i = 0; i < str.length; i++) {
        const charcode = str.charCodeAt(i);
        if (charcode <= 0xff) {
            byteArray.push(charcode);
        }
    }
    return byteArray;
};
const hexFormatter = (bytes) => "[" + bytes.map((value) => toHex(value)).join(", ") + "]";
const toHex = (value, size = 2) => {
    const hex = value.toString(16).toUpperCase();
    if (hex.startsWith("-")) {
        return "-0x" + hex.substring(1).padStart(size, "0");
    }
    else {
        return "0x" + hex.padStart(size, "0");
    }
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DETECTED_FLASH_SIZES = {
    0x12: "256KB",
    0x13: "512KB",
    0x14: "1MB",
    0x15: "2MB",
    0x16: "4MB",
    0x17: "8MB",
    0x18: "16MB",
    0x19: "32MB",
    0x1a: "64MB",
    0x1b: "128MB",
    0x1c: "256MB",
    0x20: "64MB",
    0x21: "128MB",
    0x22: "256MB",
    0x32: "256KB",
    0x33: "512KB",
    0x34: "1MB",
    0x35: "2MB",
    0x36: "4MB",
    0x37: "8MB",
    0x38: "16MB",
    0x39: "32MB",
    0x3a: "64MB",
};
const FLASH_WRITE_SIZE = 0x400;
const STUB_FLASH_WRITE_SIZE = 0x4000;
const FLASH_SECTOR_SIZE = 0x1000; // Flash sector size, minimum unit of erase.
const ESP_ROM_BAUD = 115200;
const USB_JTAG_SERIAL_PID = 0x1001;
const ESP8266_SPI_REG_BASE = 0x60000200;
const ESP8266_BASEFUSEADDR = 0x3ff00050;
const ESP8266_MACFUSEADDR = 0x3ff00050;
const ESP8266_SPI_USR_OFFS = 0x1c;
const ESP8266_SPI_USR1_OFFS = 0x20;
const ESP8266_SPI_USR2_OFFS = 0x24;
const ESP8266_SPI_MOSI_DLEN_OFFS = -1;
const ESP8266_SPI_MISO_DLEN_OFFS = -1;
const ESP8266_SPI_W0_OFFS = 0x40;
const ESP8266_UART_DATE_REG_ADDR = 0x60000078;
const ESP8266_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32_SPI_REG_BASE = 0x3ff42000;
const ESP32_BASEFUSEADDR = 0x3ff5a000;
const ESP32_MACFUSEADDR = 0x3ff5a000;
const ESP32_SPI_USR_OFFS = 0x1c;
const ESP32_SPI_USR1_OFFS = 0x20;
const ESP32_SPI_USR2_OFFS = 0x24;
const ESP32_SPI_MOSI_DLEN_OFFS = 0x28;
const ESP32_SPI_MISO_DLEN_OFFS = 0x2c;
const ESP32_SPI_W0_OFFS = 0x80;
const ESP32_UART_DATE_REG_ADDR = 0x60000078;
const ESP32_BOOTLOADER_FLASH_OFFSET = 0x1000;
const ESP32S2_SPI_REG_BASE = 0x3f402000;
const ESP32S2_BASEFUSEADDR = 0x3f41a000;
const ESP32S2_MACFUSEADDR = 0x3f41a044;
const ESP32S2_SPI_USR_OFFS = 0x18;
const ESP32S2_SPI_USR1_OFFS = 0x1c;
const ESP32S2_SPI_USR2_OFFS = 0x20;
const ESP32S2_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32S2_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32S2_SPI_W0_OFFS = 0x58;
const ESP32S2_UART_DATE_REG_ADDR = 0x60000078;
const ESP32S2_BOOTLOADER_FLASH_OFFSET = 0x1000;
const ESP32S3_SPI_REG_BASE = 0x60002000;
const ESP32S3_BASEFUSEADDR = 0x60007000;
const ESP32S3_MACFUSEADDR = 0x60007000 + 0x044;
const ESP32S3_SPI_USR_OFFS = 0x18;
const ESP32S3_SPI_USR1_OFFS = 0x1c;
const ESP32S3_SPI_USR2_OFFS = 0x20;
const ESP32S3_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32S3_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32S3_SPI_W0_OFFS = 0x58;
const ESP32S3_UART_DATE_REG_ADDR = 0x60000080;
const ESP32S3_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32C2_SPI_REG_BASE = 0x60002000;
const ESP32C2_BASEFUSEADDR = 0x60008800;
const ESP32C2_MACFUSEADDR = 0x60008800 + 0x044;
const ESP32C2_SPI_USR_OFFS = 0x18;
const ESP32C2_SPI_USR1_OFFS = 0x1c;
const ESP32C2_SPI_USR2_OFFS = 0x20;
const ESP32C2_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32C2_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32C2_SPI_W0_OFFS = 0x58;
const ESP32C2_UART_DATE_REG_ADDR = 0x6000007c;
const ESP32C2_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32C3_SPI_REG_BASE = 0x60002000;
const ESP32C3_BASEFUSEADDR = 0x60008800;
const ESP32C3_MACFUSEADDR = 0x60008800 + 0x044;
const ESP32C3_SPI_USR_OFFS = 0x18;
const ESP32C3_SPI_USR1_OFFS = 0x1c;
const ESP32C3_SPI_USR2_OFFS = 0x20;
const ESP32C3_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32C3_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32C3_SPI_W0_OFFS = 0x58;
const ESP32C3_UART_DATE_REG_ADDR = 0x6000007c;
const ESP32C3_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32C5_SPI_REG_BASE = 0x60003000;
const ESP32C5_BASEFUSEADDR = 0x600b4800;
const ESP32C5_MACFUSEADDR = 0x600b4800 + 0x044;
const ESP32C5_SPI_USR_OFFS = 0x18;
const ESP32C5_SPI_USR1_OFFS = 0x1c;
const ESP32C5_SPI_USR2_OFFS = 0x20;
const ESP32C5_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32C5_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32C5_SPI_W0_OFFS = 0x58;
const ESP32C5_UART_DATE_REG_ADDR = 0x6000007c;
const ESP32C5_BOOTLOADER_FLASH_OFFSET = 0x2000;
const ESP32C6_SPI_REG_BASE = 0x60003000;
const ESP32C6_BASEFUSEADDR = 0x600b0800;
const ESP32C6_MACFUSEADDR = 0x600b0800 + 0x044;
const ESP32C6_SPI_USR_OFFS = 0x18;
const ESP32C6_SPI_USR1_OFFS = 0x1c;
const ESP32C6_SPI_USR2_OFFS = 0x20;
const ESP32C6_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32C6_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32C6_SPI_W0_OFFS = 0x58;
const ESP32C6_UART_DATE_REG_ADDR = 0x6000007c;
const ESP32C6_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32C61_SPI_REG_BASE = 0x60003000;
const ESP32C61_BASEFUSEADDR = 0x600b4800;
const ESP32C61_MACFUSEADDR = 0x600b4800 + 0x044;
const ESP32C61_SPI_USR_OFFS = 0x18;
const ESP32C61_SPI_USR1_OFFS = 0x1c;
const ESP32C61_SPI_USR2_OFFS = 0x20;
const ESP32C61_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32C61_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32C61_SPI_W0_OFFS = 0x58;
const ESP32C61_UART_DATE_REG_ADDR = 0x6000007c;
const ESP32C61_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32H2_SPI_REG_BASE = 0x60003000;
const ESP32H2_BASEFUSEADDR = 0x600b0800;
const ESP32H2_MACFUSEADDR = 0x600b0800 + 0x044;
const ESP32H2_SPI_USR_OFFS = 0x18;
const ESP32H2_SPI_USR1_OFFS = 0x1c;
const ESP32H2_SPI_USR2_OFFS = 0x20;
const ESP32H2_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32H2_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32H2_SPI_W0_OFFS = 0x58;
const ESP32H2_UART_DATE_REG_ADDR = 0x6000007c;
const ESP32H2_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32H4_SPI_REG_BASE = 0x60099000;
const ESP32H4_BASEFUSEADDR = 0x600b1800;
const ESP32H4_MACFUSEADDR = 0x600b1800 + 0x044;
const ESP32H4_SPI_USR_OFFS = 0x18;
const ESP32H4_SPI_USR1_OFFS = 0x1c;
const ESP32H4_SPI_USR2_OFFS = 0x20;
const ESP32H4_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32H4_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32H4_SPI_W0_OFFS = 0x58;
const ESP32H4_UART_DATE_REG_ADDR = 0x60012000 + 0x7c;
const ESP32H4_BOOTLOADER_FLASH_OFFSET = 0x2000;
const ESP32H21_SPI_REG_BASE = 0x60003000;
const ESP32H21_BASEFUSEADDR = 0x600b4000;
const ESP32H21_MACFUSEADDR = 0x600b4000 + 0x044;
const ESP32H21_SPI_USR_OFFS = 0x18;
const ESP32H21_SPI_USR1_OFFS = 0x1c;
const ESP32H21_SPI_USR2_OFFS = 0x20;
const ESP32H21_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32H21_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32H21_SPI_W0_OFFS = 0x58;
const ESP32H21_UART_DATE_REG_ADDR = 0x6000007c;
const ESP32H21_BOOTLOADER_FLASH_OFFSET = 0x0;
const ESP32P4_SPI_REG_BASE = 0x5008d000;
const ESP32P4_BASEFUSEADDR = 0x5012d000;
const ESP32P4_EFUSE_BLOCK1_ADDR = ESP32P4_BASEFUSEADDR + 0x044;
const ESP32P4_MACFUSEADDR = 0x5012d000 + 0x044;
const ESP32P4_SPI_USR_OFFS = 0x18;
const ESP32P4_SPI_USR1_OFFS = 0x1c;
const ESP32P4_SPI_USR2_OFFS = 0x20;
const ESP32P4_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32P4_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32P4_SPI_W0_OFFS = 0x58;
const ESP32P4_UART_DATE_REG_ADDR = 0x500ca000 + 0x8c;
const ESP32P4_BOOTLOADER_FLASH_OFFSET = 0x2000;
const ESP32S31_SPI_REG_BASE = 0x20500000;
const ESP32S31_BASEFUSEADDR = 0x20715000;
const ESP32S31_MACFUSEADDR = 0x20715000 + 0x044;
const ESP32S31_SPI_USR_OFFS = 0x18;
const ESP32S31_SPI_USR1_OFFS = 0x1c;
const ESP32S31_SPI_USR2_OFFS = 0x20;
const ESP32S31_SPI_MOSI_DLEN_OFFS = 0x24;
const ESP32S31_SPI_MISO_DLEN_OFFS = 0x28;
const ESP32S31_SPI_W0_OFFS = 0x58;
const ESP32S31_UART_DATE_REG_ADDR = 0x2038a000 + 0x8c;
const ESP32S31_BOOTLOADER_FLASH_OFFSET = 0x2000;
const SYNC_PACKET = toByteArray("\x07\x07\x12 UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
const CHIP_DETECT_MAGIC_REG_ADDR = 0x40001000;
// Image Chip IDs (used by ESP32-C3 and later for chip detection)
// These values for the families are made up; nothing that esptool uses.
const CHIP_FAMILY_ESP8266 = 0x8266;
const CHIP_FAMILY_ESP32 = 0x32;
const CHIP_FAMILY_ESP32S2 = 0x3252;
const CHIP_FAMILY_ESP32S3 = 0x3253;
const CHIP_FAMILY_ESP32C2 = 0x32c2;
const CHIP_FAMILY_ESP32C3 = 0x32c3;
const CHIP_FAMILY_ESP32C5 = 0x32c5;
const CHIP_FAMILY_ESP32C6 = 0x32c6;
const CHIP_FAMILY_ESP32C61 = 0x32c61;
const CHIP_FAMILY_ESP32H2 = 0x3272;
const CHIP_FAMILY_ESP32H4 = 0x3274;
const CHIP_FAMILY_ESP32H21 = 0x3275;
const CHIP_FAMILY_ESP32P4 = 0x3280;
const CHIP_FAMILY_ESP32S31 = 0x3231;
const CHIP_ID_TO_INFO = {
    5: { name: "ESP32-C3", family: CHIP_FAMILY_ESP32C3 },
    9: { name: "ESP32-S3", family: CHIP_FAMILY_ESP32S3 },
    12: { name: "ESP32-C2", family: CHIP_FAMILY_ESP32C2 },
    13: { name: "ESP32-C6", family: CHIP_FAMILY_ESP32C6 },
    16: { name: "ESP32-H2", family: CHIP_FAMILY_ESP32H2 },
    18: { name: "ESP32-P4", family: CHIP_FAMILY_ESP32P4 },
    20: { name: "ESP32-C61", family: CHIP_FAMILY_ESP32C61 },
    23: { name: "ESP32-C5", family: CHIP_FAMILY_ESP32C5 },
    25: { name: "ESP32-H21", family: CHIP_FAMILY_ESP32H21 },
    28: { name: "ESP32-H4", family: CHIP_FAMILY_ESP32H4 },
    32: { name: "ESP32-S31", family: CHIP_FAMILY_ESP32S31 },
};
const CHIP_DETECT_MAGIC_VALUES = {
    0xfff0c101: { name: "ESP8266", family: CHIP_FAMILY_ESP8266 },
    0x00f01d83: { name: "ESP32", family: CHIP_FAMILY_ESP32 },
    0x000007c6: { name: "ESP32-S2", family: CHIP_FAMILY_ESP32S2 },
};
// Commands supported by ESP8266 ROM bootloader
const ESP_FLASH_BEGIN = 0x02;
const ESP_FLASH_DATA = 0x03;
const ESP_FLASH_END = 0x04;
const ESP_MEM_BEGIN = 0x05;
const ESP_MEM_END = 0x06;
const ESP_MEM_DATA = 0x07;
const ESP_SYNC = 0x08;
const ESP_WRITE_REG = 0x09;
const ESP_READ_REG = 0x0a;
const ESP_ERASE_FLASH = 0xd0;
const ESP_READ_FLASH = 0xd2;
const ESP_SPI_ATTACH = 0x0d;
const ESP_CHANGE_BAUDRATE = 0x0f;
const ESP_GET_SECURITY_INFO = 0x14;
const ESP_CHECKSUM_MAGIC = 0xef;
const ESP_FLASH_DEFL_BEGIN = 0x10;
const ESP_FLASH_DEFL_DATA = 0x11;
const ESP_FLASH_DEFL_END = 0x12;
const ROM_INVALID_RECV_MSG = 0x05;
const USB_RAM_BLOCK = 0x800;
// Timeouts
const DEFAULT_TIMEOUT = 3000;
const CHIP_ERASE_TIMEOUT = 150000; // timeout for full chip erase in ms
const MAX_TIMEOUT = CHIP_ERASE_TIMEOUT * 2; // longest any command can run in ms
const SYNC_TIMEOUT = 100; // timeout for syncing with bootloader in ms
const ERASE_REGION_TIMEOUT_PER_MB = 30000; // timeout (per megabyte) for erasing a region in ms
const MEM_END_ROM_TIMEOUT = 500;
const FLASH_READ_TIMEOUT = 100; // timeout for reading flash in ms
/**
 * @name timeoutPerMb
 * Scales timeouts which are size-specific
 */
const timeoutPerMb = (secondsPerMb, sizeBytes) => {
    const result = Math.floor(secondsPerMb * (sizeBytes / 0x1e6));
    if (result < DEFAULT_TIMEOUT) {
        return DEFAULT_TIMEOUT;
    }
    return result;
};
const getSpiFlashAddresses = (chipFamily) => {
    switch (chipFamily) {
        case CHIP_FAMILY_ESP32:
            return {
                regBase: ESP32_SPI_REG_BASE,
                baseFuse: ESP32_BASEFUSEADDR,
                macFuse: ESP32_MACFUSEADDR,
                usrOffs: ESP32_SPI_USR_OFFS,
                usr1Offs: ESP32_SPI_USR1_OFFS,
                usr2Offs: ESP32_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32_SPI_W0_OFFS,
                uartDateReg: ESP32_UART_DATE_REG_ADDR,
                flashOffs: ESP32_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32S2:
            return {
                regBase: ESP32S2_SPI_REG_BASE,
                baseFuse: ESP32S2_BASEFUSEADDR,
                macFuse: ESP32S2_MACFUSEADDR,
                usrOffs: ESP32S2_SPI_USR_OFFS,
                usr1Offs: ESP32S2_SPI_USR1_OFFS,
                usr2Offs: ESP32S2_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32S2_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32S2_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32S2_SPI_W0_OFFS,
                uartDateReg: ESP32S2_UART_DATE_REG_ADDR,
                flashOffs: ESP32S2_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32S3:
            return {
                regBase: ESP32S3_SPI_REG_BASE,
                usrOffs: ESP32S3_SPI_USR_OFFS,
                baseFuse: ESP32S3_BASEFUSEADDR,
                macFuse: ESP32S3_MACFUSEADDR,
                usr1Offs: ESP32S3_SPI_USR1_OFFS,
                usr2Offs: ESP32S3_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32S3_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32S3_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32S3_SPI_W0_OFFS,
                uartDateReg: ESP32S3_UART_DATE_REG_ADDR,
                flashOffs: ESP32S3_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP8266:
            return {
                regBase: ESP8266_SPI_REG_BASE,
                usrOffs: ESP8266_SPI_USR_OFFS,
                baseFuse: ESP8266_BASEFUSEADDR,
                macFuse: ESP8266_MACFUSEADDR,
                usr1Offs: ESP8266_SPI_USR1_OFFS,
                usr2Offs: ESP8266_SPI_USR2_OFFS,
                mosiDlenOffs: ESP8266_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP8266_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP8266_SPI_W0_OFFS,
                uartDateReg: ESP8266_UART_DATE_REG_ADDR,
                flashOffs: ESP8266_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32C2:
            return {
                regBase: ESP32C2_SPI_REG_BASE,
                baseFuse: ESP32C2_BASEFUSEADDR,
                macFuse: ESP32C2_MACFUSEADDR,
                usrOffs: ESP32C2_SPI_USR_OFFS,
                usr1Offs: ESP32C2_SPI_USR1_OFFS,
                usr2Offs: ESP32C2_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32C2_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32C2_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32C2_SPI_W0_OFFS,
                uartDateReg: ESP32C2_UART_DATE_REG_ADDR,
                flashOffs: ESP32C2_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32C3:
            return {
                regBase: ESP32C3_SPI_REG_BASE,
                baseFuse: ESP32C3_BASEFUSEADDR,
                macFuse: ESP32C3_MACFUSEADDR,
                usrOffs: ESP32C3_SPI_USR_OFFS,
                usr1Offs: ESP32C3_SPI_USR1_OFFS,
                usr2Offs: ESP32C3_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32C3_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32C3_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32C3_SPI_W0_OFFS,
                uartDateReg: ESP32C3_UART_DATE_REG_ADDR,
                flashOffs: ESP32C3_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32C5:
            return {
                regBase: ESP32C5_SPI_REG_BASE,
                baseFuse: ESP32C5_BASEFUSEADDR,
                macFuse: ESP32C5_MACFUSEADDR,
                usrOffs: ESP32C5_SPI_USR_OFFS,
                usr1Offs: ESP32C5_SPI_USR1_OFFS,
                usr2Offs: ESP32C5_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32C5_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32C5_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32C5_SPI_W0_OFFS,
                uartDateReg: ESP32C5_UART_DATE_REG_ADDR,
                flashOffs: ESP32C5_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32C6:
            return {
                regBase: ESP32C6_SPI_REG_BASE,
                baseFuse: ESP32C6_BASEFUSEADDR,
                macFuse: ESP32C6_MACFUSEADDR,
                usrOffs: ESP32C6_SPI_USR_OFFS,
                usr1Offs: ESP32C6_SPI_USR1_OFFS,
                usr2Offs: ESP32C6_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32C6_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32C6_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32C6_SPI_W0_OFFS,
                uartDateReg: ESP32C6_UART_DATE_REG_ADDR,
                flashOffs: ESP32C6_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32C61:
            return {
                regBase: ESP32C61_SPI_REG_BASE,
                baseFuse: ESP32C61_BASEFUSEADDR,
                macFuse: ESP32C61_MACFUSEADDR,
                usrOffs: ESP32C61_SPI_USR_OFFS,
                usr1Offs: ESP32C61_SPI_USR1_OFFS,
                usr2Offs: ESP32C61_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32C61_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32C61_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32C61_SPI_W0_OFFS,
                uartDateReg: ESP32C61_UART_DATE_REG_ADDR,
                flashOffs: ESP32C61_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32H2:
            return {
                regBase: ESP32H2_SPI_REG_BASE,
                baseFuse: ESP32H2_BASEFUSEADDR,
                macFuse: ESP32H2_MACFUSEADDR,
                usrOffs: ESP32H2_SPI_USR_OFFS,
                usr1Offs: ESP32H2_SPI_USR1_OFFS,
                usr2Offs: ESP32H2_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32H2_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32H2_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32H2_SPI_W0_OFFS,
                uartDateReg: ESP32H2_UART_DATE_REG_ADDR,
                flashOffs: ESP32H2_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32H4:
            return {
                regBase: ESP32H4_SPI_REG_BASE,
                baseFuse: ESP32H4_BASEFUSEADDR,
                macFuse: ESP32H4_MACFUSEADDR,
                usrOffs: ESP32H4_SPI_USR_OFFS,
                usr1Offs: ESP32H4_SPI_USR1_OFFS,
                usr2Offs: ESP32H4_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32H4_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32H4_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32H4_SPI_W0_OFFS,
                uartDateReg: ESP32H4_UART_DATE_REG_ADDR,
                flashOffs: ESP32H4_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32H21:
            return {
                regBase: ESP32H21_SPI_REG_BASE,
                baseFuse: ESP32H21_BASEFUSEADDR,
                macFuse: ESP32H21_MACFUSEADDR,
                usrOffs: ESP32H21_SPI_USR_OFFS,
                usr1Offs: ESP32H21_SPI_USR1_OFFS,
                usr2Offs: ESP32H21_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32H21_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32H21_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32H21_SPI_W0_OFFS,
                uartDateReg: ESP32H21_UART_DATE_REG_ADDR,
                flashOffs: ESP32H21_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32P4:
            return {
                regBase: ESP32P4_SPI_REG_BASE,
                baseFuse: ESP32P4_BASEFUSEADDR,
                macFuse: ESP32P4_MACFUSEADDR,
                usrOffs: ESP32P4_SPI_USR_OFFS,
                usr1Offs: ESP32P4_SPI_USR1_OFFS,
                usr2Offs: ESP32P4_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32P4_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32P4_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32P4_SPI_W0_OFFS,
                uartDateReg: ESP32P4_UART_DATE_REG_ADDR,
                flashOffs: ESP32P4_BOOTLOADER_FLASH_OFFSET,
            };
        case CHIP_FAMILY_ESP32S31:
            return {
                regBase: ESP32S31_SPI_REG_BASE,
                baseFuse: ESP32S31_BASEFUSEADDR,
                macFuse: ESP32S31_MACFUSEADDR,
                usrOffs: ESP32S31_SPI_USR_OFFS,
                usr1Offs: ESP32S31_SPI_USR1_OFFS,
                usr2Offs: ESP32S31_SPI_USR2_OFFS,
                mosiDlenOffs: ESP32S31_SPI_MOSI_DLEN_OFFS,
                misoDlenOffs: ESP32S31_SPI_MISO_DLEN_OFFS,
                w0Offs: ESP32S31_SPI_W0_OFFS,
                uartDateReg: ESP32S31_UART_DATE_REG_ADDR,
                flashOffs: ESP32S31_BOOTLOADER_FLASH_OFFSET,
            };
        default:
            return {
                regBase: -1,
                baseFuse: -1,
                macFuse: -1,
                usrOffs: -1,
                usr1Offs: -1,
                usr2Offs: -1,
                mosiDlenOffs: -1,
                misoDlenOffs: -1,
                w0Offs: -1,
                uartDateReg: -1,
                flashOffs: -1,
            };
    }
};
class SlipReadError extends Error {
    constructor(message) {
        super(message);
        this.name = "SlipReadError";
    }
}

const getStubCode = async (chipFamily, chipRevision) => {
    let stubcode;
    // Chips without stub support yet
    if (chipFamily == CHIP_FAMILY_ESP32H4 ||
        chipFamily == CHIP_FAMILY_ESP32H21 ||
        chipFamily == CHIP_FAMILY_ESP32S31) {
        return null;
    }
    if (chipFamily == CHIP_FAMILY_ESP32) {
        stubcode = await import('./esp32-D955RjN9.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32S2) {
        stubcode = await import('./esp32s2-CtqVheSJ.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32S3) {
        stubcode = await import('./esp32s3-CRbtB0QR.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP8266) {
        stubcode = await import('./esp8266-nEkNAo8K.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32C2) {
        stubcode = await import('./esp32c2-CJkxHDQi.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32C3) {
        stubcode = await import('./esp32c3-BhUHzH0o.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32C5) {
        stubcode = await import('./esp32c5-Chs0HtmA.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32C6) {
        stubcode = await import('./esp32c6-D6mPN6ut.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32C61) {
        stubcode = await import('./esp32c61-CQiYCWAs.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32H2) {
        stubcode = await import('./esp32h2-LsKJE9AS.js');
    }
    else if (chipFamily == CHIP_FAMILY_ESP32P4) {
        // ESP32-P4: Use esp32p4r3.json for Rev. 300+, esp32p4.json for older revisions
        if (chipRevision !== null && chipRevision !== undefined && chipRevision >= 300) {
            stubcode = await import('./esp32p4r3-CwiPecZW.js');
        }
        else {
            stubcode = await import('./esp32p4-7nWC-HiD.js');
        }
    }
    // Base64 decode the text and data
    return {
        ...stubcode,
        text: toByteArray(atob(stubcode.text)),
        data: toByteArray(atob(stubcode.data)),
    };
};

/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/


//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED$1               = 4;
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY              = 0;
const Z_TEXT                = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN$1             = 2;

/*============================================================================*/


function zero$1(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES    = 2;
/* The three kinds of block type */

const MIN_MATCH$1    = 3;
const MAX_MATCH$1    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES$1  = 29;
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS$1      = 256;
/* number of literal bytes 0..255 */

const L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES$1       = 30;
/* number of distance codes */

const BL_CODES$1      = 19;
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
/* maximum heap size */

const MAX_BITS$1      = 15;
/* All codes must not exceed MAX_BITS bits */

const Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK   = 256;
/* end of block literal code */

const REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =   /* extra bits for each length code */
  new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

const extra_dbits =   /* extra bits for each distance code */
  new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

const extra_blbits =  /* extra bits for each bit length code */
  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

const bl_order =
  new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree  = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree  = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code    = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code  = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length   = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist     = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


let static_l_desc;
let static_d_desc;
let static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



const d_code = (dist) => {

  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
};


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {

  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
};


const send_code = (s, c, tree) => {

  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
};


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {

  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {

  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */

  const tree            = desc.dyn_tree;
  const max_code        = desc.max_code;
  const stree           = desc.stat_desc.static_tree;
  const has_stree       = desc.stat_desc.has_stree;
  const extra           = desc.stat_desc.extra_bits;
  const base            = desc.stat_desc.extra_base;
  const max_length      = desc.stat_desc.max_length;
  let h;              /* heap index */
  let n, m;           /* iterate over the tree elements */
  let bits;           /* bit length */
  let xbits;          /* extra bits */
  let f;              /* frequency */
  let overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
};


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  let code = 0;              /* running code value */
  let bits;                  /* bit index */
  let n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    code = (code + bl_count[bits - 1]) << 1;
    next_code[bits] = code;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    let len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
};


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {

  let n;        /* iterates over tree elements */
  let bits;     /* bit counter */
  let length;   /* length value */
  let code;     /* code value */
  let dist;     /* distance index */
  const bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
};


/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {

  let n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES$1;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES$1; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) =>
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {

  const _n2 = n * 2;
  const _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
};

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */

  const v = s.heap[k];
  let j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
};


// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */

  let dist;           /* distance of matched string */
  let lc;             /* match length or unmatched char (if dist == 0) */
  let sx = 0;         /* running index in sym_buf */
  let code;           /* the code to send */
  let extra;          /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");

    } while (sx < s.sym_next);
  }

  send_code(s, END_BLOCK, ltree);
};


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */

  const tree     = desc.dyn_tree;
  const stree    = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems    = desc.stat_desc.elems;
  let n, m;          /* iterate over heap elements */
  let max_code = -1; /* largest code with non zero frequency */
  let node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
};


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {

  let max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
};


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f;
  let n;

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if ((block_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
};


let static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init$1 = (s) =>
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
};


/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  bi_windup(s);        /* align on byte boundary */
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align$1 = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  let max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block$1(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
};

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally$1 = (s, dist, lc) => {
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

  return (s.sym_next === s.sym_end);
};

var _tr_init_1  = _tr_init$1;
var _tr_stored_block_1 = _tr_stored_block$1;
var _tr_flush_block_1  = _tr_flush_block$1;
var _tr_tally_1 = _tr_tally$1;
var _tr_align_1 = _tr_align$1;

var trees = {
	_tr_init: _tr_init_1,
	_tr_stored_block: _tr_stored_block_1,
	_tr_flush_block: _tr_flush_block_1,
	_tr_tally: _tr_tally_1,
	_tr_align: _tr_align_1
};

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32 = (adler, buf, len, pos) => {
  let s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
};


var adler32_1 = adler32;

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
const makeTable = () => {
  let c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
};

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = new Uint32Array(makeTable());


const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;

  crc ^= -1;

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
};


var crc32_1 = crc32;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var messages = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var constants$2 = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  Z_BUF_ERROR:       -5,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;




/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1,
  Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$1,
  Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
  Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
  Z_UNKNOWN,
  Z_DEFLATED: Z_DEFLATED$2
} = constants$2;

/*============================================================================*/


const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
const MAX_WBITS$1 = 15;
/* 32K LZ77 window */
const DEF_MEM_LEVEL = 8;


const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
const LITERALS      = 256;
/* number of literal bytes 0..255 */
const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
const D_CODES       = 30;
/* number of distance codes */
const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
const MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

const PRESET_DICT = 0x20;

const INIT_STATE    =  42;    /* zlib header -> BUSY_STATE */
//#ifdef GZIP
const GZIP_STATE    =  57;    /* gzip header -> BUSY_STATE | EXTRA_STATE */
//#endif
const EXTRA_STATE   =  69;    /* gzip extra block -> NAME_STATE */
const NAME_STATE    =  73;    /* gzip file name -> COMMENT_STATE */
const COMMENT_STATE =  91;    /* gzip comment -> HCRC_STATE */
const HCRC_STATE    = 103;    /* gzip header CRC -> BUSY_STATE */
const BUSY_STATE    = 113;    /* deflate -> FINISH_STATE */
const FINISH_STATE  = 666;    /* stream complete */

const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
const BS_BLOCK_DONE     = 2; /* block flush performed */
const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

const err = (strm, errorCode) => {
  strm.msg = messages[errorCode];
  return errorCode;
};

const rank = (f) => {
  return ((f) * 2) - ((f) > 4 ? 9 : 0);
};

const zero = (buf) => {
  let len = buf.length; while (--len >= 0) { buf[len] = 0; }
};

/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */
const slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;

  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = (m >= wsize ? m - wsize : 0);
  } while (--n);
  n = wsize;
//#ifndef FASTEST
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = (m >= wsize ? m - wsize : 0);
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */
  } while (--n);
//#endif
};

/* eslint-disable new-cap */
let HASH_ZLIB = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;
// This hash causes less collisions, https://github.com/nodeca/pako/issues/135
// But breaks binary compatibility
//let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
let HASH = HASH_ZLIB;


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */
const flush_pending = (strm) => {
  const s = strm.state;

  //_tr_flush_bits(s);
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out  += len;
  s.pending_out  += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending      -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};


const flush_block_only = (s, last) => {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};


const put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
const putShortMSB = (s, b) => {

  //  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
};


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
const read_buf = (strm, buf, start, size) => {

  let len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
};


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
const longest_match = (s, cur_match) => {

  let chain_length = s.max_chain_length;      /* max hash chain length */
  let scan = s.strstart; /* current string */
  let match;                       /* matched string */
  let len;                           /* length of current match */
  let best_len = s.prev_length;              /* best match length so far */
  let nice_match = s.nice_match;             /* stop if match long enough */
  const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  const _win = s.window; // shortcut

  const wmask = s.w_mask;
  const prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  const strend = s.strstart + MAX_MATCH;
  let scan_end1  = _win[scan + best_len - 1];
  let scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
const fill_window = (s) => {

  const _w_size = s.w_size;
  let n, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */
const deflate_stored = (s, flush) => {

  /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

  /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */
    len = 65535/* MAX_STORED */;     /* maximum deflate stored block length */
    have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    if (s.strm.avail_out < have) {         /* need room for header */
      break;
    }
      /* maximum stored block length that will fit in avail_out: */
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;  /* bytes left in window */
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;   /* limit len to the input */
    }
    if (len > have) {
      len = have;             /* limit len to the output */
    }

    /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */
    if (len < min_block && ((len === 0 && flush !== Z_FINISH$3) ||
                        flush === Z_NO_FLUSH$2 ||
                        len !== left + s.strm.avail_in)) {
      break;
    }

    /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */
    last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);

    /* Replace the lengths in the dummy stored block with len. */
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;

    /* Write the stored block header bytes. */
    flush_pending(s.strm);

//#ifdef ZLIB_DEBUG
//    /* Update debugging counts for the data about to be copied. */
//    s->compressed_len += len << 3;
//    s->bits_sent += len << 3;
//#endif

    /* Copy uncompressed bytes from the window to next_out. */
    if (left) {
      if (left > len) {
        left = len;
      }
      //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }

    /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);

  /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */
  used -= s.strm.avail_in;    /* number of input bytes directly copied */
  if (used) {
    /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */
    if (used >= s.w_size) {  /* supplant the previous history */
      s.matches = 2;     /* clear hash */
      //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    }
    else {
      if (s.window_size - s.strstart <= used) {
        /* Slide the window down. */
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;   /* add a pending slide_hash() */
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* If the last block was written to next_out, then done. */
  if (last) {
    return BS_FINISH_DONE;
  }

  /* If flushing and all input has been consumed, then done. */
  if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 &&
    s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }

  /* Fill the window with any remaining input. */
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    /* Slide the window down. */
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    //zmemcpy(s->window, s->window + s->w_size, s->strstart);
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;       /* add a pending slide_hash() */
    }
    have += s.w_size;      /* more space now */
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */
  have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
  have = s.pending_buf_size - have > 65535/* MAX_STORED */ ? 65535/* MAX_STORED */ : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block ||
     ((left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 &&
     s.strm.avail_in === 0 && left <= have)) {
    len = left > have ? have : left;
    last = flush === Z_FINISH$3 && s.strm.avail_in === 0 &&
         len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }

  /* We've done all we can with the available input and output. */
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};


/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
const deflate_fast = (s, flush) => {

  let hash_head;        /* head of the hash chain */
  let bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
const deflate_slow = (s, flush) => {

  let hash_head;          /* head of hash chain */
  let bflush;              /* set if current block must be flushed */

  let max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
};


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
const deflate_rle = (s, flush) => {

  let bflush;            /* set if current block must be flushed */
  let prev;              /* byte at distance one to match */
  let scan, strend;      /* scan goes up to strend for length of run */

  const _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
const deflate_huff = (s, flush) => {

  let bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {

  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
const lm_init = (s) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED$2; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree  = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree    = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.sym_buf = 0;        /* buffer for distances and literals/lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.sym_next = 0;      /* running index in sym_buf */
  this.sym_end = 0;       /* symbol table full when sym_next reaches this */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */
const deflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || (s.status !== INIT_STATE &&
//#ifdef GZIP
                                s.status !== GZIP_STATE &&
//#endif
                                s.status !== EXTRA_STATE &&
                                s.status !== NAME_STATE &&
                                s.status !== COMMENT_STATE &&
                                s.status !== HCRC_STATE &&
                                s.status !== BUSY_STATE &&
                                s.status !== FINISH_STATE)) {
    return 1;
  }
  return 0;
};


const deflateResetKeep = (strm) => {

  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status =
//#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
//#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK$3;
};


const deflateReset = (strm) => {

  const ret = deflateResetKeep(strm);
  if (ret === Z_OK$3) {
    lm_init(strm.state);
  }
  return ret;
};


const deflateSetHeader = (strm, head) => {

  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR$2;
  }
  strm.state.gzhead = head;
  return Z_OK$3;
};


const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {

  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR$2;
  }
  let wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED || (windowBits === 8 && wrap !== 1)) {
    return err(strm, Z_STREAM_ERROR$2);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  const s = new DeflateState();

  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;     /* to pass state test in deflateReset() */

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->sym_buf = s->pending_buf + s->lit_bufsize;
  s.sym_buf = s.lit_bufsize;

  //s->sym_end = (s->lit_bufsize - 1) * 3;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
};

const deflateInit = (strm, level) => {

  return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};


/* ========================================================================= */
const deflate$2 = (strm, flush) => {

  if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }

  const s = strm.state;

  if (!strm.output ||
      (strm.avail_in !== 0 && !strm.input) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH$3)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
  }

  const old_flush = s.last_flush;
  s.last_flush = flush;

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$3;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$3) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* Write the header */
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    /* zlib header */
    let header = (Z_DEFLATED$2 + ((s.w_bits - 8) << 4)) << 8;
    let level_flags = -1;

    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= (level_flags << 6);
    if (s.strstart !== 0) { header |= PRESET_DICT; }
    header += 31 - (header % 31);

    putShortMSB(s, header);

    /* Save the adler32 of the preset dictionary: */
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    strm.adler = 1; // adler32(0L, Z_NULL, 0);
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#ifdef GZIP
  if (s.status === GZIP_STATE) {
    /* gzip header */
    strm.adler = 0;  //crc32(0L, Z_NULL, 0);
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) { // s->gzhead == Z_NULL
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    else {
      put_byte(s, (s.gzhead.text ? 1 : 0) +
                  (s.gzhead.hcrc ? 2 : 0) +
                  (!s.gzhead.extra ? 0 : 4) +
                  (!s.gzhead.name ? 0 : 8) +
                  (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 0xff);
      put_byte(s, (s.gzhead.time >> 8) & 0xff);
      put_byte(s, (s.gzhead.time >> 16) & 0xff);
      put_byte(s, (s.gzhead.time >> 24) & 0xff);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, s.gzhead.os & 0xff);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 0xff);
        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        // zmemcpy(s.pending_buf + s.pending,
        //    s.gzhead.extra + s.gzindex, copy);
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
        beg = 0;
        left -= copy;
      }
      // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
      //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      // zmemcpy(s->pending_buf + s->pending,
      //     s->gzhead->extra + s->gzindex, left);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
    }
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#endif

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE)) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) :
                 s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) :
                 s.strategy === Z_RLE ? deflate_rle(s, flush) :
                 configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$3;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      }
      else if (flush !== Z_BLOCK$1) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH$1) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$3;
      }
    }
  }

  if (flush !== Z_FINISH$3) { return Z_OK$3; }
  if (s.wrap <= 0) { return Z_STREAM_END$3; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};


const deflateEnd = (strm) => {

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const status = strm.state.status;

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
const deflateSetDictionary = (strm, dictionary) => {

  let dictLength = dictionary.length;

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const s = strm.state;
  const wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR$2;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$3;
};


var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$2;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/

var deflate_1$2 = {
	deflateInit: deflateInit_1,
	deflateInit2: deflateInit2_1,
	deflateReset: deflateReset_1,
	deflateResetKeep: deflateResetKeep_1,
	deflateSetHeader: deflateSetHeader_1,
	deflate: deflate_2$1,
	deflateEnd: deflateEnd_1,
	deflateSetDictionary: deflateSetDictionary_1,
	deflateInfo: deflateInfo
};

const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var assign = function (obj /*from1, from2, from3, ...*/) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// Join array of chunks to single array.
var flattenChunks = (chunks) => {
  // calculate data length
  let len = 0;

  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }

  // join chunks
  const result = new Uint8Array(len);

  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
};

var common = {
	assign: assign,
	flattenChunks: flattenChunks
};

// String encode/decode helpers


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
var string2buf = (str) => {
  if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }

  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper
const buf2binstring = (buf, len) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }

  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};


// convert array to string
var buf2string = (buf, max) => {
  const len = max || buf.length;

  if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }

  let i, out;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  const utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    let c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    let c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = (buf, max) => {

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

var strings = {
	string2buf: string2buf,
	buf2string: buf2string,
	utf8border: utf8border
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

var zstream = ZStream;

const toString$1 = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2,
  Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED: Z_DEFLATED$1
} = constants$2;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate$1(options) {
  this.options = common.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED$1,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY
  }, options || {});

  let opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new zstream();
  this.strm.avail_out = 0;

  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }

  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    let dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = deflate_1$2.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;

  if (this.ended) { return false; }

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString$1.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    // Make sure avail_out > 6 to avoid repeating markers
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    status = deflate_1$2.deflate(strm, _flush_mode);

    // Ended => flush and finish
    if (status === Z_STREAM_END$2) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = deflate_1$2.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK$2;
    }

    // Flush if out buffer full
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }

    // Flush if requested and has data
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK$2) {
    this.result = common.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

  return deflator.result;
}
var deflate_2 = deflate$1;

var deflate_1$1 = {
	deflate: deflate_2};

const { deflate} = deflate_1$1;
var deflate_1 = deflate;

const lut = {
    b: { u: DataView.prototype.getInt8, p: DataView.prototype.setInt8, bytes: 1 },
    B: {
        u: DataView.prototype.getUint8,
        p: DataView.prototype.setUint8,
        bytes: 1,
    },
    h: {
        u: DataView.prototype.getInt16,
        p: DataView.prototype.setInt16,
        bytes: 2,
    },
    H: {
        u: DataView.prototype.getUint16,
        p: DataView.prototype.setUint16,
        bytes: 2,
    },
    i: {
        u: DataView.prototype.getInt32,
        p: DataView.prototype.setInt32,
        bytes: 4,
    },
    I: {
        u: DataView.prototype.getUint32,
        p: DataView.prototype.setUint32,
        bytes: 4,
    },
};
const pack = (format, ...data) => {
    let pointer = 0;
    if (format.replace(/[<>]/, "").length != data.length) {
        throw "Pack format to Argument count mismatch";
    }
    const bytes = [];
    let littleEndian = true;
    for (let i = 0; i < format.length; i++) {
        if (format[i] == "<") {
            littleEndian = true;
        }
        else if (format[i] == ">") {
            littleEndian = false;
        }
        else {
            pushBytes(format[i], data[pointer]);
            pointer++;
        }
    }
    function pushBytes(formatChar, value) {
        if (!(formatChar in lut)) {
            throw "Unhandled character '" + formatChar + "' in pack format";
        }
        const dataSize = lut[formatChar].bytes;
        const view = new DataView(new ArrayBuffer(dataSize));
        const dataViewFn = lut[formatChar].p.bind(view);
        dataViewFn(0, value, littleEndian);
        for (let i = 0; i < dataSize; i++) {
            bytes.push(view.getUint8(i));
        }
    }
    return bytes;
};
const unpack = (format, bytes) => {
    let pointer = 0;
    const data = [];
    let littleEndian = true;
    for (const c of format) {
        if (c == "<") {
            littleEndian = true;
        }
        else if (c == ">") {
            littleEndian = false;
        }
        else {
            pushData(c);
        }
    }
    function pushData(formatChar) {
        if (!(formatChar in lut)) {
            throw "Unhandled character '" + formatChar + "' in unpack format";
        }
        const dataSize = lut[formatChar].bytes;
        const view = new DataView(new ArrayBuffer(dataSize));
        for (let i = 0; i < dataSize; i++) {
            view.setUint8(i, bytes[pointer + i] & 0xff);
        }
        const dataViewFn = lut[formatChar].u.bind(view);
        data.push(dataViewFn(0, littleEndian));
        pointer += dataSize;
    }
    return data;
};

/// <reference types="@types/w3c-web-serial" />
class ESPLoader extends EventTarget {
    constructor(port, logger, _parent) {
        super();
        this.port = port;
        this.logger = logger;
        this._parent = _parent;
        this.chipName = null;
        this.chipRevision = null;
        this.chipVariant = null;
        this._efuses = new Array(4).fill(0);
        this._flashsize = 4 * 1024 * 1024;
        this.debug = false;
        this.IS_STUB = false;
        this.connected = true;
        this.flashSize = null;
        this._currentBaudRate = ESP_ROM_BAUD;
        this._isESP32S2NativeUSB = false;
        this._initializationSucceeded = false;
        this.state_DTR = false;
    }
    get _inputBuffer() {
        return this._parent ? this._parent._inputBuffer : this.__inputBuffer;
    }
    get _totalBytesRead() {
        return this._parent
            ? this._parent._totalBytesRead
            : this.__totalBytesRead || 0;
    }
    set _totalBytesRead(value) {
        if (this._parent) {
            this._parent._totalBytesRead = value;
        }
        else {
            this.__totalBytesRead = value;
        }
    }
    detectUSBSerialChip(vendorId, productId) {
        // Common USB-Serial chip vendors and their products
        const chips = {
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
        await this.hardReset(true);
        if (!this._parent) {
            this.__inputBuffer = [];
            this.__totalBytesRead = 0;
            // Detect and log USB-Serial chip info
            const portInfo = this.port.getInfo();
            if (portInfo.usbVendorId && portInfo.usbProductId) {
                const chipInfo = this.detectUSBSerialChip(portInfo.usbVendorId, portInfo.usbProductId);
                this.logger.log(`USB-Serial: ${chipInfo.name} (VID: 0x${portInfo.usbVendorId.toString(16)}, PID: 0x${portInfo.usbProductId.toString(16)})`);
                if (chipInfo.maxBaudrate) {
                    this._maxUSBSerialBaudrate = chipInfo.maxBaudrate;
                    this.logger.log(`Max baudrate: ${chipInfo.maxBaudrate}`);
                }
                // Detect ESP32-S2 Native USB
                if (portInfo.usbVendorId === 0x303a && portInfo.usbProductId === 0x2) {
                    this._isESP32S2NativeUSB = true;
                }
            }
            // Don't await this promise so it doesn't block rest of method.
            this.readLoop();
        }
        // Clear buffer again after starting read loop
        await this.flushSerialBuffers();
        await this.sync();
        // Detect chip type
        await this.detectChip();
        // Read the OTP data for this chip and store into this.efuses array
        const FlAddr = getSpiFlashAddresses(this.getChipFamily());
        const AddrMAC = FlAddr.macFuse;
        for (let i = 0; i < 4; i++) {
            this._efuses[i] = await this.readRegister(AddrMAC + 4 * i);
        }
        this.logger.log(`Chip type ${this.chipName}`);
        this.logger.debug(`Bootloader flash offset: 0x${FlAddr.flashOffs.toString(16)}`);
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
                    }
                    else {
                        this.chipVariant = "rev0";
                    }
                    this.logger.debug(`ESP32-P4 variant: ${this.chipVariant}`);
                }
                this.logger.debug(`Detected chip via IMAGE_CHIP_ID: ${chipId} (${this.chipName})`);
                return;
            }
            this.logger.debug(`Unknown IMAGE_CHIP_ID: ${chipId}, falling back to magic value detection`);
        }
        catch (error) {
            // GET_SECURITY_INFO not supported, fall back to magic value detection
            this.logger.debug(`GET_SECURITY_INFO failed, using magic value detection: ${error}`);
            // Clear input buffer and re-sync to recover from failed command
            this._inputBuffer.length = 0;
            await sleep(SYNC_TIMEOUT);
            // Re-sync with the chip to ensure clean communication
            try {
                await this.sync();
            }
            catch (syncErr) {
                this.logger.debug(`Re-sync after GET_SECURITY_INFO failure: ${syncErr}`);
            }
        }
        // Fallback: Use magic value detection for ESP8266, ESP32, ESP32-S2
        const chipMagicValue = await this.readRegister(CHIP_DETECT_MAGIC_REG_ADDR);
        const chip = CHIP_DETECT_MAGIC_VALUES[chipMagicValue >>> 0];
        if (chip === undefined) {
            throw new Error(`Unknown Chip: Hex: ${toHex(chipMagicValue >>> 0, 8).toLowerCase()} Number: ${chipMagicValue}`);
        }
        this.chipName = chip.name;
        this.chipFamily = chip.family;
        if (this.chipFamily === CHIP_FAMILY_ESP32P4) {
            this.chipRevision = await this.getChipRevision();
            this.logger.debug(`ESP32-P4 revision: ${this.chipRevision}`);
            if (this.chipRevision >= 300) {
                this.chipVariant = "rev300";
            }
            else {
                this.chipVariant = "rev0";
            }
            this.logger.debug(`ESP32-P4 variant: ${this.chipVariant}`);
        }
        this.logger.debug(`Detected chip via magic value: ${toHex(chipMagicValue >>> 0, 8)} (${this.chipName})`);
    }
    /**
     * Get chip revision for ESP32-P4
     */
    async getChipRevision() {
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
    async getSecurityInfo() {
        const [, responseData] = await this.checkCommand(ESP_GET_SECURITY_INFO, [], 0);
        // Some chips/ROM versions return empty response or don't support this command
        if (responseData.length === 0) {
            throw new Error(`GET_SECURITY_INFO not supported or returned empty response`);
        }
        if (responseData.length < 12) {
            throw new Error(`Invalid security info response length: ${responseData.length} (expected at least 12 bytes)`);
        }
        const flags = unpack("<I", responseData.slice(0, 4))[0];
        const flashCryptCnt = responseData[4];
        const keyPurposes = Array.from(responseData.slice(5, 12));
        const chipId = responseData.length >= 16
            ? unpack("<I", responseData.slice(12, 16))[0]
            : 0;
        const apiVersion = responseData.length >= 20
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
        this._reader = this.port.readable.getReader();
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
        }
        catch {
            this.logger.error("Read loop got disconnected");
        }
        // Disconnected!
        this.connected = false;
        // Check if this is ESP32-S2 Native USB that needs port reselection
        // Only trigger reconnect if initialization did NOT succeed (wrong port)
        if (this._isESP32S2NativeUSB && !this._initializationSucceeded) {
            this.logger.log("ESP32-S2 Native USB detected - requesting port reselection");
            this.dispatchEvent(new CustomEvent("esp32s2-usb-reconnect", {
                detail: { message: "ESP32-S2 Native USB requires port reselection" },
            }));
        }
        this.dispatchEvent(new Event("disconnect"));
        this.logger.debug("Finished read loop");
    }
    sleep(ms = 100) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async setRTS(state) {
        await this.port.setSignals({ requestToSend: state });
        // # Work-around for adapters on Windows using the usbser.sys driver:
        // # generate a dummy change to DTR so that the set-control-line-state
        // # request is sent with the updated RTS state and the same DTR state
        // Referenced to esptool.py
        await this.setDTR(this.state_DTR);
    }
    async setDTR(state) {
        this.state_DTR = state;
        await this.port.setSignals({ dataTerminalReady: state });
    }
    async hardReset(bootloader = false) {
        if (bootloader) {
            // enter flash mode
            if (this.port.getInfo().usbProductId === USB_JTAG_SERIAL_PID) {
                // esp32c3 esp32s3 etc. build-in USB serial.
                // when connect to computer direct via usb, using following signals
                // to enter flash mode automatically.
                await this.setDTR(false);
                await this.setRTS(false);
                await this.sleep(100);
                await this.setDTR(true);
                await this.setRTS(false);
                await this.sleep(100);
                await this.setRTS(true);
                await this.setDTR(false);
                await this.setRTS(true);
                await this.sleep(100);
                await this.setDTR(false);
                await this.setRTS(false);
                this.logger.log("USB MCU reset.");
            }
            else {
                // otherwise, esp chip should be connected to computer via usb-serial
                // bridge chip like ch340,CP2102 etc.
                // use normal way to enter flash mode.
                await this.setDTR(false);
                await this.setRTS(true);
                await this.sleep(100);
                await this.setDTR(true);
                await this.setRTS(false);
                await this.sleep(50);
                await this.setDTR(false);
                this.logger.log("DTR/RTS USB serial chip reset.");
            }
        }
        else {
            // just reset
            await this.setRTS(true); // EN->LOW
            await this.sleep(100);
            await this.setRTS(false);
            this.logger.log("Hard reset.");
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
            }
            else if (((mac1 >> 16) & 0xff) == 0) {
                oui = [0x18, 0xfe, 0x34];
            }
            else if (((mac1 >> 16) & 0xff) == 1) {
                oui = [0xac, 0xd0, 0x74];
            }
            else {
                throw new Error("Couldnt determine OUI");
            }
            macAddr[0] = oui[0];
            macAddr[1] = oui[1];
            macAddr[2] = oui[2];
            macAddr[3] = (mac1 >> 8) & 0xff;
            macAddr[4] = mac1 & 0xff;
            macAddr[5] = (mac0 >> 24) & 0xff;
        }
        else if (this.chipFamily == CHIP_FAMILY_ESP32) {
            macAddr[0] = (mac2 >> 8) & 0xff;
            macAddr[1] = mac2 & 0xff;
            macAddr[2] = (mac1 >> 24) & 0xff;
            macAddr[3] = (mac1 >> 16) & 0xff;
            macAddr[4] = (mac1 >> 8) & 0xff;
            macAddr[5] = mac1 & 0xff;
        }
        else if (this.chipFamily == CHIP_FAMILY_ESP32S2 ||
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
            this.chipFamily == CHIP_FAMILY_ESP32S31) {
            macAddr[0] = (mac1 >> 8) & 0xff;
            macAddr[1] = mac1 & 0xff;
            macAddr[2] = (mac0 >> 24) & 0xff;
            macAddr[3] = (mac0 >> 16) & 0xff;
            macAddr[4] = (mac0 >> 8) & 0xff;
            macAddr[5] = mac0 & 0xff;
        }
        else {
            throw new Error("Unknown chip family");
        }
        return macAddr;
    }
    async readRegister(reg) {
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
     */
    async checkCommand(opcode, buffer, checksum = 0, timeout = DEFAULT_TIMEOUT) {
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
        }
        else if ([
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
        ].includes(this.chipFamily)) {
            statusLen = 4;
        }
        else {
            // When chipFamily is not yet set (e.g., during GET_SECURITY_INFO in detectChip),
            // assume modern chips use 4-byte status
            if (opcode === ESP_GET_SECURITY_INFO) {
                statusLen = 4;
            }
            else if ([2, 4].includes(data.length)) {
                statusLen = data.length;
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
                throw new Error("Invalid (unsupported) command " + toHex(opcode));
            }
            else {
                throw new Error("Command failure error code " + toHex(status[1]));
            }
        }
        return [value, data];
    }
    /**
     * @name sendCommand
     * Send a slip-encoded, checksummed command over the UART,
     * does not check response
     */
    async sendCommand(opcode, buffer, checksum = 0) {
        const packet = slipEncode([
            ...pack("<BBHI", 0x00, opcode, buffer.length, checksum),
            ...buffer,
        ]);
        if (this.debug) {
            this.logger.debug(`Writing ${packet.length} byte${packet.length == 1 ? "" : "s"}:`, packet);
        }
        await this.writeToStream(packet);
    }
    /**
     * @name readPacket
     * Generator to read SLIP packets from a serial port.
     * Yields one full SLIP packet at a time, raises exception on timeout or invalid data.
     */
    async readPacket(timeout) {
        let partialPacket = null;
        let inEscape = false;
        let readBytes = [];
        while (true) {
            const stamp = Date.now();
            readBytes = [];
            while (Date.now() - stamp < timeout) {
                if (this._inputBuffer.length > 0) {
                    readBytes.push(this._inputBuffer.shift());
                    break;
                }
                else {
                    // Reduced sleep time for faster response during high-speed transfers
                    await sleep(1);
                }
            }
            if (readBytes.length == 0) {
                const waitingFor = partialPacket === null ? "header" : "content";
                throw new SlipReadError("Timed out waiting for packet " + waitingFor);
            }
            if (this.debug)
                this.logger.debug("Read " + readBytes.length + " bytes: " + hexFormatter(readBytes));
            for (const b of readBytes) {
                if (partialPacket === null) {
                    // waiting for packet header
                    if (b == 0xc0) {
                        partialPacket = [];
                    }
                    else {
                        if (this.debug) {
                            this.logger.debug("Read invalid data: " + hexFormatter(readBytes));
                            this.logger.debug("Remaining data in serial buffer: " +
                                hexFormatter(this._inputBuffer));
                        }
                        throw new SlipReadError("Invalid head of packet (" + toHex(b) + ")");
                    }
                }
                else if (inEscape) {
                    // part-way through escape sequence
                    inEscape = false;
                    if (b == 0xdc) {
                        partialPacket.push(0xc0);
                    }
                    else if (b == 0xdd) {
                        partialPacket.push(0xdb);
                    }
                    else {
                        if (this.debug) {
                            this.logger.debug("Read invalid data: " + hexFormatter(readBytes));
                            this.logger.debug("Remaining data in serial buffer: " +
                                hexFormatter(this._inputBuffer));
                        }
                        throw new SlipReadError("Invalid SLIP escape (0xdb, " + toHex(b) + ")");
                    }
                }
                else if (b == 0xdb) {
                    // start of escape sequence
                    inEscape = true;
                }
                else if (b == 0xc0) {
                    // end of packet
                    if (this.debug)
                        this.logger.debug("Received full packet: " + hexFormatter(partialPacket));
                    return partialPacket;
                }
                else {
                    // normal byte in packet
                    partialPacket.push(b);
                }
            }
        }
        throw new SlipReadError("Invalid state");
    }
    /**
     * @name getResponse
     * Read response data and decodes the slip packet, then parses
     * out the value/data and returns as a tuple of (value, data) where
     * each is a list of bytes
     */
    async getResponse(opcode, timeout = DEFAULT_TIMEOUT) {
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
                this._inputBuffer.length = 0;
                throw new Error(`Invalid (unsupported) command ${toHex(opcode)}`);
            }
        }
        throw "Response doesn't match request";
    }
    /**
     * @name checksum
     * Calculate checksum of a blob, as it is defined by the ROM
     */
    checksum(data, state = ESP_CHECKSUM_MAGIC) {
        for (const b of data) {
            state ^= b;
        }
        return state;
    }
    async setBaudrate(baud) {
        if (this.chipFamily == CHIP_FAMILY_ESP8266) {
            throw new Error("Changing baud rate is not supported on the ESP8266");
        }
        try {
            // Send ESP_ROM_BAUD(115200) as the old one if running STUB otherwise 0
            const buffer = pack("<II", baud, this.IS_STUB ? ESP_ROM_BAUD : 0);
            await this.checkCommand(ESP_CHANGE_BAUDRATE, buffer);
        }
        catch (e) {
            this.logger.error(`Baudrate change error: ${e}`);
            throw new Error(`Unable to change the baud rate to ${baud}: No response from set baud rate command.`);
        }
        if (this._parent) {
            await this._parent.reconfigurePort(baud);
        }
        else {
            await this.reconfigurePort(baud);
        }
        // Track current baudrate for reconnect
        if (this._parent) {
            this._parent._currentBaudRate = baud;
        }
        else {
            this._currentBaudRate = baud;
        }
        // Warn if baudrate exceeds USB-Serial chip capability
        const maxBaud = this._parent
            ? this._parent._maxUSBSerialBaudrate
            : this._maxUSBSerialBaudrate;
        if (maxBaud && baud > maxBaud) {
            this.logger.log(`⚠️  WARNING: Baudrate ${baud} exceeds USB-Serial chip limit (${maxBaud})!`);
            this.logger.log(`⚠️  This may cause data corruption or connection failures!`);
        }
        this.logger.log(`Changed baud rate to ${baud}`);
    }
    async reconfigurePort(baud) {
        var _a;
        try {
            // SerialPort does not allow to be reconfigured while open so we close and re-open
            // reader.cancel() causes the Promise returned by the read() operation running on
            // the readLoop to return immediately with { value: undefined, done: true } and thus
            // breaking the loop and exiting readLoop();
            await ((_a = this._reader) === null || _a === void 0 ? void 0 : _a.cancel());
            await this.port.close();
            // Reopen Port
            await this.port.open({ baudRate: baud });
            // Clear buffer again
            await this.flushSerialBuffers();
            // Restart Readloop
            this.readLoop();
        }
        catch (e) {
            this.logger.error(`Reconfigure port error: ${e}`);
            throw new Error(`Unable to change the baud rate to ${baud}: ${e}`);
        }
    }
    /**
     * @name sync
     * Put into ROM bootload mode & attempt to synchronize with the
     * ESP ROM bootloader, we will retry a few times
     */
    async sync() {
        for (let i = 0; i < 5; i++) {
            this._inputBuffer.length = 0;
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
            }
            catch {
                // If read packet fails.
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
    async flashData(binaryData, updateProgress, offset = 0, compress = false) {
        if (binaryData.byteLength >= 8) {
            // unpack the (potential) image header
            const header = Array.from(new Uint8Array(binaryData, 0, 4));
            const headerMagic = header[0];
            const headerFlashMode = header[2];
            const headerFlashSizeFreq = header[3];
            this.logger.log(`Image header, Magic=${toHex(headerMagic)}, FlashMode=${toHex(headerFlashMode)}, FlashSizeFreq=${toHex(headerFlashSizeFreq)}`);
        }
        const uncompressedFilesize = binaryData.byteLength;
        let compressedFilesize = 0;
        let dataToFlash;
        let timeout = DEFAULT_TIMEOUT;
        if (compress) {
            dataToFlash = deflate_1(new Uint8Array(binaryData), {
                level: 9,
            }).buffer;
            compressedFilesize = dataToFlash.byteLength;
            this.logger.log(`Writing data with filesize: ${uncompressedFilesize}. Compressed Size: ${compressedFilesize}`);
            timeout = await this.flashDeflBegin(uncompressedFilesize, compressedFilesize, offset);
        }
        else {
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
                this.logger.log(`Writing at ${toHex(offset + seq * flashWriteSize, 8)} `);
            }
            if (filesize - position >= flashWriteSize) {
                block = Array.from(new Uint8Array(dataToFlash, position, flashWriteSize));
            }
            else {
                // Pad the last block only if we are sending uncompressed data.
                block = Array.from(new Uint8Array(dataToFlash, position, filesize - position));
                if (!compress) {
                    block = block.concat(new Array(flashWriteSize - block.length).fill(0xff));
                }
            }
            if (compress) {
                await this.flashDeflBlock(block, seq, timeout);
            }
            else {
                await this.flashBlock(block, seq);
            }
            seq += 1;
            // If using compression we update the progress with the proportional size of the block taking into account the compression ratio.
            // This way we report progress on the uncompressed size
            written += compress
                ? Math.round((block.length * uncompressedFilesize) / compressedFilesize)
                : block.length;
            position += flashWriteSize;
            updateProgress(Math.min(written, uncompressedFilesize), uncompressedFilesize);
        }
        this.logger.log("Took " + (Date.now() - stamp) + "ms to write " + filesize + " bytes");
        // Only send flashF finish if running the stub because ir causes the ROM to exit and run user code
        if (this.IS_STUB) {
            await this.flashBegin(0, 0);
            if (compress) {
                await this.flashDeflFinish();
            }
            else {
                await this.flashFinish();
            }
        }
    }
    /**
     * @name flashBlock
     * Send one block of data to program into SPI Flash memory
     */
    async flashBlock(data, seq, timeout = DEFAULT_TIMEOUT) {
        await this.checkCommand(ESP_FLASH_DATA, pack("<IIII", data.length, seq, 0, 0).concat(data), this.checksum(data), timeout);
    }
    async flashDeflBlock(data, seq, timeout = DEFAULT_TIMEOUT) {
        await this.checkCommand(ESP_FLASH_DEFL_DATA, pack("<IIII", data.length, seq, 0, 0).concat(data), this.checksum(data), timeout);
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
        if (!this.IS_STUB &&
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
            ].includes(this.chipFamily)) {
            await this.checkCommand(ESP_SPI_ATTACH, new Array(8).fill(0));
        }
        const numBlocks = Math.floor((size + flashWriteSize - 1) / flashWriteSize);
        if (this.chipFamily == CHIP_FAMILY_ESP8266) {
            eraseSize = this.getEraseSize(offset, size);
        }
        else {
            eraseSize = size;
        }
        const timeout = this.IS_STUB
            ? DEFAULT_TIMEOUT
            : timeoutPerMb(ERASE_REGION_TIMEOUT_PER_MB, size);
        const stamp = Date.now();
        let buffer = pack("<IIII", eraseSize, numBlocks, flashWriteSize, offset);
        if (this.chipFamily == CHIP_FAMILY_ESP32 ||
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
            this.chipFamily == CHIP_FAMILY_ESP32S31) {
            buffer = buffer.concat(pack("<I", encrypted ? 1 : 0));
        }
        this.logger.log("Erase size " +
            eraseSize +
            ", blocks " +
            numBlocks +
            ", block size " +
            toHex(flashWriteSize, 4) +
            ", offset " +
            toHex(offset, 4) +
            ", encrypted " +
            (encrypted ? "yes" : "no"));
        await this.checkCommand(ESP_FLASH_BEGIN, buffer, 0, timeout);
        if (size != 0 && !this.IS_STUB) {
            this.logger.log("Took " + (Date.now() - stamp) + "ms to erase " + numBlocks + " bytes");
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
        const numBlocks = Math.floor((compressedSize + flashWriteSize - 1) / flashWriteSize);
        const eraseBlocks = Math.floor((size + flashWriteSize - 1) / flashWriteSize);
        let writeSize = 0;
        let timeout = 0;
        if (this.IS_STUB) {
            writeSize = size; // stub expects number of bytes here, manages erasing internally
            timeout = timeoutPerMb(ERASE_REGION_TIMEOUT_PER_MB, writeSize); // ROM performs the erase up front
        }
        else {
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
    async writeRegister(address, value, mask = 0xffffffff, delayUs = 0, delayAfterUs = 0) {
        let buffer = pack("<IIII", address, value, mask, delayUs);
        if (delayAfterUs > 0) {
            // add a dummy write to a date register as an excuse to have a delay
            buffer = buffer.concat(pack("<IIII", getSpiFlashAddresses(this.getChipFamily()).uartDateReg, 0, 0, delayAfterUs));
        }
        await this.checkCommand(ESP_WRITE_REG, buffer);
    }
    async setDataLengths(spiAddresses, mosiBits, misoBits) {
        if (spiAddresses.mosiDlenOffs != -1) {
            // Actual MCUs have a more sophisticated way to set up "user" commands
            const SPI_MOSI_DLEN_REG = spiAddresses.regBase + spiAddresses.mosiDlenOffs;
            const SPI_MISO_DLEN_REG = spiAddresses.regBase + spiAddresses.misoDlenOffs;
            if (mosiBits > 0) {
                await this.writeRegister(SPI_MOSI_DLEN_REG, mosiBits - 1);
            }
            if (misoBits > 0) {
                await this.writeRegister(SPI_MISO_DLEN_REG, misoBits - 1);
            }
        }
        else {
            const SPI_DATA_LEN_REG = spiAddresses.regBase + spiAddresses.usr1Offs;
            const SPI_MOSI_BITLEN_S = 17;
            const SPI_MISO_BITLEN_S = 8;
            const mosiMask = mosiBits == 0 ? 0 : mosiBits - 1;
            const misoMask = misoBits == 0 ? 0 : misoBits - 1;
            const value = (misoMask << SPI_MISO_BITLEN_S) | (mosiMask << SPI_MOSI_BITLEN_S);
            await this.writeRegister(SPI_DATA_LEN_REG, value);
        }
    }
    async waitDone(spiCmdReg, spiCmdUsr) {
        for (let i = 0; i < 10; i++) {
            const cmdValue = await this.readRegister(spiCmdReg);
            if ((cmdValue & spiCmdUsr) == 0) {
                return;
            }
        }
        throw Error("SPI command did not complete in time");
    }
    async runSpiFlashCommand(spiflashCommand, data, readBits = 0) {
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
            throw new Error("Reading more than 32 bits back from a SPI flash operation is unsupported");
        }
        if (data.length > 64) {
            throw new Error("Writing more than 64 bytes of data with one SPI command is unsupported");
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
        await this.writeRegister(SPI_USR2_REG, (7 << SPI_USR2_COMMAND_LEN_SHIFT) | spiflashCommand);
        if (dataBits == 0) {
            await this.writeRegister(SPI_W0_REG, 0); // clear data register before we read it
        }
        else {
            const padLen = (4 - (data.length % 4)) % 4;
            data = data.concat(new Array(padLen).fill(0x00)); // pad to 32-bit multiple
            const words = unpack("I".repeat(Math.floor(data.length / 4)), data);
            let nextReg = SPI_W0_REG;
            this.logger.debug(`Words Length: ${words.length}`);
            for (const word of words) {
                this.logger.debug(`Writing word ${toHex(word)} to register offset ${toHex(nextReg)}`);
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
        this.logger.log(`Flash Device: ${((flashId >> 8) & 0xff).toString(16)}${flashIdLowbyte.toString(16)}`);
        this.flashSize = DETECTED_FLASH_SIZES[flashIdLowbyte];
        this.logger.log(`Auto-detected Flash size: ${this.flashSize}`);
    }
    /**
     * @name getEraseSize
     * Calculate an erase size given a specific size in bytes.
     *   Provides a workaround for the bootloader erase bug on ESP8266.
     */
    getEraseSize(offset, size) {
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
    async memBegin(size, blocks, blocksize, offset) {
        return await this.checkCommand(ESP_MEM_BEGIN, pack("<IIII", size, blocks, blocksize, offset));
    }
    /**
     * @name memBlock (609)
     * Send a block of an image to RAM
     */
    async memBlock(data, seq) {
        return await this.checkCommand(ESP_MEM_DATA, pack("<IIII", data.length, seq, 0, 0).concat(data), this.checksum(data));
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
    async runStub(skipFlashDetection = false) {
        const stub = await getStubCode(this.chipFamily, this.chipRevision);
        // No stub available for this chip, return ROM loader
        if (stub === null) {
            this.logger.log(`Stub flasher is not yet supported on ${this.chipName}, using ROM loader`);
            return this;
        }
        // We're transferring over USB, right?
        const ramBlock = USB_RAM_BLOCK;
        // Upload
        this.logger.log("Uploading stub...");
        for (const field of ["text", "data"]) {
            const fieldData = stub[field];
            const offset = stub[`${field}_start`];
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
    async writeToStream(data) {
        if (!this.port.writable) {
            this.logger.debug("Port writable stream not available, skipping write");
            return;
        }
        const writer = this.port.writable.getWriter();
        await writer.write(new Uint8Array(data));
        try {
            writer.releaseLock();
        }
        catch (err) {
            this.logger.error(`Ignoring release lock error: ${err}`);
        }
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
        await this.port.writable.getWriter().close();
        await new Promise((resolve) => {
            if (!this._reader) {
                resolve(undefined);
            }
            this.addEventListener("disconnect", resolve, { once: true });
            this._reader.cancel();
        });
        this.connected = false;
    }
    /**
     * @name reconnectAndResume
     * Reconnect the serial port to flush browser buffers and reload stub
     */
    async reconnect() {
        if (this._parent) {
            await this._parent.reconnect();
            return;
        }
        this.logger.log("Reconnecting serial port...");
        this.connected = false;
        this.__inputBuffer = [];
        // Cancel reader
        if (this._reader) {
            try {
                await this._reader.cancel();
            }
            catch (err) {
                this.logger.debug(`Reader cancel error: ${err}`);
            }
            this._reader = undefined;
        }
        // Close port
        try {
            await this.port.close();
            this.logger.log("Port closed");
        }
        catch (err) {
            this.logger.debug(`Port close error: ${err}`);
        }
        // Open the port
        this.logger.debug("Opening port...");
        try {
            await this.port.open({ baudRate: ESP_ROM_BAUD });
            this.connected = true;
        }
        catch (err) {
            throw new Error(`Failed to open port: ${err}`);
        }
        // Verify port streams are available
        if (!this.port.readable || !this.port.writable) {
            throw new Error(`Port streams not available after open (readable: ${!!this.port.readable}, writable: ${!!this.port.writable})`);
        }
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
                throw new Error(`Port not ready after baudrate change (readable: ${!!this.port.readable}, writable: ${!!this.port.writable})`);
            }
        }
        // Copy stub state to this instance if we're a stub loader
        if (this.IS_STUB) {
            Object.assign(this, stubLoader);
        }
        this.logger.debug("Reconnection successful");
    }
    /**
     * @name flushSerialBuffers
     * Flush any pending data in the TX and RX serial port buffers
     * This clears both the application RX buffer and waits for hardware buffers to drain
     */
    async flushSerialBuffers() {
        // Clear application buffer
        if (!this._parent) {
            this.__inputBuffer = [];
        }
        // Wait for any pending data
        await sleep(SYNC_TIMEOUT);
        // Final clear
        if (!this._parent) {
            this.__inputBuffer = [];
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
    async readFlash(addr, size, onPacketReceived) {
        if (!this.IS_STUB) {
            throw new Error("Reading flash is only supported in stub mode. Please run runStub() first.");
        }
        // Flush serial buffers before flash read operation
        await this.flushSerialBuffers();
        this.logger.log(`Reading ${size} bytes from flash at address 0x${addr.toString(16)}...`);
        const CHUNK_SIZE = 0x10000; // 64KB chunks
        let allData = new Uint8Array(0);
        let currentAddr = addr;
        let remainingSize = size;
        while (remainingSize > 0) {
            const chunkSize = Math.min(CHUNK_SIZE, remainingSize);
            let chunkSuccess = false;
            let retryCount = 0;
            const MAX_RETRIES = 3;
            // Retry loop for this chunk
            while (!chunkSuccess && retryCount <= MAX_RETRIES) {
                try {
                    this.logger.debug(`Reading chunk at 0x${currentAddr.toString(16)}, size: 0x${chunkSize.toString(16)}`);
                    // Send read flash command for this chunk
                    const pkt = pack("<IIII", currentAddr, chunkSize, 0x1000, 1024);
                    const [res] = await this.checkCommand(ESP_READ_FLASH, pkt);
                    if (res != 0) {
                        throw new Error("Failed to read memory: " + res);
                    }
                    let resp = new Uint8Array(0);
                    while (resp.length < chunkSize) {
                        // Read a SLIP packet
                        let packet;
                        try {
                            packet = await this.readPacket(FLASH_READ_TIMEOUT);
                        }
                        catch (err) {
                            if (err instanceof SlipReadError) {
                                this.logger.debug(`SLIP read error at ${resp.length} bytes: ${err.message}`);
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
                            // Send acknowledgment
                            const ackData = pack("<I", resp.length);
                            const slipEncodedAck = slipEncode(ackData);
                            await this.writeToStream(slipEncodedAck);
                        }
                    }
                    // Chunk read successfully - append to all data
                    const newAllData = new Uint8Array(allData.length + resp.length);
                    newAllData.set(allData);
                    newAllData.set(resp, allData.length);
                    allData = newAllData;
                    chunkSuccess = true;
                }
                catch (err) {
                    retryCount++;
                    // Check if it's a timeout error
                    if (err instanceof SlipReadError &&
                        err.message.includes("Timed out")) {
                        if (retryCount <= MAX_RETRIES) {
                            this.logger.log(`⚠️  Timeout error at 0x${currentAddr.toString(16)}. Reconnecting and retrying (attempt ${retryCount}/${MAX_RETRIES})...`);
                            try {
                                await this.reconnect();
                                // Continue to retry the same chunk
                            }
                            catch (reconnectErr) {
                                throw new Error(`Reconnect failed: ${reconnectErr}`);
                            }
                        }
                        else {
                            throw new Error(`Failed to read chunk at 0x${currentAddr.toString(16)} after ${MAX_RETRIES} retries: ${err}`);
                        }
                    }
                    else {
                        // Non-timeout error, don't retry
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
            this.logger.debug(`Total progress: 0x${allData.length.toString(16)} from 0x${size.toString(16)} bytes`);
        }
        this.logger.debug(`Successfully read ${allData.length} bytes from flash`);
        return allData;
    }
}
class EspStubLoader extends ESPLoader {
    constructor() {
        super(...arguments);
        /*
          The Stubloader has commands that run on the uploaded Stub Code in RAM
          rather than built in commands.
        */
        this.IS_STUB = true;
    }
    /**
     * @name memBegin (592)
     * Start downloading an application image to RAM
     */
    async memBegin(size, _blocks, _blocksize, offset) {
        const stub = await getStubCode(this.chipFamily, this.chipRevision);
        // Stub may be null for chips without stub support
        if (stub === null) {
            return [0, []];
        }
        const load_start = offset;
        const load_end = offset + size;
        this.logger.debug(`Load range: ${toHex(load_start, 8)}-${toHex(load_end, 8)}`);
        this.logger.debug(`Stub data: ${toHex(stub.data_start, 8)}, len: ${stub.data.length}, text: ${toHex(stub.text_start, 8)}, len: ${stub.text.length}`);
        for (const [start, end] of [
            [stub.data_start, stub.data_start + stub.data.length],
            [stub.text_start, stub.text_start + stub.text.length],
        ]) {
            if (load_start < end && load_end > start) {
                throw new Error("Software loader is resident at " +
                    toHex(start, 8) +
                    "-" +
                    toHex(end, 8) +
                    ". " +
                    "Can't load binary at overlapping address range " +
                    toHex(load_start, 8) +
                    "-" +
                    toHex(load_end, 8) +
                    ". " +
                    "Try changing the binary loading address.");
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

/// <reference types="@types/w3c-web-serial" />
const connect = async (logger) => {
    // - Request a port and open a connection.
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: ESP_ROM_BAUD });
    logger.log("Connected successfully.");
    return new ESPLoader(port, logger);
};

export { CHIP_FAMILY_ESP32, CHIP_FAMILY_ESP32C2, CHIP_FAMILY_ESP32C3, CHIP_FAMILY_ESP32C5, CHIP_FAMILY_ESP32C6, CHIP_FAMILY_ESP32C61, CHIP_FAMILY_ESP32H2, CHIP_FAMILY_ESP32H21, CHIP_FAMILY_ESP32H4, CHIP_FAMILY_ESP32P4, CHIP_FAMILY_ESP32S2, CHIP_FAMILY_ESP32S3, CHIP_FAMILY_ESP32S31, CHIP_FAMILY_ESP8266, ESPLoader, connect };
