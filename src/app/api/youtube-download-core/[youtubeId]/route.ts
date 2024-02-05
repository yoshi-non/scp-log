import ytdl from 'ytdl-core';

export async function GET(
  request: Request,
  { params }: { params: { youtubeId: string } }
) {
  const youtubeId = params.youtubeId;
  if (!youtubeId.match(/^[a-z_A-Z0-9\-]{11}$/g)) {
    console.error(
      `YouTubeID validation error : ${youtubeId}`
    );
    return new Response('YouTubeID validation error!', {
      status: 400,
    });
  }
  try {
    const info = ytdl.getInfo(youtubeId);

    // info.formatsの一部をログに出力
    console.log(
      'Available formats:',
      (await info).formats.filter(
        (format) =>
          format.hasAudio === true &&
          format.hasVideo === false
      )
    );
    const bestFormat = ytdl.chooseFormat(
      (await info).formats,
      {
        filter: (format) =>
          format.hasAudio === true &&
          format.hasVideo === false,
      }
    );
    return new Response(
      JSON.stringify({ url: bestFormat.url }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response('download failed.', {
      status: 400,
    });
  }
}
