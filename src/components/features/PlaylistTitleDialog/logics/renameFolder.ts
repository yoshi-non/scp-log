'use client';

import { localStorageKey } from '@/constants/localStorageKey';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';

export const renameFolder = (
  index: number,
  newName: string,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  newLocalStorageObjects[index].name = newName;
  saveToLocalStorage(
    localStorageKey,
    newLocalStorageObjects
  );
  return newLocalStorageObjects;
};
