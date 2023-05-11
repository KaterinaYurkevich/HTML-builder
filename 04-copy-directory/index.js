const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copy() {
  await fs.promises.mkdir(copyFolder, { recursive: true });
  let files = await fs.promises.readdir(copyFolder);
  for (let file of files) {
    await fs.promises.rm(path.join(copyFolder, file));
  }
  let dir = await fs.promises.readdir(folder);
  dir.forEach(file => fs.promises.copyFile(path.join(folder, file), path.join(copyFolder, file)))
}

copy();