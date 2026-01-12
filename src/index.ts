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

  logger.log("Connected successfully.");

  return new ESPLoader(port, logger);
};

export const connectWithPort = async (port: SerialPort, logger: Logger) => {
  // Connect using an already opened port (useful for WebUSB wrapper)
  if (!port) {
    throw new Error("Port is required");
  }

  // Only open if not already open
  if (!port.readable || !port.writable) {
    await port.open({ baudRate: ESP_ROM_BAUD });
  }

  logger.log("Connected successfully.");

  return new ESPLoader(port, logger);
};
