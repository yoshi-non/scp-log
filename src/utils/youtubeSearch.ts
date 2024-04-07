'use server';

import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';

export const youtubeSearch = async (
  isIdSearch: boolean,
  keyword: string,
  youtubeApiKey?: string
): Promise<YouTubeSearchResult[] | undefined> => {
  try {
    const config: AxiosRequestConfig = {
      url: `https://www.googleapis.com/youtube/v3/${
        isIdSearch ? 'videos' : 'search'
      }`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      // https://developers.google.com/youtube/v3/docs/search/list?hl=ja#parameters
      params: {
        part: 'snippet',
        safeSearch: 'strict',
        maxResults: isIdSearch ? 1 : 50,
        key:
          youtubeApiKey || process.env.YOUTUBE_DATA_API_KEY,
        type: 'video',
      },
    };

    if (isIdSearch) {
      let videoId: string;
      if (keyword.includes('https://')) {
        videoId =
          new URL(keyword).searchParams.get('v') || '';
      } else {
        videoId = keyword;
      }
      config.params = {
        ...config.params,
        id: videoId,
      };
    } else {
      config.params = {
        ...config.params,
        q: keyword,
      };
    }
    const res = await axios(config);
    const result = res.data.items as YouTubeSearchResult[];
    return result;
  } catch {
    return;
  }
};
