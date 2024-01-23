import { localStorageKey } from '@/constants/localStorageKey';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';
import { arrayMove } from '@dnd-kit/sortable';

export const dndExchangeMovie = (
  activeIndex: number,
  overIndex: number,
  selectedFolderIndex: number,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  const updatedLocalStorageObjects =
    newLocalStorageObjects.map(
      (localStorageObject, folderIndex) => {
        if (folderIndex === selectedFolderIndex) {
          return {
            ...localStorageObject,
            movies: arrayMove(
              localStorageObject.movies,
              activeIndex,
              overIndex
            ),
          };
        } else {
          return localStorageObject;
        }
      }
    );
  saveToLocalStorage(
    localStorageKey,
    updatedLocalStorageObjects
  );
  return updatedLocalStorageObjects;
};
