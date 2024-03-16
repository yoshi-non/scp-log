import { useRef, useState } from 'react';
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
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renameFolder } from '../PlaylistTitleDialog/logics/renameFolder';
import { deleteFolder } from './logics/deleteFolder';
import { localStorageKey } from '@/constants/localStorageKey';

type Props = {
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  selectedFolderIndex: number;
  setSelectedFolderIndex: React.Dispatch<
    React.SetStateAction<number>
  >;
};

const PlayListSideBar = ({
  localStorageObjects,
  setLocalStorageObjects,
  selectedFolderIndex,
  setSelectedFolderIndex,
}: Props) => {
  const inputRenameRef = useRef<HTMLInputElement>(null);

  const addFolderHandler = () => {
    const newFolder = {
      name: 'New Folder',
      movies: [],
    };
    const newLocalStorageObjects = localStorageObjects
      ? [...localStorageObjects, newFolder]
      : [newFolder];
    saveToLocalStorage(
      localStorageKey,
      newLocalStorageObjects
    );
    setLocalStorageObjects(newLocalStorageObjects);
  };

  const renameFolderHandler = (
    index: number,
    newName: string
  ) => {
    if (!localStorageObjects) return;
    if (newName === '') return;
    const newObjects = renameFolder(
      index,
      newName,
      localStorageObjects
    );
    setLocalStorageObjects(newObjects);
  };

  const deleteFolderHandler = (index: number) => {
    if (!localStorageObjects) return;
    const newObject = deleteFolder(
      index,
      localStorageObjects
    );
    setLocalStorageObjects(newObject);
  };

  const [open, setOpen] = useState<boolean>(false);
  const [composing, setComposition] =
    useState<boolean>(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);
  const handleKeyDown = (
    e: string,
    index: number,
    newName: string
  ) => {
    if (e === 'Enter') {
      if (composing) return;
      renameFolderHandler(index, newName);
      setOpen(false);
    }
  };

  return (
    <div className="p-1 h-[calc(100vh-120px)] overflow-hidden">
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
          {localStorageObjects.map((folder, index) => (
            <div
              key={index}
              className="flex justify-between"
            >
              <Button
                onClick={() =>
                  setSelectedFolderIndex(index)
                }
                variant="ghost"
                className={`w-full rounded-none justify-start ${
                  selectedFolderIndex === index &&
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
                  selectedFolderIndex === index &&
                  'bg-muted-foreground'
                }`}
                  >
                    <DotsVerticalIcon className="text-primary" />
                  </MenubarTrigger>
                  <MenubarContent>
                    <Dialog
                      open={open}
                      onOpenChange={setOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-2 py-1.5"
                        >
                          <Pencil1Icon />
                          &nbsp; 名前変更
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            Rename {folder.name}
                          </DialogTitle>
                          <DialogDescription>
                            フォルダー名を変更します。
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="name"
                              className="text-right"
                            >
                              Name
                            </Label>
                            <Input
                              id="name"
                              placeholder='フォルダー名'
                              defaultValue={folder.name}
                              className="col-span-3"
                              ref={inputRenameRef}
                              onCompositionStart={
                                startComposition
                              }
                              onCompositionEnd={
                                endComposition
                              }
                              onKeyDown={(event) =>
                                handleKeyDown(
                                  event.key,
                                  index,
                                  inputRenameRef.current
                                    ?.value ?? folder.name
                                )
                              }
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-2 py-1.5 text-primary hover:text-primary"
                        >
                          <TrashIcon />
                          &nbsp; フォルダ削除
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            Delete {folder.name}
                          </DialogTitle>
                          <DialogDescription>
                            ファルダー内の動画も全て削除されます。
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              onClick={() =>
                                deleteFolderHandler(index)
                              }
                            >
                              削除
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          ))}
          {localStorageObjects.length === 0 && (
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
