import { LocalStorageObjects } from '@/types/localstrageObjects';
import { toast } from 'sonner';

export const deleteFolder = (
  index: number,
  localStorageObjects: LocalStorageObjects
) => {
  const newLocalStorageObjects = [...localStorageObjects];
  toast(
    `${localStorageObjects[index].name}を削除しました。`,
    {
      style: {
        background: '#f44336',
        color: '#fff',
      },
    }
  );
  newLocalStorageObjects.splice(index, 1);
  return newLocalStorageObjects;
};
