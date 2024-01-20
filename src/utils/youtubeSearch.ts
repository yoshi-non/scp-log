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
        'Access-Control-Allow-Origin': '*', // 任意のオリジンからのリクエストを許可
        'Access-Control-Allow-Methods': 'GET,OPTIONS', // GETおよびOPTIONSリクエストを許可
        'Access-Control-Allow-Headers': 'Content-Type', // Content-Typeヘッダーを許可
      },
      params: {
        part: 'snippet',
        q: keyword,
        maxResults: 50,
        key: process.env.YOUTUBE_DATA_API_KEY,
      },
    };
    const res = await axios(config);
    const result = res.data.items as YouTubeSearchResult[];
    const videos = result.filter((item) => {
      return item.id.kind === 'youtube#video';
    });
    return videos;
  } catch (error) {
    throw error;
  }
};
