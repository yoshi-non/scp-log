import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';

export const deleteFolder = (
  index: number,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  newLocalStorageObjects.splice(index, 1);
  saveToLocalStorage('myData', newLocalStorageObjects);
  return newLocalStorageObjects;
};
