// __test-utils__/custom-jest-environment.js
// Stolen from: https://github.com/ipfs/jest-environment-aegir/blob/master/src/index.js
// Overcomes error from jest internals.. this thing: https://github.com/facebook/jest/issues/6248

'use strict'

const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

class HeliosJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }
  async setup() {
    await super.setup();
    this.global.Uint32Array= Uint32Array;
    this.global.Uint8Array= Uint8Array;
    this.global.ArrayBuffer= ArrayBuffer;

  }
}

module.exports = HeliosJSDOMEnvironment