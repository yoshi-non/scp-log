'use server';

import { Movies } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';
import { isDevelopment } from './isDevelopment';

const findMostFrequentSubstring = async (
  words: string[]
) => {
  // kuromojiで形態素解析して名詞のみを抽出して連結して返す
  try {
    const text: string = words.join(' ');
    let concatenatedTitles: string = '';
    const baseApiUrl = `${process.env.FRONTEND_URL}/api/`;
    const url = isDevelopment()
      ? `${baseApiUrl}kuromoji/${text}`
      : `${baseApiUrl}?input=${encodeURIComponent(text)}`;
    let control: AbortController | undefined;
    if (control) {
      control.abort();
    }
    control = new AbortController();
    const signal = control.signal;
    const result = fetch(url, { signal })
      .then((res) => {
        if (res.status !== 200) {
          return res
            .text()
            .then((message) =>
              Promise.reject(
                new Error(
                  `[status:${res.status}]: ${message}`
                )
              )
            );
        }
        return res.json();
      })
      .then((json) => {
        const properNounList = isDevelopment()
          ? (json.properNounList as string[])
          : (json as string[]);
        // 重複を削除
        const properNounSet = new Set<string>();
        properNounList.forEach((pn) => {
          properNounSet.add(pn);
        });
        // ,で連結
        properNounSet.forEach((word) => {
          concatenatedTitles += word + ',';
        });
        const result: string = concatenatedTitles;
        return result;
      })
      .then((result) => {
        return result;
      });
    return result;
  } catch (error) {
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
