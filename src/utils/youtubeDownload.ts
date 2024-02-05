'use client';

export const youtubeDownload = async (
  youtubeId: string
) => {
  try {
    const res = await fetch(
      `/api/youtube-audio-download/${youtubeId}`
    );
    const resJson = await res.json();
    if (!resJson.body) return;
    const filename = `${youtubeId}.webm`;
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
      type: 'video/webm',
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
  } catch (error) {
    console.log(error);
  }
};
