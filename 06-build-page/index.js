const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const toPath = path.join(__dirname, 'project-dist');
const template = path.join(__dirname, 'template.html');

// copy directory
const copyDir = async (src, dst) => {
  const [entries] = await Promise.all([
    fsPromises.readdir(src, { withFileTypes: true }),
    fsPromises.mkdir(dst, { recursive: true }),
  ]);

  await Promise.all(
    entries.map((entry) => {
      const srcPath = path.join(src, entry.name);
      const dstPath = path.join(dst, entry.name);
      return entry.isDirectory()
        ? copyDir(srcPath, dstPath)
        : fsPromises.copyFile(srcPath, dstPath);
    })
  );
};
// check exist directiry
const isExist = async (dir) => {
  try {
    await fsPromises.access(dir);
  } catch (e) {
    return false;
  }
  return true;
};
// delete directory
const rd = async (dir) => {
  try {
    await fsPromises.rmdir(dir, { recursive: true });
  } catch (e) {
    console.error('Ошибка удаления');
    process.exit(500);
  }
};
// сreate directory
const md = async (dir) => {
  try {
    await fsPromises.mkdir(dir);
  } catch (e) {
    console.error('Ошибка создания директории');
    process.exit(404);
  }
};
// css build
const bundleCss = async (src, dst) => {
  const outFile = path.join(dst, 'style.css');
  const outStream = new fs.createWriteStream(outFile);
  await fs.readdir(src, async (err, files) => {
    if (err) process.exit(1);
    const cssFiles = files.filter(
      (e) => path.extname(e).toLowerCase() === '.css'
    );
    for (const file of cssFiles) {
      const string = await fileToString(path.join(src, file));
      outStream.write(string + '\r\n');
    }
  });
};
// read file to string
const fileToString = (filename) => {
  const read = async (stream) => {
    stream.setEncoding('utf8');
    let data = '';
    for await (const chunk of stream) {
      data += chunk;
    }
    return data;
  };
  return read(fs.createReadStream(filename)).catch(console.error);
};
// html build
const fillTemplate = async (tpl, src, dst) => {
  const outFile = path.join(dst, 'index.html');
  const outStream = new fs.createWriteStream(outFile);
  const ext = '.html';
  await fs.readdir(src, async function (err, files) {
    if (err) process.exit(1);
    const cssFiles = files.filter((e) => path.extname(e).toLowerCase() === ext);
    for (const file of cssFiles) {
      const curElemName = path.basename(file, ext);
      const curElem = await fileToString(path.join(src, file));
      const addIndent = (str, indent) =>
        str.split('\r\n').join('\r\n' + indent);
      tpl = tpl
        .split('\r\n')
        .map((line) => {
          if (new RegExp(`{{${curElemName}}}`).test(line)) {
            const indent = line.slice(0, line.search(/\S/));
            line = line.replace(
              new RegExp(`{{${curElemName}}}`, 'g'),
              addIndent(curElem, indent)
            );
          }
          return line;
        })
        .join('\r\n');
    }
    outStream.write(tpl);
  });
};
// main
(async () => {
  if (await isExist(toPath)) {
    await rd(toPath);
  }
  await md(toPath);
  await copyDir(assetsPath, path.join(toPath, 'assets'));
  await bundleCss(stylesPath, toPath);
  await fillTemplate(await fileToString(template), componentsPath, toPath);
})();
