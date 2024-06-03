const path = require("node:path");
const { Logger, LogConfig } = require("./index");

/**
 * @returns {Promise<Logger>} The logger with config
 */
async function init_logger() {
  let logger = Logger.with_config(
    LogConfig.from_file(path.join(__dirname, "./config.json")),
  );
  await logger.init();
  // @ts-ignore
  return logger;
}

/**
 *
 */
async function main() {
  const logger = await init_logger();
  // @ts-ignore
  logger.critical("From the main() function");
  nested_func(logger);
}
/**
 *@param {Logger} logger - current Logger instance
 */
function nested_func(logger) {
  // @ts-ignore
  logger.critical("From the nested_func() function");
  super_nested(logger);
}

/**
 *@param {Logger} logger - current Logger instance
 */
function super_nested(logger) {
  // @ts-ignore
  logger.critical("From the super_nested() function");
}
main();
