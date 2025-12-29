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
  const port = await navigator.serial.requestPort();

  await port.open({ baudRate: ESP_ROM_BAUD });

  logger.log("Connected successfully.");

  return new ESPLoader(port, logger);
};

export {
  parsePartitionTable,
  getPartitionTableOffset,
  formatSize,
} from "./partition";
export type { Partition } from "./partition";

export {
  FilesystemType,
  detectFilesystemType,
  detectFilesystemFromImage,
  getDefaultBlockSize,
  getBlockSizeCandidates,
  LITTLEFS_DEFAULT_BLOCK_SIZE,
  LITTLEFS_BLOCK_SIZE_CANDIDATES,
  FATFS_DEFAULT_BLOCK_SIZE,
  FATFS_BLOCK_SIZE_CANDIDATES,
} from "./wasm/filesystems";

export {
  SpiffsFS,
  SpiffsBuildConfig,
  SpiffsReader,
  DEFAULT_SPIFFS_CONFIG,
  type SpiffsFile,
  type SpiffsBuildConfigOptions,
} from "./lib/spiffs/index";
