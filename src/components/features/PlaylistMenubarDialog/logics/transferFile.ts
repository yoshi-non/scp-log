import { LocalStorageObjects } from '@/types/localstrageObjects';
import { toast } from 'sonner';

export const transferFile = (
  movieIndex: number,
  selectedFolderIndex: number,
  newFolderIndex: number,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  toast('ファイルを転送しました。');
  const crrMovie =
    newLocalStorageObjects[selectedFolderIndex].movies[
      movieIndex
    ];
  newLocalStorageObjects[selectedFolderIndex].movies.splice(
    movieIndex,
    1
  );
  newLocalStorageObjects[newFolderIndex].movies.push(
    crrMovie
  );
  return newLocalStorageObjects;
};
