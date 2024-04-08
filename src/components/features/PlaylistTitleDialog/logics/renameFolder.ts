'use client';

import { LocalStorageObjects } from '@/types/localstrageObjects';

export const renameFolder = (
  index: number,
  newName: string,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  newLocalStorageObjects[index].name = newName;
  return newLocalStorageObjects;
};
