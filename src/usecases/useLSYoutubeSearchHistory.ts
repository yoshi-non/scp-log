import { localStorageSearchHistoryKey } from '@/constants/localStorageKey';
import { useEffect, useState } from 'react';

/**
 * ローカルストレージにYouTube検索履歴を保存するカスタムフック
 */
export const useLSYoutubeSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<
    string[]
  >([]);

  // 初期化
  useEffect(() => {
    const searchHistory = localStorage.getItem(
      localStorageSearchHistoryKey
    );
    if (searchHistory) {
      setSearchHistory(JSON.parse(searchHistory));
    }
  }, []);

  const addSearchHistory = (keyword: string) => {
    if (searchHistory.includes(keyword)) return;
    setSearchHistory([keyword, ...searchHistory]);
    localStorage.setItem(
      localStorageSearchHistoryKey,
      JSON.stringify([keyword, ...searchHistory])
    );
  };

  const removeSearchHistory = (keyword: string) => {
    setSearchHistory(
      searchHistory.filter((history) => history !== keyword)
    );
    localStorage.setItem(
      localStorageSearchHistoryKey,
      JSON.stringify(
        searchHistory.filter(
          (history) => history !== keyword
        )
      )
    );
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(localStorageSearchHistoryKey);
  };

  return {
    searchHistory,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
  };
};
