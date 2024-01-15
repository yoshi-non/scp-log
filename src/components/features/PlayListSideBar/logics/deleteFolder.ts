import { LocalStorageObjects } from '@/types/localstrageObjects';

export const deleteFolder = (
  index: number,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = localStorageObjects;
  delete newLocalStorageObjects[index];
  localStorage.setItem(
    'localStorageObjects',
    JSON.stringify(newLocalStorageObjects)
  );
  return newLocalStorageObjects;
};
