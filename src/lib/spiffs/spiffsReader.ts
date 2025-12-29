/**
 * SPIFFS Reader - Parse and extract files from SPIFFS images
 * Based on ESP-IDF spiffsgen.py extract_files() method
 */

import {
  SpiffsBuildConfig,
  SPIFFS_PH_FLAG_USED_FINAL_INDEX,
  SPIFFS_PH_FLAG_USED_FINAL,
  SPIFFS_PH_FLAG_LEN,
  SPIFFS_PH_IX_SIZE_LEN,
  SPIFFS_PH_IX_OBJ_TYPE_LEN,
} from "./spiffsConfig";
import type { SpiffsFile } from "./spiffs";

interface FileInfo {
  name: string | null;
  size: number;
  dataPages: Array<[number, Uint8Array]>; // [span_ix, content]
}

export class SpiffsReader {
  private buildConfig: SpiffsBuildConfig;
  private imageData: Uint8Array;
  private filesMap: Map<number, FileInfo>;

  constructor(imageData: Uint8Array, buildConfig: SpiffsBuildConfig) {
    this.imageData = imageData;
    this.buildConfig = buildConfig;
    this.filesMap = new Map();
  }

  private unpack(format: string, data: Uint8Array, offset = 0): number[] {
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

  parse(): void {
    const blocksCount = Math.floor(
      this.imageData.length / this.buildConfig.blockSize,
    );

    for (let bix = 0; bix < blocksCount; bix++) {
      const blockOffset = bix * this.buildConfig.blockSize;
      const blockData = this.imageData.slice(
        blockOffset,
        blockOffset + this.buildConfig.blockSize,
      );

      this.parseBlock(blockData);
    }
  }

  private parseBlock(blockData: Uint8Array): void {
    // Parse lookup pages to find valid objects
    for (
      let pageIdx = 0;
      pageIdx < this.buildConfig.OBJ_LU_PAGES_PER_BLOCK;
      pageIdx++
    ) {
      const luPageOffset = pageIdx * this.buildConfig.pageSize;
      const luPageData = blockData.slice(
        luPageOffset,
        luPageOffset + this.buildConfig.pageSize,
      );

      // Parse object IDs from lookup page
      for (let i = 0; i < luPageData.length; i += this.buildConfig.objIdLen) {
        if (i + this.buildConfig.objIdLen > luPageData.length) break;

        const objIdBytes = luPageData.slice(i, i + this.buildConfig.objIdLen);
        const [objId] = this.unpack(
          this.buildConfig.objIdLen === 1
            ? "B"
            : this.buildConfig.objIdLen === 2
              ? "H"
              : "I",
          objIdBytes,
        );

        // Check if it's a valid object (not erased/empty)
        const emptyValue = (1 << (this.buildConfig.objIdLen * 8)) - 1;
        if (objId === emptyValue) continue;

        // Check if it's an index page (MSB set)
        const isIndex =
          (objId & (1 << (this.buildConfig.objIdLen * 8 - 1))) !== 0;
        const realObjId = objId & ~(1 << (this.buildConfig.objIdLen * 8 - 1));

        if (isIndex && !this.filesMap.has(realObjId)) {
          this.filesMap.set(realObjId, {
            name: null,
            size: 0,
            dataPages: [],
          });
        }
      }
    }

    // Parse actual pages to get file metadata and content
    for (
      let pageIdx = this.buildConfig.OBJ_LU_PAGES_PER_BLOCK;
      pageIdx < this.buildConfig.PAGES_PER_BLOCK;
      pageIdx++
    ) {
      const pageOffset = pageIdx * this.buildConfig.pageSize;
      const pageData = blockData.slice(
        pageOffset,
        pageOffset + this.buildConfig.pageSize,
      );

      this.parsePage(pageData);
    }
  }

  private parsePage(pageData: Uint8Array): void {
    // Parse page header
    const headerFormat =
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

    const headerSize =
      this.buildConfig.objIdLen +
      this.buildConfig.spanIxLen +
      SPIFFS_PH_FLAG_LEN;

    if (pageData.length < headerSize) return;

    const [objId, spanIx, flags] = this.unpack(headerFormat, pageData);

    // Check for valid page
    const emptyId = (1 << (this.buildConfig.objIdLen * 8)) - 1;
    if (objId === emptyId) return;

    const isIndex = (objId & (1 << (this.buildConfig.objIdLen * 8 - 1))) !== 0;
    const realObjId = objId & ~(1 << (this.buildConfig.objIdLen * 8 - 1));

    if (isIndex && flags === SPIFFS_PH_FLAG_USED_FINAL_INDEX) {
      // Index page - contains file metadata
      if (!this.filesMap.has(realObjId)) {
        this.filesMap.set(realObjId, {
          name: null,
          size: 0,
          dataPages: [],
        });
      }

      // Only first index page (span_ix == 0) has filename and size
      if (spanIx === 0) {
        this.parseIndexPage(pageData, headerSize, realObjId);
      }
    } else if (!isIndex && flags === SPIFFS_PH_FLAG_USED_FINAL) {
      // Data page - contains file content
      if (this.filesMap.has(realObjId)) {
        const contentStart = headerSize;
        const content = pageData.slice(
          contentStart,
          contentStart + this.buildConfig.OBJ_DATA_PAGE_CONTENT_LEN,
        );
        this.filesMap.get(realObjId)!.dataPages.push([spanIx, content]);
      }
    }
  }

  private parseIndexPage(
    pageData: Uint8Array,
    headerSize: number,
    objId: number,
  ): void {
    // Skip to size and type fields
    let offset =
      headerSize + this.buildConfig.OBJ_DATA_PAGE_HEADER_LEN_ALIGNED_PAD;

    const sizeTypeFormat = "IB";
    const sizeTypeSize = SPIFFS_PH_IX_SIZE_LEN + SPIFFS_PH_IX_OBJ_TYPE_LEN;

    if (offset + sizeTypeSize <= pageData.length) {
      const [fileSize] = this.unpack(sizeTypeFormat, pageData, offset);
      offset += sizeTypeSize;

      // Read filename
      const nameEnd = offset + this.buildConfig.objNameLen;
      if (nameEnd <= pageData.length) {
        const nameBytes = pageData.slice(offset, nameEnd);
        // Find null terminator
        const nullPos = nameBytes.indexOf(0);
        const actualNameBytes =
          nullPos !== -1 ? nameBytes.slice(0, nullPos) : nameBytes;
        const filename = new TextDecoder().decode(actualNameBytes);

        const fileInfo = this.filesMap.get(objId)!;
        fileInfo.name = filename;
        fileInfo.size = fileSize;
      }
    }
  }

  listFiles(): SpiffsFile[] {
    const files: SpiffsFile[] = [];

    for (const [, fileInfo] of this.filesMap) {
      if (fileInfo.name === null) continue;

      // Sort data pages by span index
      fileInfo.dataPages.sort((a, b) => a[0] - b[0]);

      // Reconstruct file content
      const chunks: Uint8Array[] = [];
      let totalWritten = 0;

      for (const [, content] of fileInfo.dataPages) {
        const remaining = fileInfo.size - totalWritten;
        if (remaining <= 0) break;

        const toWrite = Math.min(content.length, remaining);
        chunks.push(content.slice(0, toWrite));
        totalWritten += toWrite;
      }

      // Concatenate chunks
      const data = new Uint8Array(totalWritten);
      let offset = 0;
      for (const chunk of chunks) {
        data.set(chunk, offset);
        offset += chunk.length;
      }

      files.push({
        name: fileInfo.name,
        size: fileInfo.size,
        data,
      });
    }

    return files;
  }

  readFile(path: string): Uint8Array | null {
    const files = this.listFiles();
    const file = files.find((f) => f.name === path || f.name === "/" + path);
    return file ? file.data : null;
  }
}
