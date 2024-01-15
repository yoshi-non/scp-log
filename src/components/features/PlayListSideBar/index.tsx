import { Button } from '@/components/ui/button';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { saveToLocalStorage } from '@/utils/storage';
import {
  CardStackPlusIcon,
  DotsVerticalIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';

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
        className="w-full bg-primary-foreground text-primary justify-start hover:text-primary"
      >
        <CardStackPlusIcon />
        <span>&nbsp;&nbsp;Add Folder</span>
      </Button>
      <ScrollArea className="mt-1 h-full w-full">
        <div className="flex flex-col gap-1">
          {localStorageObjects?.map((folder, index) => (
            <div
              key={index}
              className="flex justify-between"
            >
              <Button
                onClick={() => setSelectedFolder(index)}
                variant="ghost"
                className={`w-full rounded-none justify-start ${
                  selectedFolder === index &&
                  'bg-muted-foreground text-primary-foreground hover:bg-muted-foreground hover:text-primary-foreground'
                }`}
              >
                {folder.name}
              </Button>
              <Menubar className="p-0 border-none">
                <MenubarMenu>
                  <MenubarTrigger
                    className={`h-full border-none hover:bg-primary-foreground 
                rounded-none ${
                  selectedFolder === index &&
                  'bg-muted-foreground'
                }`}
                  >
                    <DotsVerticalIcon className="text-primary" />
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      <Pencil1Icon />
                      &nbsp; 名前変更
                    </MenubarItem>
                    <MenubarItem className="text-primary focus:text-primary">
                      <TrashIcon />
                      &nbsp; フォルダ削除
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
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
