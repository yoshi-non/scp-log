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
  selectedFolder: number;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<number>
  >;
};

const PlayListSideBar = ({
  localStorageObjects,
  setLocalStorageObjects,
  selectedFolder,
  setSelectedFolder,
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
    <div className="p-1">
      <Button
        onClick={addFolderHandler}
        variant="ghost"
        className="w-full bg-primary-foreground text-primary justify-start"
      >
        <CardStackPlusIcon />
        <span>&nbsp;&nbsp;Add Folder</span>
      </Button>
      <ScrollArea className="mt-1 h-full w-full">
        <div className="flex flex-col gap-1">
          {localStorageObjects?.map((folder, index) => (
            <Button
              key={folder.id}
              onClick={() => setSelectedFolder(index)}
              variant="ghost"
              className={`w-full rounded-none justify-start ${
                selectedFolder === index &&
                'bg-muted-foreground text-primary-foreground hover:bg-muted-foreground'
              }`}
            >
              {folder.name}
            </Button>
          ))}
          {(localStorageObjects?.length === 0 ||
            localStorageObjects === null) && (
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
