'use strict';
const { Readable } = require('stream');
const spawn = require('./spawn');

class UnrarStream extends Readable {
  #stdout;

  /**
   * @constructor
   * @param {String} name 
   * @param {String} filepath 
   * @param {String} [password] 
   */
  constructor({ name, filepath, password }) {
    super();
    let errormsg = '';
    const command = 'p';
    const switches = [
      '-n' + name,
      '-idq',
    ];
    if (password) switches.push(`-p${password}`);
    const args = [
      command,
      ...switches,
      filepath
    ];
    const child = spawn(args);
    this.#stdout = child.stdout;

    child.stderr.on('readable', function () {
      let chunk;
      while ((chunk = this.read()) !== null) {
        errormsg += chunk.toString();
      }
    });

    child.stdout.on('end', () => {
      this.push(null);
    });

    child.stdout.on('readable', () => {
      this.read(0);
    });

    /**
     *  A non-zero return code means that the operation was cancelled due to some error:
     *  0    Operation succeeded
     *  1    No fatal error occurred
     *  2    A fatal error occurred
     *  3    Invalid checksum. Data corruption
     *  4    Attempt to modify compressed file locked with 'k' command
     *  5    Write to disk error
     *  6    File opening error
     *  7    Bad command line options
     *  8    Not enough memory to operate
     *  9    file creation error
     *  10   No files found matching the specified mask and options.
     *  11   Password error
     *  255  User interrupt operation
     */
    child.on('exit', code => {
      if (code === 0 && errormsg === '') this.emit('close');
      if (code === 10) errormsg += `\r\nNo such file: ${name}.\r\n`;
      errormsg += `Exit code: ${code}.`;
      const error = new Error(errormsg);
      error.code = code;
      this.emit('error', error);
    });
  }

  _read() {
    const chunk = this.#stdout.read();
    if (chunk === null) return this.push('');
    this.push(chunk);
  }
}

module.exports = UnrarStream