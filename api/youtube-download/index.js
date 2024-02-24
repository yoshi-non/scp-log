'use strict';

const path = require('path');
const fsSync = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const ffmpegPath = path.resolve(
  require.resolve('ffmpeg-static'),
  '../../ffmpeg-static/ffmpeg'
);
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Only GET allowed');
  }
  if (!req.query.youtubeId) {
    return res
      .status(400)
      .send('youtubeId query parameter required');
  }
  const youtubeId = req.query.youtubeId;
  if (!youtubeId.match(/^[a-z_A-Z0-9\-]{11}$/g)) {
    console.error(
      `YouTubeID validation error : ${youtubeId}`
    );
    return res
      .status(400)
      .send('YouTubeID validation error!');
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
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
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
    return res.status(200).json({ body: base64Data });
  } catch (error) {
    console.error(error);
    if (fsSync.existsSync(audioFilePath)) {
      fsSync.unlinkSync(audioFilePath);
    }
    if (fsSync.existsSync(videoFilePath)) {
      fsSync.unlinkSync(videoFilePath);
    }
    if (fsSync.existsSync(mergePath)) {
      fsSync.unlinkSync(mergePath);
    }

    return res.status(400).send('download failed.');
  }
};
