import { Button } from '@/components/ui/button';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';
import { CardStackPlusIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  localStorageObjects: LocalStorageObjects | null;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects | null>
  >;
};

const PlayListSideBar = ({
  localStorageObjects,
  setLocalStorageObjects,
}: Props) => {
  const addFolderHandler = () => {
    const newFolder = {
      id: localStorageObjects?.length || 0,
      name: 'New Folder',
    };

    const newLocalStorageObjects = localStorageObjects
      ? [...localStorageObjects, newFolder]
      : [newFolder];

    saveToLocalStorage('myData', newLocalStorageObjects);
    setLocalStorageObjects(newLocalStorageObjects);
  };
  return (
    <div className="p-2">
      <Button
        onClick={addFolderHandler}
        variant="ghost"
        className="w-full"
      >
        <CardStackPlusIcon />
        <span>&nbsp;&nbsp;Add Folder</span>
      </Button>
      <ScrollArea className="mt-2 h-full w-full rounded-md">
        <div className="flex flex-col gap-2">
          {localStorageObjects?.map((folder) => (
            <Button
              key={folder.id}
              variant="ghost"
              className="w-full border-b-2 border-gray-300 rounded-none"
            >
              {folder.name}
            </Button>
          ))}
          {localStorageObjects?.length === 0 && (
            <p className="text-center">
              You don&apos;t have any folder yet.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlayListSideBar;
