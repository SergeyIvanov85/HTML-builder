const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'secret-folder');


async function readFolder() {
  const inner = await fs.promises.readdir(pathToFolder, { withFileTypes: true });
  getStat(inner);
}
function getStat(inner) {
  const files = inner.filter(el => el.isFile());
  files.forEach(file => {
    const pathToFile = path.join(pathToFolder, file.name);
    const fileObj = path.parse(pathToFile);
    const name = fileObj.name;
    const ext = path.extname(pathToFile).slice(1);
    showStat(name, ext, pathToFile);
  });
}

async function showStat(name, ext, pathToFile) {
  const statObj = await fs.promises.stat(pathToFile);
  const size = statObj.size;
  console.log(`${name} - ${ext} - ${size}b`);
}

readFolder();