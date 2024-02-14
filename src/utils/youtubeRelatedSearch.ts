'use server';

import { Movies } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';

const findMostFrequentSubstring = async (
  words: string[]
) => {
  // kuromojiで形態素解析して名詞のみを抽出して連結して返す
  try {
    const text: string = words.join(' ');
    console.log(text);
    const res = await fetch(`/api/kuromoji/${text}`);
    console.log(res);
    const resJson = await res.json();
    const properNounList: string[] = resJson.properNounList;
    // 重複を削除
    const properNounSet = new Set<string>();
    properNounList.forEach((pn) => {
      properNounSet.add(pn);
    });
    // ,で連結
    let concatenatedTitles = '';
    properNounSet.forEach((word) => {
      concatenatedTitles += word + ',';
    });
    return concatenatedTitles;
  } catch (error) {
    console.error;
    console.error('kuromoji error:', error);
    return;
  }
};

export const youtubeRelatedSearch = async (
  movies: Movies,
  localStorageInputValue: string | false,
  nextPageToken?: string
): Promise<{
  result: YouTubeSearchResult[];
  nextPageToken?: string;
}> => {
  try {
    const relateWord: string[] = movies.map((movie) => {
      return movie.title;
    });
    const concatenatedTitles =
      await findMostFrequentSubstring(relateWord);
    if (!concatenatedTitles) {
      return { result: [] };
    }
    const config: AxiosRequestConfig = {
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      params: {
        part: 'snippet',
        q: concatenatedTitles,
        maxResults: 10,
        key:
          localStorageInputValue ||
          process.env.YOUTUBE_DATA_API_KEY,
        type: 'video',
        pageToken: nextPageToken,
      },
    };
    const res = await axios(config);
    console.log(res);
    const newNextPageToken =
      res.data.nextPageToken || undefined;
    const result = res.data.items as YouTubeSearchResult[];
    // moviesに含まれる動画を除外
    const newResult = result.filter((movie) => {
      return !movies.some((m) => m.id === movie.id.videoId);
    });
    return {
      result: newResult,
      nextPageToken: newNextPageToken,
    };
  } catch (error) {
    console.error;
    return { result: [], nextPageToken: undefined };
  }
};
