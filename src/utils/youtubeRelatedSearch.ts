'use server';

import { Movies } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import axios, { AxiosRequestConfig } from 'axios';
import kuromoji from 'kuromoji';
import { isDevelopment } from './isDevelopment';

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null =
  null;

const initializeTokenizer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    kuromoji
      .builder({
        dicPath: isDevelopment()
          ? './node_modules/kuromoji/dict'
          : '/dict',
      })
      .build((err, _tokenizer) => {
        if (err) {
          console.error(err);
          reject();
        } else {
          tokenizer = _tokenizer!;
          resolve();
        }
      });
  });
};

const tokenized = (
  text: string
): kuromoji.IpadicFeatures[] => {
  if (!tokenizer) {
    throw new Error('Tokenizer is not initialized');
  }
  return tokenizer.tokenize(text);
};

const extractProperNounList = async (
  text: string
): Promise<string[]> => {
  if (!tokenizer) {
    await initializeTokenizer().catch((err) => {
      throw new Error(
        `Failed to initialize tokenizer: ${err}`
      );
    });
  }

  const pnList: string[] = [];
  let consecutiveWord: string | null = null;

  tokenized(text).forEach((result) => {
    if (result.pos !== '名詞') {
      if (consecutiveWord !== null) {
        pnList.push(consecutiveWord);
      }
      consecutiveWord = null;
      return;
    }

    if (consecutiveWord === null) {
      consecutiveWord = result.surface_form;
    } else {
      consecutiveWord += result.surface_form;
    }
  });

  if (consecutiveWord !== null) {
    pnList.push(consecutiveWord);
  }

  return pnList;
};

const findMostFrequentSubstring = async (
  words: string[]
) => {
  // kuromojiで形態素解析して名詞のみを抽出して連結して返す
  const text = words.join(' ');
  const properNounList: string[] =
    await extractProperNounList(text);
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
