// ESM shim for style-to-js to provide a default export
// The package publishes CJS that sets module.exports = StyleToJS (no ESM default).
// This shim imports the CJS and re-exports a default for ESM consumers.
import StyleToJS_cjs from 'style-to-js/cjs/index.js';

const StyleToJS = StyleToJS_cjs && StyleToJS_cjs.default ? StyleToJS_cjs.default : StyleToJS_cjs;
export default StyleToJS;
export { StyleToJS };
