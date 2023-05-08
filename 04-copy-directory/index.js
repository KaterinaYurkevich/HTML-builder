const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, '/files');
const copyFolder = path.join(__dirname, '/files-copy/');

fs.mkdir(copyFolder, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(copyFolder, (_, files) => {
  files.forEach((file) => {
    fs.unlink(`${copyFolder}/${file}`, err => {
      if (err) throw err;
    });
  });
});

fs.readdir(folder, (_, files) => {
  files.forEach((file) => {
    const callback = (err) => {
      if (err) throw err;
    };

    fs.copyFile(path.join(folder, file), path.join(copyFolder, file), callback);
  });
});