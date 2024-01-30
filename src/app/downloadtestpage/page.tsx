'use client';

import { youtubeDownload } from '@/utils/youtubeDownload';
import React from 'react';

const Downloadtestpage = () => {
  const youtubeDownloadHandler = async () => {
    const url = '7bu39dMD5MA';
    const res = await youtubeDownload(url);
    if (!res) return;
    console.log(res.status);
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
