'use server';

import { Movies } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';
import { isDevelopment } from './isDevelopment';
import { findMostFrequentWords } from './findMostFrequentWords';
import { extractProperNounList } from './electron/extractProperNounList';

const findMostFrequentSubstring = async (
  words: string[]
) => {
  // kuromojiで形態素解析して名詞のみを抽出して連結して返す
  try {
    const text: string = words.join(' ');
    let concatenatedTitles: string = '';
    if (process.env.NEXT_PUBLIC_IS_ELECTRON === 'true') {
      const properNounList = await extractProperNounList(
        text
      );
      const mostFrequentWords =
        findMostFrequentWords(properNounList);
      // ,で連結
      concatenatedTitles = mostFrequentWords.join(',');
      return concatenatedTitles;
    }
    const url = isDevelopment()
      ? `${
          process.env.FRONTEND_URL
        }/apis/kuromoji/${encodeURIComponent(text)}`
      : `${
          process.env.FRONTEND_URL
        }/api/kuromoji?input=${encodeURIComponent(text)}`;
    let control: AbortController | undefined;
    if (control) {
      control.abort();
    }
    control = new AbortController();
    const signal = control.signal;
    const res: Response = await fetch(url, { signal });

    if (res.status !== 200) {
      return res
        .text()
        .then((message) =>
          Promise.reject(
            new Error(`[status:${res.status}]: ${message}`)
          )
        );
    }
    const json = await res.json();

    const properNounList = isDevelopment()
      ? (json.properNounList as string[])
      : (json as string[]);
    const mostFrequentWords =
      findMostFrequentWords(properNounList);
    // ,で連結
    concatenatedTitles = mostFrequentWords.join(',');
    return concatenatedTitles;

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
