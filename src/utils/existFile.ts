'use server';

import fs from 'fs';
import path from 'path';

export const searchFiles = (dirPath: string): any => {
  const allDirents = fs.readdirSync(dirPath, {
    withFileTypes: true,
  });

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      files.push(searchFiles(fp));
    } else if (dirent.isFile()) {
      files.push({
        dir: path.join(dirPath, dirent.name),
        name: dirent.name,
      });
    }
  }
  return files.flat();
};
