import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';

export const preserveToFolder = (
  value: number,
  movieId: string,
  movieTitle: string,
  thumbnailUrl: string,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  const currentFolder = localStorageObjects[value].movies;
  currentFolder.push({
    id: movieId,
    title: movieTitle,
    thumbnail: thumbnailUrl,
    favorite: false,
  });
  saveToLocalStorage('myData', newLocalStorageObjects);
  return newLocalStorageObjects;
};
