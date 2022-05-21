const fs = require('fs');
const path = require('path');
const input = process.stdin;
const output = process.stdout;
const helloMessage = 'Файл создан и готов принимать текст!\n';
const byeMessage = 'Файл сохранен.';

const pathToFile = path.join(__dirname, 'text.txt');

fs.writeFile(pathToFile, '', (err) => {
  if (err) throw err;
});

const writeStream = fs.createWriteStream(pathToFile);

output.write(helloMessage);

input.on('data', (data) => {

  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writeStream.write(data.toString());
  }
});

process.on('SIGINT', process.exit);

process.on('exit', () => output.write(byeMessage));