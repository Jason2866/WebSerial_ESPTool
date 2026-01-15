/// <reference types="@types/w3c-web-serial" />

import { ESP_ROM_BAUD, Logger } from "./const";
import { ESPLoader } from "./esp_loader";

export type { Logger } from "./const";
export { ESPLoader } from "./esp_loader";

export {
  CHIP_FAMILY_ESP32,
  CHIP_FAMILY_ESP32S2,
  CHIP_FAMILY_ESP32S3,
  CHIP_FAMILY_ESP8266,
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
  // Command constants
  ESP_FLASH_BEGIN,
  ESP_FLASH_DATA,
  ESP_FLASH_END,
  ESP_MEM_BEGIN,
  ESP_MEM_END,
  ESP_MEM_DATA,
  ESP_SYNC,
  ESP_WRITE_REG,
  ESP_READ_REG,
  ESP_ERASE_FLASH,
  ESP_ERASE_REGION,
  ESP_READ_FLASH,
  ESP_SPI_SET_PARAMS,
  ESP_SPI_ATTACH,
  ESP_CHANGE_BAUDRATE,
  ESP_SPI_FLASH_MD5,
  ESP_GET_SECURITY_INFO,
  ESP_CHECKSUM_MAGIC,
  ESP_FLASH_DEFL_BEGIN,
  ESP_FLASH_DEFL_DATA,
  ESP_FLASH_DEFL_END,
  ROM_INVALID_RECV_MSG,
  // Block size constants
  USB_RAM_BLOCK,
  ESP_RAM_BLOCK,
  // Timeout constants
  DEFAULT_TIMEOUT,
  CHIP_ERASE_TIMEOUT,
  MAX_TIMEOUT,
  SYNC_TIMEOUT,
  ERASE_REGION_TIMEOUT_PER_MB,
  MEM_END_ROM_TIMEOUT,
  FLASH_READ_TIMEOUT,
} from "./const";

export const connect = async (logger: Logger) => {
  // - Request a port and open a connection.
  // Try to use requestSerialPort if available (supports WebUSB for Android)
  let port: SerialPort;
  const customRequestPort = (
    globalThis as { requestSerialPort?: () => Promise<SerialPort> }
  ).requestSerialPort;
  if (typeof customRequestPort === "function") {
    port = await customRequestPort();
  } else {
    // Check if Web Serial API is available
    if (!navigator.serial) {
      throw new Error(
        "Web Serial API is not supported in this browser. " +
          "Please use Chrome, Edge, or Opera on desktop, or Chrome on Android. " +
          "Note: The page must be served over HTTPS or localhost.",
      );
    }
    port = await navigator.serial.requestPort();
  }

  // Only open if not already open (requestSerialPort may return an opened port)
  if (!port.readable || !port.writable) {
    await port.open({ baudRate: ESP_ROM_BAUD });
  }

  return new ESPLoader(port, logger);
};

export const connectWithPort = async (port: SerialPort, logger: Logger) => {
  // Connect using an already opened port (useful for WebUSB wrapper)
  if (!port) {
    throw new Error("Port is required");
  }

  // Check if port is already open, if not open it
  if (!port.readable || !port.writable) {
    await port.open({ baudRate: ESP_ROM_BAUD });
  }

  return new ESPLoader(port, logger);
};
