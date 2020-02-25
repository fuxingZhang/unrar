const spawn = require('./spawn');
const reg_password = /^\r\nEnter password \(will not be echoed\)/;

/**
* @param {String[]} args
*/
async function getList(args) {
  let errMsg = '';
  const chunks = [];
  return new Promise((resolve, reject) => {
    const unrar = spawn(args, {
      stdio: [
        0,
        'pipe',
        'pipe'
      ]
    });

    unrar.stderr.on('data', chunk => {
      const data = chunk.toString();
      if (reg_password.test(data)) {
        unrar.kill();
        const error = new Error('Password protected file');
        return reject(error);
      }
      errMsg += data;
    });

    unrar.stdout.on('data', chunk => {
      chunks.push(chunk);
    });

    unrar.on('exit', code => {
      if (code !== 0 || errMsg) {
        const error = new Error(errMsg);
        error.code = code;
        return reject(error);
      }
      const data = Buffer.concat(chunks).toString('utf8');
      resolve(data);
    });
  })
}

module.exports = getList