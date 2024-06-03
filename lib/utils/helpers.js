const fs_sync = require("node:fs");
const path = require("path");

function get_caller_info() {
  const error = {};
  Error.captureStackTrace(error);

  // @ts-ignore
  const caller_frame = error.stack.split("\n")[4];

  const meta_data = caller_frame.split("at ").pop();
  return meta_data;
}

/**
 * @param {string} path_to_dir - path to directory
 * @returns {string} The path to the directory
 */
function check_and_create_dir(path_to_dir) {
  const log_dir = path.resolve(require.main.path, path_to_dir);
  if (!fs_sync.existsSync(log_dir)) {
    fs_sync.mkdirSync(log_dir, { recursive: true });
  }
  return log_dir;
}

module.exports = {
  check_and_create_dir,
  get_caller_info,
};
