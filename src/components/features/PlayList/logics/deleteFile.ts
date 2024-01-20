import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';

export const deleteFile = (
  movieIndex: number,
  folderIndex: number,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  newLocalStorageObjects[folderIndex].movies.splice(
    movieIndex,
    1
  );
  saveToLocalStorage('myData', newLocalStorageObjects);
  return newLocalStorageObjects;
};
