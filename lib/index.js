'use strict';
const getList = require('./getList');
const UnrarStream = require('./stream.js');

class Unrar {
  /**
   * @constructor
   * @param {String} filepath 
   * @param {String} [password] 
   */
  constructor(filepath, password) {
    this.filepath = filepath;
    this.password = password;
    const switches = ['-idc', '-v'];
    if (password !== undefined) switches.push(`-p${password}`);
    this.args = ['vt', ...switches, this.filepath]
  }

  /**
   * @public
   */
  async list() {
    const stdout = await getList(this.args);
    const list = this.parse(stdout);
    return list
  }

  /**
   * @param {String} name
   * @returns {ReadableStream}
   * @private
   */
  stream(name) {
    return new UnrarStream({
      name,
      filepath: this.filepath,
      password: this.password
    });
  }

  /**
   * @param {String} stdout
   * @private
   */
  parse(stdout) {
    const list = stdout
      .split(/\r?\n\r?\n/)
      .filter(item => item)
      .map(item => {
        const obj = {};

        item
          .split(/\r?\n/)
          .filter(item => item)
          .forEach(item => {
            item = item.split(': ');
            const key = this.normalizeKey(item[0]);
            const val = item[1].trim();
            obj[key] = val;
          });

        return obj;
      })
      .filter(item => item.name);

    return list
  }

  /**
   * Normalizes keys of entry description
   * @param {String} key Raw key
   * @returns {String} Normalized key
   * @private
   */
  normalizeKey(key) {
    const normKey = key.toLowerCase().replace(/^\s+/, '');

    const keys = new Map([
      ['name', 'name'],
      ['type', 'type'],
      ['size', 'size'],
      ['packed size', 'packedSize'],
      ['ratio', 'ratio'],
      ['mtime', 'mtime'],
      ['attributes', 'attributes'],
      ['crc32', 'crc32'],
      ['crc32 mac', 'crc32Mac'],
      ['host os', 'hostOS'],
      ['compression', 'compression'],
      ['flags', 'flags']
    ])

    return keys.has(normKey) ? keys.get(normKey) : normKey;
  }
}

module.exports = Unrar