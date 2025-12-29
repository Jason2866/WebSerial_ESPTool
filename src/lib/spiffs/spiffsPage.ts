/**
 * SPIFFS Page Classes
 * Based on ESP-IDF spiffsgen.py
 */

import {
  SpiffsBuildConfig,
  SpiffsFullError,
  SPIFFS_PH_FLAG_USED_FINAL_INDEX,
  SPIFFS_PH_FLAG_USED_FINAL,
  SPIFFS_TYPE_FILE,
} from "./spiffsConfig";

export abstract class SpiffsPage {
  protected buildConfig: SpiffsBuildConfig;
  protected bix: number;

  constructor(bix: number, buildConfig: SpiffsBuildConfig) {
    this.buildConfig = buildConfig;
    this.bix = bix;
  }

  abstract toBinary(): Uint8Array;

  protected pack(format: string, ...values: number[]): Uint8Array {
    const buffer = new ArrayBuffer(this.calcSize(format));
    const view = new DataView(buffer);
    let offset = 0;

    for (let i = 0; i < format.length; i++) {
      const type = format[i];
      const value = values[i];

      switch (type) {
        case "B": // unsigned char (1 byte)
          view.setUint8(offset, value);
          offset += 1;
          break;
        case "H": // unsigned short (2 bytes)
          if (this.buildConfig.endianness === "little") {
            view.setUint16(offset, value, true);
          } else {
            view.setUint16(offset, value, false);
          }
          offset += 2;
          break;
        case "I": // unsigned int (4 bytes)
          if (this.buildConfig.endianness === "little") {
            view.setUint32(offset, value, true);
          } else {
            view.setUint32(offset, value, false);
          }
          offset += 4;
          break;
      }
    }

    return new Uint8Array(buffer);
  }

  protected unpack(format: string, data: Uint8Array, offset = 0): number[] {
    const view = new DataView(data.buffer, data.byteOffset + offset);
    const results: number[] = [];
    let pos = 0;

    for (const type of format) {
      switch (type) {
        case "B":
          results.push(view.getUint8(pos));
          pos += 1;
          break;
        case "H":
          results.push(
            this.buildConfig.endianness === "little"
              ? view.getUint16(pos, true)
              : view.getUint16(pos, false),
          );
          pos += 2;
          break;
        case "I":
          results.push(
            this.buildConfig.endianness === "little"
              ? view.getUint32(pos, true)
              : view.getUint32(pos, false),
          );
          pos += 4;
          break;
      }
    }

    return results;
  }

  private calcSize(format: string): number {
    let size = 0;
    for (const type of format) {
      switch (type) {
        case "B":
          size += 1;
          break;
        case "H":
          size += 2;
          break;
        case "I":
          size += 4;
          break;
      }
    }
    return size;
  }
}

export abstract class SpiffsObjPageWithIdx extends SpiffsPage {
  protected objId: number;

  constructor(objId: number, buildConfig: SpiffsBuildConfig) {
    super(0, buildConfig);
    this.objId = objId;
  }

  getObjId(): number {
    return this.objId;
  }
}

export class SpiffsObjLuPage extends SpiffsPage {
  private objIdsLimit: number;
  private objIds: Array<[number, string]>; // [objId, pageType]

  constructor(bix: number, buildConfig: SpiffsBuildConfig) {
    super(bix, buildConfig);
    this.objIdsLimit = this.buildConfig.OBJ_LU_PAGES_OBJ_IDS_LIM;
    this.objIds = [];
  }

  private calcMagic(blocksLim: number): number {
    let magic = 0x20140529 ^ this.buildConfig.pageSize;
    if (this.buildConfig.useMagicLen) {
      magic = magic ^ (blocksLim - this.bix);
    }
    const mask = (1 << (8 * this.buildConfig.objIdLen)) - 1;
    return magic & mask;
  }

  registerPage(page: SpiffsObjPageWithIdx): void {
    if (this.objIdsLimit <= 0) {
      throw new SpiffsFullError();
    }
    const pageType = page instanceof SpiffsObjIndexPage ? "index" : "data";
    this.objIds.push([page.getObjId(), pageType]);
    this.objIdsLimit--;
  }

  toBinary(): Uint8Array {
    const img = new Uint8Array(this.buildConfig.pageSize);
    img.fill(0xff);

    let offset = 0;
    for (const [objId, pageType] of this.objIds) {
      let id = objId;
      if (pageType === "index") {
        id ^= 1 << (this.buildConfig.objIdLen * 8 - 1);
      }

      const packed = this.pack(
        this.buildConfig.objIdLen === 1
          ? "B"
          : this.buildConfig.objIdLen === 2
            ? "H"
            : "I",
        id,
      );
      img.set(packed, offset);
      offset += packed.length;
    }

    return img;
  }

