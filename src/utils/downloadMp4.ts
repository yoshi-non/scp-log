'use client';

import { isDevelopment } from './isDevelopment';

export const downloadMp4 = async (
  videoId: string
): Promise<void> => {
  const frontUrl = isDevelopment()
    ? process.env.NEXT_PUBLIC_FRONT_URL
    : 'https://scp-log.vercel.app';
  const url = `${frontUrl}/api/youtube-download?youtubeId=${videoId}`;
  const res = await fetch(url);
  console.log(res);

  if (res.status !== 200) {
    return res
      .text()
      .then((message) =>
        Promise.reject(
          new Error(`[status:${res.status}]: ${message}`)
        )
      );
  }
  const resJson = await res.json();
  const filename = `${videoId}.mp4`;
  if (!resJson.body) return;
  const base64Data: string = resJson.body;
  // Base64データを直接デコード
  const decodeData = atob(base64Data);
  // ArrayBufferに変換
  const arrayBuffer = new ArrayBuffer(decodeData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < decodeData.length; i++) {
    uint8Array[i] = decodeData.charCodeAt(i);
  }

  // Blobを作成
  const blob = new Blob([arrayBuffer], {
    type: 'video/mp4',
  });

  // Blob URLを作成し、リンクに設定
  const blobUrl = URL.createObjectURL(blob);

  // ファイルのダウンロード
  fetch(blobUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    });
};
