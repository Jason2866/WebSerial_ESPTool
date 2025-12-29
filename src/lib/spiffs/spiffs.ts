/**
 * SPIFFS Filesystem Implementation
 * Based on ESP-IDF spiffsgen.py
 */

import { SpiffsBuildConfig, SpiffsFullError } from "./spiffsConfig";
import { SpiffsBlock } from "./spiffsBlock";

export interface SpiffsFile {
  name: string;
  size: number;
  data: Uint8Array;
}

export class SpiffsFS {
  private imgSize: number;
  private buildConfig: SpiffsBuildConfig;
  private blocks: SpiffsBlock[];
  private blocksLim: number;
  private remainingBlocks: number;
  private curObjId: number;

  constructor(imgSize: number, buildConfig: SpiffsBuildConfig) {
    if (imgSize % buildConfig.blockSize !== 0) {
      throw new Error("image size should be a multiple of block size");
    }

    this.imgSize = imgSize;
    this.buildConfig = buildConfig;
    this.blocks = [];
    this.blocksLim = Math.floor(this.imgSize / this.buildConfig.blockSize);
    this.remainingBlocks = this.blocksLim;
    this.curObjId = 1; // starting object id
  }

  private createBlock(): SpiffsBlock {
    if (this.isFull()) {
      throw new SpiffsFullError("the image size has been exceeded");
    }

    const block = new SpiffsBlock(this.blocks.length, this.buildConfig);
    this.blocks.push(block);
    this.remainingBlocks--;
    return block;
  }

  isFull(): boolean {
    return this.remainingBlocks <= 0;
  }

  createFile(imgPath: string, contents: Uint8Array): void {
    if (imgPath.length > this.buildConfig.objNameLen) {
      throw new Error(`object name '${imgPath}' too long`);
    }

    const name = imgPath;
    let offset = 0;

    try {
      const block = this.blocks[this.blocks.length - 1];
      block.beginObj(this.curObjId, contents.length, name);
    } catch (e) {
      const block = this.createBlock();
      block.beginObj(this.curObjId, contents.length, name);
    }

    while (offset < contents.length) {
      const chunkSize = Math.min(
        this.buildConfig.OBJ_DATA_PAGE_CONTENT_LEN,
        contents.length - offset,
      );
      const contentsChunk = contents.slice(offset, offset + chunkSize);

      try {
        const block = this.blocks[this.blocks.length - 1];
        try {
          block.updateObj(contentsChunk);
        } catch (e) {
          if (e instanceof SpiffsFullError) {
            if (block.isFull()) {
              throw e;
            }
            // Object index exhausted, write another object index page
            block.beginObj(
              this.curObjId,
              contents.length,
              name,
              block.currentObjIndexSpanIx,
              block.currentObjDataSpanIx,
            );
            continue;
          }
          throw e;
        }
      } catch (e) {
        if (e instanceof SpiffsFullError) {
          // All pages in block exhausted, create new block
          const prevBlock = this.blocks[this.blocks.length - 1];
          const block = this.createBlock();
          block.currentObjId = prevBlock.currentObjId;
          block.currentObjIdxPage = prevBlock.currentObjIdxPage;
          block.currentObjDataSpanIx = prevBlock.currentObjDataSpanIx;
          block.currentObjIndexSpanIx = prevBlock.currentObjIndexSpanIx;
          continue;
        }
        throw e;
      }

      offset += chunkSize;
    }

    const block = this.blocks[this.blocks.length - 1];
    block.endObj();
    this.curObjId++;
  }

  toBinary(): Uint8Array {
    const allBlocks: Uint8Array[] = [];

    for (const block of this.blocks) {
      allBlocks.push(block.toBinary(this.blocksLim));
    }

    let bix = this.blocks.length;
    let remaining = this.remainingBlocks;

    if (this.buildConfig.useMagic) {
      // Create empty blocks with magic numbers
      while (remaining > 0) {
        const block = new SpiffsBlock(bix, this.buildConfig);
        allBlocks.push(block.toBinary(this.blocksLim));
        remaining--;
        bix++;
      }
    } else {
      // Fill remaining space with 0xFF
      const remainingSize =
        this.imgSize - allBlocks.length * this.buildConfig.blockSize;
      if (remainingSize > 0) {
        const padding = new Uint8Array(remainingSize);
        padding.fill(0xff);
        allBlocks.push(padding);
      }
    }

    // Concatenate all blocks
    const totalSize = allBlocks.reduce((sum, block) => sum + block.length, 0);
    const img = new Uint8Array(totalSize);
    let offset = 0;
    for (const block of allBlocks) {
      img.set(block, offset);
      offset += block.length;
    }

    return img;
  }

  listFiles(): SpiffsFile[] {
    // This would require parsing the blocks - implement in fromBinary
    throw new Error("listFiles requires fromBinary to be called first");
  }

  readFile(path: string): Uint8Array {
    // This would require parsing the blocks - implement in fromBinary
    throw new Error("readFile requires fromBinary to be called first");
  }

  deleteFile(path: string): void {
    // SPIFFS doesn't support in-place deletion
    // Need to recreate filesystem without the file
    throw new Error(
      "deleteFile not yet implemented - requires filesystem recreation",
    );
  }
}
