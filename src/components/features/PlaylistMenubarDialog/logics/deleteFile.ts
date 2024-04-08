import { LocalStorageObjects } from '@/types/localstrageObjects';
import { toast } from 'sonner';

export const deleteFile = (
  movieIndex: number,
  folderIndex: number,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  toast(
    `${localStorageObjects[folderIndex].movies[movieIndex].title}を削除しました。`,
    {
      style: {
        background: '#f44336',
        color: '#fff',
      },
    }
  );
  newLocalStorageObjects[folderIndex].movies.splice(
    movieIndex,
    1
  );
  return newLocalStorageObjects;
};
