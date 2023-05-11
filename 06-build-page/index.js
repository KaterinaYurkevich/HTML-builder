const fs = require('fs');
const path = require('path');

async function createFolders() {
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  await clear(path.join(__dirname, 'project-dist'));
  const dist = await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  const assets = await fs.promises.mkdir(path.join(dist, 'assets'), { recursive: true });
  await copy(path.join(__dirname, 'assets'), assets);
  await copyFile(path.join(__dirname, 'styles'), path.join(dist, 'style.css'), '.css');
  await createFile();
}
createFolders()

async function copy(folderFrom, folderTo) {
  await fs.readdir(folderFrom, { withFileTypes: true }, async(err, files) => {
    for (let el of files) {
      if (el.isFile()) {
        await fs.promises.copyFile(path.join(folderFrom, el.name), path.join(folderTo, el.name))
      } else {
        await fs.promises.mkdir(path.join(folderTo, el.name));
        await copy(path.join(folderFrom, el.name), path.join(folderTo, el.name))
      }
    }
  })
}

async function clear(folder) {
  let list = await fs.promises.readdir(folder, { withFileTypes: true });
  for (let el of list) {
    if (el.isFile()) {
      await fs.promises.rm(path.join(folder, el.name));
    } else {
      try {
        await fs.promises.rmdir(path.join(folder, el.name));
      } catch (e) {
        await clear(path.join(folder, el.name));
      }
    }
  }
  list = await fs.promises.readdir(folder, { withFileTypes: true });
  if (list.length === 0) {
    await fs.promises.rmdir(folder);
  }
}

async function copyFile(stylePath, resultPath, fileTypes) {
  await fs.promises.writeFile(resultPath, '');
  const ws = await fs.createWriteStream(resultPath);
  await fs.promises.truncate(resultPath);
  let rs
  await fs.readdir(stylePath, { withFileTypes: true }, async(err, filelist) => {
    for (let el of filelist) {
      if (el.isFile() && path.extname(el.name) === fileTypes) rs = await fs.createReadStream(path.join(stylePath, el.name), { encoding: 'UTF-8' });
      rs.on('data', chunk =>
        ws.write(chunk)
      );
    }
  });
}
async function createFile() {
  let html = path.join(__dirname, 'project-dist', 'index.html')
  await fs.promises.copyFile(path.join(__dirname, 'template.html'), html);
  fs.readFile(html, 'utf-8', (err, data) => {
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, files) => {
      files.forEach(file => {
        if (file.isFile() && path.extname(file.name) === '.html') {
          fs.readFile(path.join(__dirname, 'components', file.name), 'utf-8', (err, comp) => {
            data = data.replaceAll(`{{${file.name.split('.')[0]}}}`, comp);
            fs.promises.writeFile(html, data);
          })
        }
      })
    })
  })
}