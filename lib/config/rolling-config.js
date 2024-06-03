const {
  RollingTimeOptions,
  RollingSizeOptions,
} = require("../utils/rolling-options");

class RollingConfig {
  /**
   * Roll/Create new file every time the current file size exceeds this threshold in `seconds`.
   * @type {RollingTimeOptions}
   */
  #time_threshold = RollingTimeOptions.Hourly;

  /**
   * @type {RollingSizeOptions}
   */
  #size_threshold = RollingSizeOptions.FiveMB;

  /**
   * @returns {RollingConfig} A new instance of RollingConfig with default values.
   */
  static with_defaults() {
    return new RollingConfig();
  }

  /**
   * @param {number} size_threshold Roll/Create new file every time the current file size exceeds this threshold.
   * @returns {RollingConfig} The current instance of RollingConfig.
   */
  with_size_threshold(size_threshold) {
    RollingSizeOptions.assert(size_threshold);
    this.#size_threshold = size_threshold;
    return this;
  }

  /**
   * @param {time_threshold} time_threshold Roll/Create new file every time the current file size exceeds this threshold.
   * @returns {RollingConfig} The current instance of RollingConfig.
   * @throws {Error} If the time_threshold is not an instance of RollingTimeOptions.
   */
  // @ts-ignore
  with_time_threshold(time_threshold) {
    RollingTimeOptions.assert(time_threshold);
    this.#time_threshold = time_threshold;
    return this;
  }

  /**
   * @typedef {object} JsonRollingConfig
   * @property {number} [size_threshold] current file size threshold
   * @property {number} [time_threshold] current file time threshold
   * @property {RollingConfig} [rolling_config] a current instance of RollingConfig
   */

  /**
   * @param {JsonRollingConfig} json The json object to be parsed into {RollingConfig}.
   * @returns {RollingConfig} A new instance of RollingConfig with values from the json object.
   * @throws {Error} If the json is not valid.
   */
  static from_json(json) {
    let rolling_config = new RollingConfig();

    Object.keys(json).forEach((key) => {
      switch (key) {
        case "size_threshold":
          rolling_config = rolling_config.with_size_threshold(json[key]);
          break;
        case "time_threshold":
          rolling_config = rolling_config.with_time_threshold(json[key]);
          break;
      }
    });

    return rolling_config;
  }
  get time_threshold() {
    return this.#time_threshold;
  }
  get size_threshold() {
    return this.#size_threshold;
  }
}

module.exports = { RollingConfig };
