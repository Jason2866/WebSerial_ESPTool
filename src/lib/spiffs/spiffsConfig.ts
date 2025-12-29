/**
 * SPIFFS Build Configuration
 * Based on ESP-IDF spiffsgen.py
 */

export const SPIFFS_PH_FLAG_USED_FINAL_INDEX = 0xf8;
export const SPIFFS_PH_FLAG_USED_FINAL = 0xfc;
export const SPIFFS_PH_FLAG_LEN = 1;
export const SPIFFS_PH_IX_SIZE_LEN = 4;
export const SPIFFS_PH_IX_OBJ_TYPE_LEN = 1;
export const SPIFFS_TYPE_FILE = 1;

// Based on typedefs under spiffs_config.h
export const SPIFFS_OBJ_ID_LEN = 2; // spiffs_obj_id
export const SPIFFS_SPAN_IX_LEN = 2; // spiffs_span_ix
export const SPIFFS_PAGE_IX_LEN = 2; // spiffs_page_ix
export const SPIFFS_BLOCK_IX_LEN = 2; // spiffs_block_ix

export interface SpiffsBuildConfigOptions {
  pageSize: number;
  blockSize: number;
  objNameLen?: number;
  metaLen?: number;
  pageIxLen?: number;
  blockIxLen?: number;
  objIdLen?: number;
  spanIxLen?: number;
  packed?: boolean;
  aligned?: boolean;
  endianness?: "little" | "big";
  useMagic?: boolean;
  useMagicLen?: boolean;
  alignedObjIxTables?: boolean;
}

export class SpiffsBuildConfig {
  pageSize: number;
  blockSize: number;
  objIdLen: number;
  spanIxLen: number;
  packed: boolean;
  aligned: boolean;
  objNameLen: number;
  metaLen: number;
  pageIxLen: number;
  blockIxLen: number;
  endianness: "little" | "big";
  useMagic: boolean;
  useMagicLen: boolean;
  alignedObjIxTables: boolean;

  PAGES_PER_BLOCK: number;
  OBJ_LU_PAGES_PER_BLOCK: number;
  OBJ_USABLE_PAGES_PER_BLOCK: number;
  OBJ_LU_PAGES_OBJ_IDS_LIM: number;
  OBJ_DATA_PAGE_HEADER_LEN: number;
  OBJ_DATA_PAGE_HEADER_LEN_ALIGNED: number;
  OBJ_DATA_PAGE_HEADER_LEN_ALIGNED_PAD: number;
  OBJ_DATA_PAGE_CONTENT_LEN: number;
  OBJ_INDEX_PAGES_HEADER_LEN: number;
  OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED: number;
  OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED_PAD: number;
  OBJ_INDEX_PAGES_OBJ_IDS_HEAD_LIM: number;
  OBJ_INDEX_PAGES_OBJ_IDS_LIM: number;

  constructor(options: SpiffsBuildConfigOptions) {
    if (options.blockSize % options.pageSize !== 0) {
      throw new Error("block size should be a multiple of page size");
    }

    this.pageSize = options.pageSize;
    this.blockSize = options.blockSize;
    this.objIdLen = options.objIdLen ?? SPIFFS_OBJ_ID_LEN;
    this.spanIxLen = options.spanIxLen ?? SPIFFS_SPAN_IX_LEN;
    this.packed = options.packed ?? true;
    this.aligned = options.aligned ?? true;
    this.objNameLen = options.objNameLen ?? 32;
    this.metaLen = options.metaLen ?? 4;
    this.pageIxLen = options.pageIxLen ?? SPIFFS_PAGE_IX_LEN;
    this.blockIxLen = options.blockIxLen ?? SPIFFS_BLOCK_IX_LEN;
    this.endianness = options.endianness ?? "little";
    this.useMagic = options.useMagic ?? true;
    this.useMagicLen = options.useMagicLen ?? true;
    this.alignedObjIxTables = options.alignedObjIxTables ?? false;

    this.PAGES_PER_BLOCK = Math.floor(this.blockSize / this.pageSize);
    this.OBJ_LU_PAGES_PER_BLOCK = Math.ceil(
      ((this.blockSize / this.pageSize) * this.objIdLen) / this.pageSize,
    );
    this.OBJ_USABLE_PAGES_PER_BLOCK =
      this.PAGES_PER_BLOCK - this.OBJ_LU_PAGES_PER_BLOCK;
    this.OBJ_LU_PAGES_OBJ_IDS_LIM = Math.floor(this.pageSize / this.objIdLen);

    this.OBJ_DATA_PAGE_HEADER_LEN =
      this.objIdLen + this.spanIxLen + SPIFFS_PH_FLAG_LEN;
    const pad =
      4 -
      (this.OBJ_DATA_PAGE_HEADER_LEN % 4 === 0
        ? 4
        : this.OBJ_DATA_PAGE_HEADER_LEN % 4);
    this.OBJ_DATA_PAGE_HEADER_LEN_ALIGNED = this.OBJ_DATA_PAGE_HEADER_LEN + pad;
    this.OBJ_DATA_PAGE_HEADER_LEN_ALIGNED_PAD = pad;
    this.OBJ_DATA_PAGE_CONTENT_LEN =
      this.pageSize - this.OBJ_DATA_PAGE_HEADER_LEN;

    this.OBJ_INDEX_PAGES_HEADER_LEN =
      this.OBJ_DATA_PAGE_HEADER_LEN_ALIGNED +
      SPIFFS_PH_IX_SIZE_LEN +
      SPIFFS_PH_IX_OBJ_TYPE_LEN +
      this.objNameLen +
      this.metaLen;

    if (this.alignedObjIxTables) {
      this.OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED =
        (this.OBJ_INDEX_PAGES_HEADER_LEN + SPIFFS_PAGE_IX_LEN - 1) &
        ~(SPIFFS_PAGE_IX_LEN - 1);
      this.OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED_PAD =
        this.OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED -
        this.OBJ_INDEX_PAGES_HEADER_LEN;
    } else {
      this.OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED = this.OBJ_INDEX_PAGES_HEADER_LEN;
      this.OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED_PAD = 0;
    }

    this.OBJ_INDEX_PAGES_OBJ_IDS_HEAD_LIM = Math.floor(
      (this.pageSize - this.OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED) /
        this.blockIxLen,
    );
    this.OBJ_INDEX_PAGES_OBJ_IDS_LIM = Math.floor(
      (this.pageSize - this.OBJ_DATA_PAGE_HEADER_LEN_ALIGNED) / this.blockIxLen,
    );
  }
}

export class SpiffsFullError extends Error {
  constructor(message = "SPIFFS is full") {
    super(message);
    this.name = "SpiffsFullError";
  }
}
