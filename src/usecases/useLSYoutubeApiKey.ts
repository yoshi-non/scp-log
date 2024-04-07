import { localStorageInputKey } from '@/constants/localStorageKey';
import { useEffect, useState } from 'react';

/**
 * ローカルストレージにYouTube APIキーを保存するカスタムフック
 */
export const useLSYoutubeApiKey = () => {
  const [youtubeApiKey, setYoutubeApiKey] =
    useState<string>();

  // 初期化
  useEffect(() => {
    const youtubeApiKey = localStorage.getItem(
      localStorageInputKey
    );
    if (youtubeApiKey) {
      setYoutubeApiKey(JSON.parse(youtubeApiKey));
    }
  }, []);

  const updateYoutubeApiKey = (apiKey: string) => {
    setYoutubeApiKey(apiKey);
    localStorage.setItem(
      localStorageInputKey,
      JSON.stringify(apiKey)
    );
  };

  return {
    youtubeApiKey,
    updateYoutubeApiKey,
  };
};
