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

// const spawn = require('./spawn');
// /**
// * @param {String[]} args
// */
// module.exports = function (args) {
//   return new Promise((resolve, reject) => {
//     const child = spawn(args);
//     const bufs = [];

//     child.stdout.on('data', data => {
//       bufs.push(data);
//       data = data.toString().trim();
//     });

//     child.stderr.on('data', data => {
//       data = data.toString().trim();
//       if (data.indexOf('Enter password') === 0) {
//         child.kill();
//         return reject(new Error('Password protected file'));
//       }
//       reject(new Error(data));
//     });

//     child.on('close', (code, signal) => {
//       const result = Buffer.concat(bufs).toString();
//       resolve(result);
//     });
//   });
// }