import { localStorageKey } from '@/constants/localStorageKey';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';
import { toast } from 'sonner';

export const preserveToFolder = (
  value: number,
  movieId: string,
  movieTitle: string,
  thumbnailUrl: string,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  toast(`${movieTitle}を保存しました。`);
  const currentFolder = localStorageObjects[value].movies;
  currentFolder.push({
    id: movieId,
    title: movieTitle,
    thumbnail: thumbnailUrl,
    favorite: false,
  });
  saveToLocalStorage(
    localStorageKey,
    newLocalStorageObjects
  );
  return newLocalStorageObjects;
};
