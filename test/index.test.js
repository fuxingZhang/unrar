const unrar = require('../index');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('unrar without stream', function () {
  it('no passowrd should ok', async () => {
    const src = path.join(__dirname, './test.rar');
    const dest = __dirname;
    const command = 'e';
    const switches = ['-o+', '-idcd'];
    const uncompressFile = path.join(__dirname, './test.txt');

    try {
      unrar.on('progress', percent => {
        assert(percent.includes('%'));
      });

      const result = await unrar.uncompress({
        src,
        dest,
        command,
        switches
      });
      assert(result === 'over');

      const buf = fs.readFileSync(uncompressFile);
      const txt = buf.toString();
      assert(txt === 'test');
      fs.unlinkSync(uncompressFile);
    } catch (error) {
      assert(false);
    }
  });

  it('with passowrd should ok', async () => {
    const src = path.join(__dirname, './password.rar');
    const dest = __dirname;
    const command = 'e';
    const password = '123456';
    const switches = [`-p${password}`, '-o+', '-idcd'];
    const uncompressFile = path.join(__dirname, './password.txt');

    try {
      unrar.on('progress', percent => {
        assert(percent.includes('%'));
      });

      const result = await unrar.uncompress({
        src,
        dest,
        command,
        switches
      });
      assert(result === 'over');

      const buf = fs.readFileSync(uncompressFile);
      const txt = buf.toString();
      assert(txt === 'password');
      fs.unlinkSync(uncompressFile);
    } catch (error) {
      assert(false);
    }
  });
});