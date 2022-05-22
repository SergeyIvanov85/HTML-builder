const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'files-copy');


async function copyFolder (pathToFolder, pathToCopy) {
  await fs.promises.rm(pathToCopy, {recursive: true, force: true});
  await fs.promises.mkdir(pathToCopy, {recursive: true});
  const files = await fs.promises.readdir(pathToFolder,);
  files.forEach( (file) => {
    const source = path.join(pathToFolder, file);
    const copy = path.join(pathToCopy, file);
    fs.promises.copyFile(source, copy);
  });
}
copyFolder(pathToFolder, pathToCopy);
