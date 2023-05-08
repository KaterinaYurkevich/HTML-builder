const fs = require('fs');
const path = require('path');

const { stdin, stdout } = require('node:process');

const folder = path.join(__dirname, 'secret-folder');
fs.promises.readdir(folder)
  .then(files => {
    for (let file of files) {
      fs.stat(path.join(folder, file), (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          console.log(`${file} - ${(path.extname(file)).slice(1)} - ${Number(stats.size / 1024).toFixed(3)}kb`)
        }
      })
    }
  })