import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';

export const preserveToFolder = (
  value: number,
  movieId: string,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  const targetFolder = newLocalStorageObjects[value];
  if (targetFolder) {
    targetFolder.movies.push({
      id: movieId,
      favorite: false,
    });
  }
  saveToLocalStorage('myData', newLocalStorageObjects);
  return newLocalStorageObjects;
};
