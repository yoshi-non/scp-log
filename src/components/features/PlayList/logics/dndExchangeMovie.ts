import { LocalStorageObjects } from '@/types/localstrageObjects';
import { arrayMove } from '@dnd-kit/sortable';

export const dndExchangeMovie = (
  activeIndex: number,
  overIndex: number,
  selectedFolderIndex: number,
  lsPlaylists: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...lsPlaylists];
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
  return updatedLocalStorageObjects;
};
