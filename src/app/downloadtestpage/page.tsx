'use client';

import { youtubeDownload } from '@/utils/youtubeDownload';
import React from 'react';

const Downloadtestpage = () => {
  const youtubeDownloadHandler = async () => {
    const youtubeId = '7bu39dMD5MA';
    const res = await youtubeDownload(youtubeId);
    if (!res.data) return;
    const filename = `${youtubeId}.mp4`;
    const base64Data = res.data.replace(/^data:.*,/, '');
    const buffer = Uint8Array.from(atob(base64Data), (c) =>
      c.charCodeAt(0)
    );
    const blob = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    const objectURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = objectURL;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectURL);
  };

  return (
    <div>
      Downloadtestpage
      <button onClick={youtubeDownloadHandler}>
        だうんろーど
      </button>
    </div>
  );
};

export default Downloadtestpage;