  magicfy(blocksLim: number): void {
    const remaining = this.objIdsLimit;
    const emptyObjId = (1 << (this.buildConfig.objIdLen * 8)) - 1;

    if (remaining >= 2) {
      for (let i = 0; i < remaining; i++) {
        if (i === remaining - 2) {
          this.objIds.push([this.calcMagic(blocksLim), "data"]);
          break;
        } else {
          this.objIds.push([emptyObjId, "data"]);
        }
        this.objIdsLimit--;
      }
    }
  }
}

export class SpiffsObjIndexPage extends SpiffsObjPageWithIdx {
  private spanIx: number;
  private name: string;
  private size: number;
  private pagesLim: number;
  private pages: number[];

  constructor(
    objId: number,
    spanIx: number,
    size: number,
    name: string,
    buildConfig: SpiffsBuildConfig,
  ) {
    super(objId, buildConfig);
    this.spanIx = spanIx;
    this.name = name;
    this.size = size;

    if (this.spanIx === 0) {
      this.pagesLim = this.buildConfig.OBJ_INDEX_PAGES_OBJ_IDS_HEAD_LIM;
    } else {
      this.pagesLim = this.buildConfig.OBJ_INDEX_PAGES_OBJ_IDS_LIM;
    }
    this.pages = [];
  }

  registerPage(page: SpiffsObjDataPage): void {
    if (this.pagesLim <= 0) {
      throw new SpiffsFullError();
    }
    this.pages.push(page.offset);
    this.pagesLim--;
  }

  toBinary(): Uint8Array {
    const img = new Uint8Array(this.buildConfig.pageSize);
    img.fill(0xff);

    const objId = this.objId ^ (1 << (this.buildConfig.objIdLen * 8 - 1));

    const format =
      (this.buildConfig.objIdLen === 1
        ? "B"
        : this.buildConfig.objIdLen === 2
          ? "H"
          : "I") +
      (this.buildConfig.spanIxLen === 1
        ? "B"
        : this.buildConfig.spanIxLen === 2
          ? "H"
          : "I") +
      "B";

    let offset = 0;
    const header = this.pack(
      format,
      objId,
      this.spanIx,
      SPIFFS_PH_FLAG_USED_FINAL_INDEX,
    );
    img.set(header, offset);
    offset += header.length;

    // Add padding
    offset += this.buildConfig.OBJ_DATA_PAGE_HEADER_LEN_ALIGNED_PAD;

    // If first index page, add filename, type and size
    if (this.spanIx === 0) {
      const sizeType = this.pack("IB", this.size, SPIFFS_TYPE_FILE);
      img.set(sizeType, offset);
      offset += sizeType.length;

      // Write filename with proper null-termination
      const nameBytes = new TextEncoder().encode(this.name);
      // Ensure we don't exceed objNameLen
      const bytesToWrite = Math.min(
        nameBytes.length,
        this.buildConfig.objNameLen,
      );
      img.set(nameBytes.slice(0, bytesToWrite), offset);
      // The rest is already 0xFF from img.fill(0xff), but SPIFFS expects 0x00 for unused name bytes
      // Fill remaining name bytes with 0x00
      for (let i = bytesToWrite; i < this.buildConfig.objNameLen; i++) {
        img[offset + i] = 0x00;
      }
      offset +=
        this.buildConfig.objNameLen +
        this.buildConfig.metaLen +
        this.buildConfig.OBJ_INDEX_PAGES_HEADER_LEN_ALIGNED_PAD;
    }

    // Add page indices
    for (const page of this.pages) {
      // Calculate page index by dividing page offset by page size
      // pageSize is always a power of 2, so integer division is safe
      const pageIx = Math.floor(page / this.buildConfig.pageSize);
      const pageIxPacked = this.pack(
        this.buildConfig.pageIxLen === 1
          ? "B"
          : this.buildConfig.pageIxLen === 2
            ? "H"
            : "I",
        pageIx,
      );
      img.set(pageIxPacked, offset);
      offset += pageIxPacked.length;
    }

    return img;
  }
}

export class SpiffsObjDataPage extends SpiffsObjPageWithIdx {
  offset: number;
  private spanIx: number;
  private contents: Uint8Array;

  constructor(
    offset: number,
    objId: number,
    spanIx: number,
    contents: Uint8Array,
    buildConfig: SpiffsBuildConfig,
  ) {
    super(objId, buildConfig);
    this.offset = offset;
    this.spanIx = spanIx;
    this.contents = contents;
  }

  toBinary(): Uint8Array {
    const img = new Uint8Array(this.buildConfig.pageSize);
    img.fill(0xff);

    const format =
      (this.buildConfig.objIdLen === 1
        ? "B"
        : this.buildConfig.objIdLen === 2
          ? "H"
          : "I") +
      (this.buildConfig.spanIxLen === 1
        ? "B"
        : this.buildConfig.spanIxLen === 2
          ? "H"
          : "I") +
      "B";

    const header = this.pack(
      format,
      this.objId,
      this.spanIx,
      SPIFFS_PH_FLAG_USED_FINAL,
    );
    img.set(header, 0);
    img.set(this.contents, header.length);

    return img;
  }
}
