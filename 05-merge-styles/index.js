const fs = require('fs');
const path = require('path');

const folderStyle = path.join(__dirname, '/styles');

const fileStyles = fs.createWriteStream(path.join(__dirname, '/project-dist/bundle.css'));

fs.promises.readdir(folderStyle, { withFileTypes: true })
  .then(files => {
    for (let prop of files) {
      if (!prop.isDirectory()) {
        if (path.extname(prop.name) === '.css') {
          const stream = new fs.ReadStream(path.join(folderStyle, `/${prop.name}`));

          stream.on('data', (chunk) => fileStyles.write(chunk));
        }
      }
    }
  })