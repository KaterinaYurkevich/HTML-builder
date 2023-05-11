const fs = require('fs');
const path = require('path');

async function createFolders() {
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  await clear(path.join(__dirname, 'project-dist'));
  const styles = await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  const assets = await fs.promises.mkdir(path.join(styles, 'assets'), { recursive: true });
  await copy(path.join(__dirname, 'assets'), assets);
  await copyFile(path.join(__dirname, 'styles'), path.join(styles, 'style.css'), '.css');
  await createFile();
}
createFolders()

async function copy(folder, folderCopy) {
  await fs.readdir(folder, { withFileTypes: true }, async(err, files) => {
    for (let file of files) {
      if (file.isFile()) {
        await fs.promises.copyFile(path.join(folder, file.name), path.join(folderCopy, file.name))
      } else {
        await fs.promises.mkdir(path.join(folderCopy, file.name));
        await copy(path.join(folder, file.name), path.join(folderCopy, file.name))
      }
    }
  })
}

async function copyFile(style, result, fileTypes) {
  await fs.promises.writeFile(result, '');
  const ws = await fs.createWriteStream(result);
  await fs.promises.truncate(result);
  let rs
  await fs.readdir(style, { withFileTypes: true }, async(err, listFile) => {
    for (let file of listFile) {
      if (file.isFile() && path.extname(file.name) === fileTypes) rs = await fs.createReadStream(path.join(style, file.name), { encoding: 'UTF-8' });
      rs.on('data', chunk =>
        ws.write(chunk)
      );
    }
  });
}

async function clear(folder) {
  let listFile = await fs.promises.readdir(folder, { withFileTypes: true });
  for (let file of listFile) {
    if (file.isFile()) {
      await fs.promises.rm(path.join(folder, file.name));
    } else {
      try {
        await fs.promises.rmdir(path.join(folder, file.name));
      } catch (e) {
        await clear(path.join(folder, file.name));
      }
    }
  }
  listFile = await fs.promises.readdir(folder, { withFileTypes: true });
  if (listFile.length === 0) {
    await fs.promises.rmdir(folder);
  }
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