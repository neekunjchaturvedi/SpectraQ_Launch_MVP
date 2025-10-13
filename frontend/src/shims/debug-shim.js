// Minimal ESM shim for the `debug` package to provide a default export.
// Many browser bundles only need a no-op or console-backed logger.

function createDebug(namespace = '') {
  const logger = (...args) => {
    // Uncomment to see logs in console
    // console.debug(`[${namespace}]`, ...args)
  };
  logger.enabled = false;
  logger.extend = (sub) => createDebug(namespace ? `${namespace}:${sub}` : sub);
  return logger;
}

createDebug.enable = () => {};
createDebug.disable = () => {};
createDebug.enabled = () => false;
createDebug.log = (...args) => {
  // console.debug(...args)
};

export default createDebug;
export { createDebug as debug };
