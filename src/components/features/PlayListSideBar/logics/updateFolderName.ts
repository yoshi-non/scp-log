'use client';

import { LocalStorageObjects } from '@/types/localstrageObjects';

export const updateFolderName = (
  index: number,
  newName: string,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = localStorageObjects;
  newLocalStorageObjects[index].name = newName;
  localStorage.setItem(
    'localStorageObjects',
    JSON.stringify(newLocalStorageObjects)
  );
  return newLocalStorageObjects;
};
