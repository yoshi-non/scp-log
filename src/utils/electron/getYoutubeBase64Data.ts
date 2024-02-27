import path from 'path';
import fsSync from 'fs';
import ytdl from 'ytdl-core';
const { contextBridge } = require('electron');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
contextBridge.exposeInMainWorld('ffmpeg', {
  doSomething: () => ffmpeg(ffmpegStatic.path)
})

export const getYoutubeBase64Data = async (
  youtubeId: string
) => {
  console.log('youtubeDownload start');
  if (!youtubeId.match(/^[a-z_A-Z0-9\-]{11}$/g)) {
    console.error(
      `YouTubeID validation error : ${youtubeId}`
    );
    return;
  }

  const folderPath = path.resolve('/', 'tmp');
  if (!fsSync.existsSync(folderPath)) {
    fsSync.mkdirSync(folderPath);
  }

  const destFilePath = path.resolve(
    folderPath,
    `${youtubeId}`
  );
  const audioFilePath = destFilePath + `_audio.wav`;
  const videoFilePath = destFilePath + `_video.mp4`;
  const mergePath = destFilePath + `.mp4`;
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;

  const audioDownload = () => {
    return new Promise<void>((resolve, reject) => {
      const audio = ytdl(url, {
        filter: 'audioandvideo',
        quality: 'highestaudio',
      });

      audio.pipe(fsSync.createWriteStream(audioFilePath));
      audio.on('error', (err) => {
        console.error(err);
        reject('audio download error!');
      });

      audio.on('end', () => {
        console.log(
          `youtube file (${youtubeId}_audio.wav) downloaded.`
        );
        resolve();
      });
    });
  };

  const videoDownload = () => {
    return new Promise<void>((resolve, reject) => {
      const video = ytdl(url, {
        quality: 'highestvideo',
      });

      video.pipe(fsSync.createWriteStream(videoFilePath));
      video.on('error', (err) => {
        console.error(err);
        reject('video download error!');
      });

      video.on('end', () => {
        console.log(
          `youtube file (${youtubeId}_video.mp4) downloaded.`
        );
        resolve();
      });
    });
  };

  const mergeFiles = () => {
    return new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(videoFilePath)
        .input(audioFilePath)
        .save(mergePath)
        .on('end', function () {
          console.log('download finished.');
          fsSync.unlinkSync(videoFilePath);
          fsSync.unlinkSync(audioFilePath);
          resolve();
        });
    });
  };

  try {
    const audioPromise = audioDownload();
    const videoPromise = videoDownload();
    await Promise.all([audioPromise, videoPromise]);
    await mergeFiles();
    const mp4Content = fsSync.readFileSync(mergePath);
    const base64Data =
      Buffer.from(mp4Content).toString('base64');

    fsSync.unlinkSync(mergePath);
    return base64Data;
  } catch (error) {
    console.error(error);
    return;
  }
};
