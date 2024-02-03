'use server';

import path from 'path';
import fsSync from 'fs';
import ytdl from 'ytdl-core';
import FFmpeg from 'fluent-ffmpeg';
// const ffmpegPath = './node_modules/ffmpeg-static/ffmpeg';
// ffmpeg.setFfmpegPath(ffmpegPath);

export const getYoutubeBase64Data = async (
  youtubeId: string
) => {
  console.log('youtubeDownload start');
  if (!youtubeId.match(/^[a-z_A-Z0-9\-]{11}$/g)) {
    console.error(
      `YouTubeID validation error : ${youtubeId}`
    );
    return {
      statusCode: 400,
      body: 'YouTubeID validation error!',
    };
  }

  const folderPath = path.resolve('/', 'tmp/');

  if (!fsSync.existsSync(folderPath)) {
    fsSync.mkdirSync(folderPath);
  }

  const destFilePath = path.resolve('/tmp', `${youtubeId}`);
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
      FFmpeg()
        .input(videoFilePath)
        .input(audioFilePath)
        .on('end', () => {
          console.log(`Transcoding complete`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`Error transcoding`);
          reject(err);
        })
        .save(mergePath);
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

    fsSync.unlinkSync(videoFilePath);
    fsSync.unlinkSync(audioFilePath);
    fsSync.unlinkSync(mergePath);

    return {
      statusCode: 200,
      body: 'download success.',
      data: base64Data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: 'download failed.',
    };
  }
};
