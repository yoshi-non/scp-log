'use client';

import { getYoutubeBase64Data } from './getYoutubeBase64Data';

export const youtubeDownload = async (
  youtubeId: string
) => {
  try {
    const res = await getYoutubeBase64Data(youtubeId);
    if (!res.data) return;

    const filename = `${youtubeId}.mp4`;
    const base64Data = res.data.replace(/^data:.*,/, '');

    // Base64データを直接デコード
    const binaryData = atob(base64Data);

    // ArrayBufferに変換
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Blobを作成
    const blob = new Blob([arrayBuffer], {
      type: 'application/octet-stream',
    });

    // ダウンロード用のリンクを作成し、クリックしてダウンロード
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
};
