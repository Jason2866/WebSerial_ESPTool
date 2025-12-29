/**
 * SPIFFS Module Entry Point
 */

export { SpiffsFS, type SpiffsFile } from "./spiffs";
export {
  SpiffsBuildConfig,
  type SpiffsBuildConfigOptions,
  SpiffsFullError,
} from "./spiffsConfig";
export { SpiffsReader } from "./spiffsReader";

// Default ESP32 SPIFFS configuration
export const DEFAULT_SPIFFS_CONFIG = {
  pageSize: 256,
  blockSize: 4096,
  objNameLen: 32,
  metaLen: 4,
  useMagic: true,
  useMagicLen: true,
  alignedObjIxTables: false,
};
