'use server';

import fs from 'fs';
export const existFile = (filePath: string) => {
  return fs.readdirSync(filePath);
};
