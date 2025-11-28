/**
 * ESP32 Partition Table Parser
 * Based on ESP-IDF partition table format
 */

export interface Partition {
  name: string;
  type: number;
  subtype: number;
  offset: number;
  size: number;
  flags: number;
  typeName: string;
  subtypeName: string;
}

// Partition types
const PARTITION_TYPES: { [key: number]: string } = {
  0x00: "app",
  0x01: "data",
};

// App subtypes
const APP_SUBTYPES: { [key: number]: string } = {
  0x00: "factory",
  0x10: "ota_0",
  0x11: "ota_1",
  0x12: "ota_2",
  0x13: "ota_3",
  0x14: "ota_4",
  0x15: "ota_5",
  0x16: "ota_6",
  0x17: "ota_7",
  0x18: "ota_8",
  0x19: "ota_9",
  0x1a: "ota_10",
  0x1b: "ota_11",
  0x1c: "ota_12",
  0x1d: "ota_13",
  0x1e: "ota_14",
  0x1f: "ota_15",
  0x20: "test",
};

// Data subtypes
const DATA_SUBTYPES: { [key: number]: string } = {
  0x00: "ota",
  0x01: "phy",
  0x02: "nvs",
  0x03: "coredump",
  0x04: "nvs_keys",
  0x05: "efuse",
  0x80: "esphttpd",
  0x81: "fat",
  0x82: "spiffs",
};

const PARTITION_TABLE_OFFSET = 0x8000; // Default partition table offset
const PARTITION_ENTRY_SIZE = 32;
const PARTITION_MAGIC = 0x50aa;

/**
 * Parse a single partition entry from binary data
 */
function parsePartitionEntry(data: Uint8Array): Partition | null {
  if (data.length < PARTITION_ENTRY_SIZE) {
    return null;
  }

  // Check magic bytes
  const magic = (data[0] | (data[1] << 8)) & 0xffff;
  if (magic !== PARTITION_MAGIC) {
    return null;
  }

  const type = data[2];
  const subtype = data[3];
  const offset = data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24);
  const size = data[8] | (data[9] << 8) | (data[10] << 16) | (data[11] << 24);

  // Name is at offset 12, max 16 bytes, null-terminated
  let name = "";
  for (let i = 12; i < 28; i++) {
    if (data[i] === 0) break;
    name += String.fromCharCode(data[i]);
  }

  const flags =
    data[28] | (data[29] << 8) | (data[30] << 16) | (data[31] << 24);

  // Get type and subtype names
  const typeName = PARTITION_TYPES[type] || `unknown(0x${type.toString(16)})`;
  let subtypeName = "";

  if (type === 0x00) {
    subtypeName = APP_SUBTYPES[subtype] || `unknown(0x${subtype.toString(16)})`;
  } else if (type === 0x01) {
    subtypeName =
      DATA_SUBTYPES[subtype] || `unknown(0x${subtype.toString(16)})`;
  } else {
    subtypeName = `0x${subtype.toString(16)}`;
  }

  return {
    name,
    type,
    subtype,
    offset,
    size,
    flags,
    typeName,
    subtypeName,
  };
}

/**
 * Parse the entire partition table
 */
export function parsePartitionTable(data: Uint8Array): Partition[] {
  const partitions: Partition[] = [];

  for (let i = 0; i < data.length; i += PARTITION_ENTRY_SIZE) {
    const entryData = data.slice(i, i + PARTITION_ENTRY_SIZE);
    const partition = parsePartitionEntry(entryData);

    if (partition === null) {
      // End of partition table or invalid entry
      break;
    }

    partitions.push(partition);
  }

  return partitions;
}

/**
 * Get the default partition table offset
 */
export function getPartitionTableOffset(): number {
  return PARTITION_TABLE_OFFSET;
}

/**
 * Format size in human-readable format
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
