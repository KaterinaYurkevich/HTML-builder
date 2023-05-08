const fs = require('fs');
const path = require('path');

const { stdin, stdout } = require('node:process');


const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Write your message:');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    processExit();
  }
  output.write(data.toString());
});

process.on("SIGINT", processExit);

function processExit() {
  console.log('Good luck with studying! Bye!');
  process.exit();
}