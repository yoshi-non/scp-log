'use server';

import ytdl from 'ytdl-core';

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
      text: 'YouTubeID validation error!',
    };
  }

  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  let data = Buffer.from([]);
  const videoDownload = () => {
    return new Promise<void>((resolve, reject) => {
      const video = ytdl(url, {
        quality: 'highestaudio',
        filter: (format) =>
          format.hasAudio === true &&
          format.hasVideo === true,
      });
      video.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      });
      var starttime: number;
      video.once('response', () => {
        starttime = Date.now();
      });
      video.on(
        'progress',
        (chunkLength, downloaded, total) => {
          const percent = downloaded / total;
          const downloadedMinutes =
            (Date.now() - starttime) / 1000 / 60;
          const estimatedDownloadTime =
            downloadedMinutes / percent - downloadedMinutes;
          process.stdout.write(
            `${(percent * 100).toFixed(2)}% downloaded `
          );
          process.stdout.write(
            `(${(downloaded / 1024 / 1024).toFixed(
              2
            )}MB of ${(total / 1024 / 1024).toFixed(
              2
            )}MB)\n`
          );
          process.stdout.write(
            `running for: ${downloadedMinutes.toFixed(
              2
            )}minutes`
          );
          process.stdout.write(
            `, estimated time left: ${estimatedDownloadTime.toFixed(
              2
            )}minutes `
          );
        }
      );
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

  try {
    const videoPromise = videoDownload();
    await Promise.all([videoPromise]);
    const base64Data = Buffer.from(data).toString('base64');
    return {
      statusCode: 200,
      text: 'download success.',
      body: base64Data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      text: 'download failed.',
    };
  }
};
