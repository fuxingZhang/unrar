const Unrar = require('../lib/index');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);

describe('unrar with stream', function () {
  it('no passowrd should ok', async () => {
    try {
      const filePath = path.join(__dirname, './test.rar');
      const archive = new Unrar(filePath);
      const list = await archive.list();
      for (const item of list) {
        const name = item.name;
        if (item.type === 'File') {
          const _path = path.join(__dirname, `./${path.basename(name)}`);
          const writeStream = fs.createWriteStream(_path);
          await pipeline(archive.stream(name), writeStream).catch(err => {
            console.log('stream error:', err);
            writeStream.destroy();
          });
          const buf = fs.readFileSync(_path);
          const txt = buf.toString();
          assert(txt === 'test');
          fs.unlinkSync(_path);
        }
      }
    } catch (error) {
      console.log(error)
      assert(false);
    }
  });

  it('with passowrd and without archived paths should ok', async () => {
    try {
      const filePath = path.join(__dirname, './password.rar');
      const password = '123456';
      const archive = new Unrar(filePath, password);
      const list = await archive.list();
      for (const item of list) {
        const name = item.name;
        if (item.type === 'File') {
          const _path = path.join(__dirname, `./${path.basename(name)}`);
          const writeStream = fs.createWriteStream(_path);
          await pipeline(archive.stream(name), writeStream).catch(err => {
            console.log('stream error:', err);
            writeStream.destroy();
          });
          const buf = fs.readFileSync(_path);
          const txt = buf.toString();
          assert(txt === 'password');
          fs.unlinkSync(_path);
        }
      }
    } catch (error) {
      assert(false);
    }
  });

  it('with passowrd and with full path should ok', async () => {
    try {
      const filePath = path.join(__dirname, './password.rar');
      const password = '123456';
      const archive = new Unrar(filePath, password);
      const list = await archive.list();
      const folders = list.filter(item => item.type === 'Directory');
      const files = list.filter(item => item.type === 'File');

      for (const item of folders) {
        const name = item.name;
        const _path = path.join(__dirname, `./${name}`);
        await fs.promises.mkdir(_path, { recursive: true });
      }

      for (const item of files) {
        const name = item.name;
        const _path = path.join(__dirname, `./${name}`);
        const writeStream = fs.createWriteStream(_path);
        await pipeline(archive.stream(name), writeStream).catch(err => {
          console.log('stream error:', err);
          writeStream.destroy();
        });
        const buf = fs.readFileSync(_path);
        const txt = buf.toString();
        assert(txt === 'password');
        fs.unlinkSync(_path);
      }
    } catch (error) {
      assert(false);
    }
  });
});
