const fs = require("node:fs/promises");
const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");
const path = require("node:path");
const { check_and_create_dir, get_caller_info } = require("./utils/helpers");

class Logger {
  /**
   * @param {LogConfig} log_config - logging configuration
   */
  constructor(log_config) {
    log_config = log_config || LogConfig.with_defaults();
    LogConfig.assert(log_config);
    this.#config = log_config;
  }

  /**
   * @type {LogConfig}
   */
  #config;

  /**
   * @returns {Logger} A new instance of Logger with default config.
   */
  static with_defaults() {
    // @ts-ignore
    return new Logger();
  }

  /**
   * @type {fs.FileHandle}
   */
  #log_file_handle;

  async init() {
    const log_dir_path = check_and_create_dir("logs");
    const file_name =
      this.#config.file_prefix +
      new Date().toISOString().replace(/[.:]+/g, "-") +
      ".log";
    this.#log_file_handle = await fs.open(
      path.join(log_dir_path, file_name),
      "a+",
    );
    console.log("File created");
  }

  /**
   *
   * @param {LogConfig} log_config
   * @returns {Logger} A new instance of Logger with the given config.
   */
  static with_config(log_config) {
    return new Logger(log_config);
  }

  /**
   * @returns {LogLevel} The current log level.
   */
  get level() {
    return this.#config.level;
  }
  get file_prefix() {
    return this.#config.file_prefix;
  }

  get time_threshold() {
    return this.#config.rolling_config.time_threshold;
  }

  get size_threshold() {
    return this.#config.rolling_config.size_threshold;
  }

  /**
   * @param {string} message - log message
   * @param {number} log_level - log level
   */
  async #log(message, log_level) {
    // @ts-ignore
    if (log_level < this.#config.level || !this.#log_file_handle.fd) {
      return;
    }
    const date_iso = new Date().toISOString();
    const log_level_string = LogLevel.to_string(log_level);

    const log_message = `[${date_iso}] [${log_level_string}]: ${get_caller_info()} ${message}\n`;

    await this.#log_file_handle.write(log_message);
  }

  /**
   * @param {string} message - debug message
   */
  debug(message) {
    this.#log(message, LogLevel.Debug);
  }

  /**
   * @param {string} message - info message
   */
  info(message) {
    this.#log(message, LogLevel.Info);
  }

  /**
   * @param {string} message - warn message
   */
  warn(message) {
    this.#log(message, LogLevel.Warn);
  }

  /**
   * @param {string} message - error message
   */
  error(message) {
    this.#log(message, LogLevel.Error);
  }

  /**
   * @param {string} message - critical message
   */
  critical(message) {
    this.#log(message, LogLevel.Critical);
  }
}

module.exports = { Logger };
