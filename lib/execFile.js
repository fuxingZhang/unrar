const path = require('path');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const bin = path.join(__dirname, '../bin/UnRAR.exe');

/**
* @param {String[]} args
*/
module.exports = async function (args) {
  const { stdout, stderr } = await execFile(bin, args);
  if (stderr) throw new Error(stderr);
  return stdout
}