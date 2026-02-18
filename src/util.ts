/**
 * @name slipEncode
 * Take an array buffer and return back a new array where
 * 0xdb is replaced with 0xdb 0xdd and 0xc0 is replaced with 0xdb 0xdc
 */
export const slipEncode = (buffer: number[]): number[] => {
  let encoded = [0xc0];
  for (const byte of buffer) {
    if (byte == 0xdb) {
      encoded = encoded.concat([0xdb, 0xdd]);
    } else if (byte == 0xc0) {
      encoded = encoded.concat([0xdb, 0xdc]);
    } else {
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
export const toByteArray = (str: string): number[] => {
  const byteArray: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const charcode = str.charCodeAt(i);
    if (charcode <= 0xff) {
      byteArray.push(charcode);
    }
  }
  return byteArray;
};

export const hexFormatter = (bytes: number[]) =>
  "[" + bytes.map((value) => toHex(value)).join(", ") + "]";

export const toHex = (value: number, size = 2) => {
  const hex = value.toString(16).toUpperCase();
  if (hex.startsWith("-")) {
    return "-0x" + hex.substring(1).padStart(size, "0");
  } else {
    return "0x" + hex.padStart(size, "0");
  }
};

/**
 * Format MAC address array to string (e.g., [0xAA, 0xBB, 0xCC] -> "AA:BB:CC:DD:EE:FF")
 */
export const formatMacAddr = (macAddr: number[]): string => {
  return macAddr
    .map((value) => value.toString(16).toUpperCase().padStart(2, "0"))
    .join(":");
};

/**
 * @name padTo
 * Pad data to the next alignment boundary with the given fill byte (default 0xFF)
 */
export function padTo(
  data: Uint8Array,
  alignment: number,
  padCharacter = 0xff,
): Uint8Array {
  const padMod = data.length % alignment;
  if (padMod !== 0) {
    const padding = new Uint8Array(alignment - padMod).fill(padCharacter);
    const paddedData = new Uint8Array(data.length + padding.length);
    paddedData.set(data);
    paddedData.set(padding, data.length);
    return paddedData;
  }
  return data;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
