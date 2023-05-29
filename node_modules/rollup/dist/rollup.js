/*
  @license
	Rollup.js v3.23.0
	Mon, 22 May 2023 05:28:38 GMT - commit 5ea36552c447d2903050d2622f2dcae3dd2df975

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const rollup = require('./shared/rollup.js');
const watchProxy = require('./shared/watch-proxy.js');
require('node:process');
require('tty');
require('node:path');
require('path');
require('node:perf_hooks');
require('node:crypto');
require('node:fs/promises');
require('./shared/fsevents-importer.js');



exports.VERSION = rollup.version;
exports.defineConfig = rollup.defineConfig;
exports.rollup = rollup.rollup;
exports.watch = watchProxy.watch;
//# sourceMappingURL=rollup.js.map
