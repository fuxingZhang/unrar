const path = require('path');
const { spawn } = require('child_process');
const bin = path.join(__dirname, '../bin/UnRAR.exe');

/**
* @param {String[]} args
*/
module.exports = function (args) {
  return spawn(bin, args);
}