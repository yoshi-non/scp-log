'use server';

import fetch from 'node-fetch';
import path from 'path';
import { promises as fsPromises } from 'fs';

export const youtubeDownload = async (
  youtubeId: string
) => {
  console.log('youtubeDownload start');
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/youtube/${youtubeId}`
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}`
      );
    }
    const video = await response.buffer();
    const filePath = path.resolve(
      './download',
      `${youtubeId}.mp4`
    );
    try {
      await fsPromises.writeFile(filePath, video);
      console.log('ファイルの保存に成功しました。');
    } catch (error) {
      console.error(
        'ファイルの保存中にエラーが発生しました:',
        error
      );
    }
  } catch (error) {
    console.error('Error downloading video:', error);
  }
};
