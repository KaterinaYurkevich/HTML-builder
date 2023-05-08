const fs = require('fs');
const path = require('path');

const read = fs.createReadStream(path.join(__dirname, 'text.txt'));
read.on('data', (data) => {
  console.log(data.toString());
});