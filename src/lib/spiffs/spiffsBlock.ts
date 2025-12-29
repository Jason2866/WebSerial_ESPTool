/**
 * SPIFFS Block Class
 * Based on ESP-IDF spiffsgen.py
 */

import { SpiffsBuildConfig, SpiffsFullError } from "./spiffsConfig";
import {
  SpiffsPage,
  SpiffsObjLuPage,
  SpiffsObjIndexPage,
  SpiffsObjDataPage,
  SpiffsObjPageWithIdx,
} from "./spiffsPage";

export class SpiffsBlock {
  private buildConfig: SpiffsBuildConfig;
  private offset: number;
  private remainingPages: number;
  private pages: SpiffsPage[];
  private bix: number;
  private luPages: SpiffsObjLuPage[];
  private luPageIter: Iterator<SpiffsObjLuPage>;
  private luPage: SpiffsObjLuPage | null;

  private curObjIndexSpanIx: number;
  private curObjDataSpanIx: number;
  private curObjId: number;
  private curObjIdxPage: SpiffsObjIndexPage | null;

  constructor(bix: number, buildConfig: SpiffsBuildConfig) {
    this.buildConfig = buildConfig;
    this.offset = bix * this.buildConfig.blockSize;
    this.remainingPages = this.buildConfig.OBJ_USABLE_PAGES_PER_BLOCK;
    this.pages = [];
    this.bix = bix;

    this.luPages = [];
    for (let i = 0; i < this.buildConfig.OBJ_LU_PAGES_PER_BLOCK; i++) {
      const page = new SpiffsObjLuPage(this.bix, this.buildConfig);
      this.luPages.push(page);
    }
    this.pages.push(...this.luPages);

    this.luPageIter = this.luPages[Symbol.iterator]();
    this.luPage = this.luPageIter.next().value || null;

    this.curObjIndexSpanIx = 0;
    this.curObjDataSpanIx = 0;
    this.curObjId = 0;
    this.curObjIdxPage = null;
  }

  private reset(): void {
    this.curObjIndexSpanIx = 0;
    this.curObjDataSpanIx = 0;
    this.curObjId = 0;
    this.curObjIdxPage = null;
  }

  private registerPage(page: SpiffsObjPageWithIdx): void {
    if (page instanceof SpiffsObjDataPage) {
      if (!this.curObjIdxPage) {
        throw new Error("No current object index page");
      }
      this.curObjIdxPage.registerPage(page);
    }

    try {
      if (!this.luPage) {
        throw new SpiffsFullError();
      }
      this.luPage.registerPage(page);
    } catch (e) {
      if (e instanceof SpiffsFullError) {
        const next = this.luPageIter.next();
        if (next.done) {
          throw new Error(
            "Invalid attempt to add page to a block when there is no more space in lookup",
          );
        }
        this.luPage = next.value;
        this.luPage.registerPage(page);
      } else {
        throw e;
      }
    }

    this.pages.push(page);
  }

  beginObj(
    objId: number,
    size: number,
    name: string,
    objIndexSpanIx = 0,
    objDataSpanIx = 0,
  ): void {
    if (this.remainingPages <= 0) {
      throw new SpiffsFullError();
    }

    this.reset();
    this.curObjId = objId;
    this.curObjIndexSpanIx = objIndexSpanIx;
    this.curObjDataSpanIx = objDataSpanIx;

    const page = new SpiffsObjIndexPage(
      objId,
      this.curObjIndexSpanIx,
      size,
      name,
      this.buildConfig,
    );
    this.registerPage(page);
    this.curObjIdxPage = page;
    this.remainingPages--;
    this.curObjIndexSpanIx++;
  }

  updateObj(contents: Uint8Array): void {
    if (this.remainingPages <= 0) {
      throw new SpiffsFullError();
    }

    const page = new SpiffsObjDataPage(
      this.offset + this.pages.length * this.buildConfig.pageSize,
      this.curObjId,
      this.curObjDataSpanIx,
      contents,
      this.buildConfig,
    );
    this.registerPage(page);
    this.curObjDataSpanIx++;
    this.remainingPages--;
  }

  endObj(): void {
    this.reset();
  }

  isFull(): boolean {
    return this.remainingPages <= 0;
  }

  toBinary(blocksLim: number): Uint8Array {
    const img = new Uint8Array(this.buildConfig.blockSize);
    img.fill(0xff);

    let offset = 0;
    if (this.buildConfig.useMagic) {
      for (let idx = 0; idx < this.pages.length; idx++) {
        const page = this.pages[idx];
        if (idx === this.buildConfig.OBJ_LU_PAGES_PER_BLOCK - 1) {
          if (page instanceof SpiffsObjLuPage) {
            page.magicfy(blocksLim);
          }
        }
        const pageBinary = page.toBinary();
        img.set(pageBinary, offset);
        offset += pageBinary.length;
      }
    } else {
      for (const page of this.pages) {
        const pageBinary = page.toBinary();
        img.set(pageBinary, offset);
        offset += pageBinary.length;
      }
    }

    return img;
  }

  get currentObjIndexSpanIx(): number {
    return this.curObjIndexSpanIx;
  }

  get currentObjDataSpanIx(): number {
    return this.curObjDataSpanIx;
  }

  get currentObjId(): number {
    return this.curObjId;
  }

  get currentObjIdxPage(): SpiffsObjIndexPage | null {
    return this.curObjIdxPage;
  }

  set currentObjId(value: number) {
    this.curObjId = value;
  }

  set currentObjIdxPage(value: SpiffsObjIndexPage | null) {
    this.curObjIdxPage = value;
  }

  set currentObjDataSpanIx(value: number) {
    this.curObjDataSpanIx = value;
  }

  set currentObjIndexSpanIx(value: number) {
    this.curObjIndexSpanIx = value;
  }
}
