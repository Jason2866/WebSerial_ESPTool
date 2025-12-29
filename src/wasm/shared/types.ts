/**
 * Shared types for filesystem implementations
 */

/**
 * File source can be a string, Uint8Array, or ArrayBuffer
 */
export type FileSource = string | Uint8Array | ArrayBuffer;

/**
 * Binary source for filesystem images (Uint8Array or ArrayBuffer)
 */
export type BinarySource = Uint8Array | ArrayBuffer;
