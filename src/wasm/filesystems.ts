import type { Partition } from "../partition";

export const LITTLEFS_DEFAULT_BLOCK_SIZE = 4096;
export const LITTLEFS_BLOCK_SIZE_CANDIDATES = [4096, 2048, 1024, 512];
export const FATFS_DEFAULT_BLOCK_SIZE = 4096;
export const FATFS_BLOCK_SIZE_CANDIDATES = [4096, 2048, 1024, 512];

/**
 * Filesystem types based on partition subtype
 */
export enum FilesystemType {
  UNKNOWN = "unknown",
  LITTLEFS = "littlefs",
  FATFS = "fatfs",
  SPIFFS = "spiffs",
}

/**
 * Detect filesystem type from partition information
 * Note: This only provides a hint. LittleFS is often stored in SPIFFS partitions (0x82).
 * Use detectFilesystemFromImage() for accurate detection.
 */
export function detectFilesystemType(partition: Partition): FilesystemType {
  if (partition.type !== 0x01) {
    return FilesystemType.UNKNOWN;
  }

  switch (partition.subtype) {
    case 0x81:
      return FilesystemType.FATFS;
    case 0x82:
      return FilesystemType.UNKNOWN;
    default:
      return FilesystemType.UNKNOWN;
  }
}

/**
 * Detect filesystem type from image data
 * Reads the first 8KB to identify filesystem by magic headers and ASCII signatures
 */
export function detectFilesystemFromImage(
  imageData: Uint8Array,
): FilesystemType {
  if (imageData.length < 512) {
    return FilesystemType.UNKNOWN;
  }

  const searchSize = Math.min(8192, imageData.length);

  // Check for LittleFS magic numbers and ASCII signature
  for (let offset = 0; offset < searchSize - 8; offset++) {
    // Check for LittleFS magic: "littlefs" or "lfs\x00" or version-specific magic
    const magic32 =
      imageData[offset] |
      (imageData[offset + 1] << 8) |
      (imageData[offset + 2] << 16) |
      (imageData[offset + 3] << 24);

    // LittleFS v2.x magic: 0x32736c66 ("lfs2" in little-endian)
    // LittleFS v1.x magic: 0x31736c66 ("lfs1" in little-endian)
    if (magic32 === 0x32736c66 || magic32 === 0x31736c66) {
      return FilesystemType.LITTLEFS;
    }

    // Check for ASCII "littlefs" string
    if (offset + 8 <= searchSize) {
      const str = String.fromCharCode(
        imageData[offset],
        imageData[offset + 1],
        imageData[offset + 2],
        imageData[offset + 3],
        imageData[offset + 4],
        imageData[offset + 5],
        imageData[offset + 6],
        imageData[offset + 7],
      );
      if (str === "littlefs") {
        return FilesystemType.LITTLEFS;
      }
    }
  }

  // Check for FAT filesystem signatures
  if (imageData.length >= 512) {
    const bootSig = imageData[510] | (imageData[511] << 8);
    if (bootSig === 0xaa55) {
      const fat16Sig =
        imageData.length >= 62
          ? String.fromCharCode(
              imageData[54],
              imageData[55],
              imageData[56],
              imageData[57],
              imageData[58],
            )
          : "";
      const fat32Sig =
        imageData.length >= 90
          ? String.fromCharCode(
              imageData[82],
              imageData[83],
              imageData[84],
              imageData[85],
              imageData[86],
            )
          : "";

      if (fat16Sig.startsWith("FAT") || fat32Sig.startsWith("FAT")) {
        return FilesystemType.FATFS;
      }
    }
  }

  // Check for SPIFFS magic (0x20140529)
  if (imageData.length >= 4) {
    const spiffsMagic =
      imageData[0] |
      (imageData[1] << 8) |
      (imageData[2] << 16) |
      (imageData[3] << 24);
    if (spiffsMagic === 0x20140529) {
      return FilesystemType.SPIFFS;
    }
  }

  return FilesystemType.UNKNOWN;
}

/**
 * Get appropriate block size for filesystem type
 */
export function getDefaultBlockSize(fsType: FilesystemType): number {
  switch (fsType) {
    case FilesystemType.FATFS:
      return FATFS_DEFAULT_BLOCK_SIZE;
    case FilesystemType.LITTLEFS:
      return LITTLEFS_DEFAULT_BLOCK_SIZE;
    default:
      return 4096;
  }
}

/**
 * Get block size candidates for filesystem type
 */
export function getBlockSizeCandidates(fsType: FilesystemType): number[] {
  switch (fsType) {
    case FilesystemType.FATFS:
      return FATFS_BLOCK_SIZE_CANDIDATES;
    case FilesystemType.LITTLEFS:
      return LITTLEFS_BLOCK_SIZE_CANDIDATES;
    default:
      return [4096, 2048, 1024, 512];
  }
}
