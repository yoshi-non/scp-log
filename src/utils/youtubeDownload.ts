'use server';

import path from 'path';
import fsSync from 'fs';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(
  path.resolve('./', 'node_modules/ffmpeg-static/ffmpeg')
);

export const youtubeDownload = async (
  youtubeId: string
) => {
  if (
    !fsSync.existsSync(
      path.resolve('./', 'downloads/youtube')
    )
  ) {
    fsSync.mkdirSync(
      path.resolve('./', 'downloads/youtube')
    );
  }
  console.log('youtubeDownload start');
  if (!youtubeId.match(/^[a-z_A-Z0-9\-]{11}$/g)) {
    console.error(
      `YouTubeID validation error : ${youtubeId}`
    );
    return new Response('YouTubeID validation error!', {
      status: 400,
    });
  }

  const destFilePath = path.resolve(
    './downloads/youtube',
    `${youtubeId}`
  );
  const audioFilePath = destFilePath + `_audio.wav`;
  const videoFilePath = destFilePath + `_video.mp4`;
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;

  const audio = ytdl(url, {
    filter: 'audioandvideo',
    quality: 'highestaudio',
  });
  audio.pipe(fsSync.createWriteStream(audioFilePath));
  audio.on('error', (err) => {
    console.error(err);
    return new Response('download error!', { status: 400 });
  });

  audio.on('end', () => {
    console.log(
      `youtube file (${youtubeId}_audio.wav) downloaded.`
    );
    videoDownload();
  });

  async function videoDownload() {
    const video = ytdl(url, {
      quality: 'highestvideo',
    });

    video.pipe(fsSync.createWriteStream(videoFilePath));
    video.on('error', (err) => {
      console.error(err);
      return new Response('download error!', {
        status: 400,
      });
    });

    video.on('end', () => {
      console.log(
        `youtube file (${youtubeId}_video.mp4) downloaded.`
      );
      // mp4とwavをマージする
      console.log('merge mp4 and wav start.');
      const mergePath = destFilePath + `.mp4`;
      ffmpeg()
        .input(videoFilePath)
        .input(audioFilePath)
        .save(mergePath)
        .on('end', function () {
          console.log('download finished.');
          fsSync.unlinkSync(videoFilePath);
          fsSync.unlinkSync(audioFilePath);
          return new Response('download finished.', {
            status: 200,
          });
        });
    });
  }
};
