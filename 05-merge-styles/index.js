const fs = require('fs');
const path = require('path');
const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(pathToBundle);

async function buildStyles (pathToFolder) {  
  const files = await fs.promises.readdir(pathToFolder, {withFileTypes:true});
  const cssFiles = files.filter(file => file.isFile() && file.name.match(/.css$/));
  cssFiles.forEach( (file) => {
    const pathToFile = path.join(pathToFolder, file.name);
    addCSS(pathToFile);
  });
}


async function addCSS(pathToFile) {
  console.log(pathToFile);
  const readStream = await fs.createReadStream(pathToFile, 'utf-8');
  readStream.pipe(writeStream);
}


 
buildStyles(pathToStylesFolder);