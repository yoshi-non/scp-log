'use server';

import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';

export const youtubeSearch = async (
  keyword: string
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
        key: process.env.YOUTUBE_DATA_API_KEY,
      },
    };
    const res = await axios(config);
    const videoIds = res.data.items.filter(
      (item: YouTubeSearchResult) => {
        return item.id.kind === 'youtube#video';
      }
    );
    return videoIds;
  } catch (error) {
    throw error;
  }
};
