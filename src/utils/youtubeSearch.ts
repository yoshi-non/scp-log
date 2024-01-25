'use server';

import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';

export const youtubeSearch = async (
  keyword: string,
  localStorageInputValue: string | false
): Promise<YouTubeSearchResult[]> => {
  try {
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
        key:
          localStorageInputValue ||
          process.env.YOUTUBE_DATA_API_KEY,
      },
    };
    const res = await axios(config);
    const result = res.data.items as YouTubeSearchResult[];
    const videos = result.filter((item) => {
      return item.id.kind === 'youtube#video';
    });
    return videos;
  } catch (err) {
    console.log(err);
    return [];
  }
};
