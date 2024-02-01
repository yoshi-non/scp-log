'use server';

const fs = require('fs');
const path = require('path');

export const searchFiles = (dirPath: string): any => {
  const allDirents = fs.readdirSync(dirPath, {
    withFileTypes: true,
  });

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      files.push(searchFiles(fp));
    } else if (
      dirent.isFile() &&
      ['.txt'].includes(path.extname(dirent.name))
    ) {
      files.push({
        dir: path.join(dirPath, dirent.name),
        name: dirent.name,
      });
    }
  }
  return files.flat();
};

const dirPath = './dir';
console.log(searchFiles(dirPath));
