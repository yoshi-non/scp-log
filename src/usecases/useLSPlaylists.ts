import { localStoragePlaylistKey } from '@/constants/localStorageKey';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { useEffect, useState } from 'react';

/**
 * ローカルストレージにプレイリストを保存するカスタムフック
 */
export const useLSPlaylists = () => {
  const [loading, setLoading] = useState<
    'true' | 'false' | 'pending'
  >('pending');
  const [lsPlaylists, setLSPlaylist] =
    useState<LocalStorageObjects>([]);

  useEffect(() => {
    const getLSPlaylist = () => {
      setLoading('true');
      const playlist = localStorage.getItem(
        localStoragePlaylistKey
      );
      if (playlist) {
        setLSPlaylist(JSON.parse(playlist));
      }
      setLoading('false');
    };
    getLSPlaylist();
  }, []);

  const updateLSPlaylists = (
    newPlaylist: LocalStorageObjects
  ) => {
    setLSPlaylist(newPlaylist);
    localStorage.setItem(
      localStoragePlaylistKey,
      JSON.stringify(newPlaylist)
    );
  };
  return {
    loading,
    lsPlaylists,
    updateLSPlaylists,
  };
};
