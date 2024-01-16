'use server';

import axios, { AxiosRequestConfig } from 'axios';

export const youtubeSearch: any = async (
  keyword: string
) => {
  try {
    // console.log(keyword);

    const config: AxiosRequestConfig = {
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      params: {
        part: 'snippet',
        q: keyword,
        maxResults: 50,
        key: process.env.YOUTUBE_DATA_API_KEY, // 取得したAPIキーを設定
      },
    };
    const res = await axios(config);

    // console.log(res.data.items);

    return res.data.items;
  } catch (error) {
    throw error;
  }
};
