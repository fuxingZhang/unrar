const unrar = require('../index');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('#indexOf()', function () {
  const src = path.join(__dirname, './test.rar');
  const dest = __dirname;
  const command = 'e';
  const switches = ['-o+', '-idcd'];
  const uncompressFile = path.join(__dirname, './test.txt');

  it('should ok', async () => {
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
});