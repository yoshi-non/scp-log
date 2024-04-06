'use server';

import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';

export const youtubeSearch = async (
  keyword: string,
  youtubeApiKey?: string
): Promise<YouTubeSearchResult[]> => {
  try {
    const config: AxiosRequestConfig = {
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      // https://developers.google.com/youtube/v3/docs/search/list?hl=ja#parameters
      params: {
        part: 'snippet',
        q: keyword,
        safeSearch: 'strict',
        maxResults: 50,
        key:
          youtubeApiKey || process.env.YOUTUBE_DATA_API_KEY,
        type: 'video',
      },
    };
    const res = await axios(config);
    const result = res.data.items as YouTubeSearchResult[];
    return result;
  } catch {
    return [];
  }
};
