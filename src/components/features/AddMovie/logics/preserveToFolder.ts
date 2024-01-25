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
  if (localStorageObjects.length === 0) {
    const newFolder = {
      name: 'New Folder',
      movies: [],
    };
    localStorageObjects = [
      ...localStorageObjects,
      newFolder,
    ];
  }
  toast(`${movieTitle}を保存しました。`);
  const currentFolder = localStorageObjects[value].movies;
  currentFolder.push({
    id: movieId,
    title: movieTitle,
    thumbnail: thumbnailUrl,
    favorite: false,
  });
  saveToLocalStorage(localStorageKey, localStorageObjects);
  return localStorageObjects;
};
