'use strict';

const child_process = require('child_process');
const spawn = child_process.spawn;
const EventEmitter = require('events');
const path = require('path');
const bin = path.join(__dirname, './bin/UnRAR.exe');
const reg = /([\d]+)%/;

class Unrar extends EventEmitter {
  /**
   * uncompress .rar file
   * @param {String} src source file path
   * @param {String} dest destination folder path
   * @param {String} [command='x'] command of unrar, default: x
   * @param {String[]} [switches] switches of unrar, default: []
   */
  uncompress({ src, dest, command = 'x', switches = [] }) {
    const list = [];

    return new Promise((resolve, reject) => {
      const unrar = spawn(bin, [
        command,
        ...switches,
        src,
        dest
      ]);

      unrar.stderr.on('data', chunk => {
        list.push(chunk);
      });

      unrar.stdout.on('data', chunk => {
        const data = chunk.toString();
        const match = data.match(reg);
        if(match !== null) this.emit('progress', match[0]);
      });

      unrar.on('exit', code => {
        const errorMsg = Buffer.concat(list).toString();

        if (code !== 0 || errorMsg) {
          const error = new Error(errorMsg);
          error.code = code;
          return reject(error);
        }
        this.emit('progress', '100%');
        resolve('over');
      });
    })
  }
}

const unrar = new Unrar();

module.exports = unrar