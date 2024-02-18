import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  LocalStorageObjects,
} from '@/types/localstrageObjects';
import { renameFolder } from './logics/renameFolder';
import { useRef } from 'react';

type Props = {
  selectedFolderIndex: number;
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
};

const PlaylistTitleDialog = ({
  selectedFolderIndex,
  localStorageObjects,
  setLocalStorageObjects,
}: Props) => {
  const inputRenameRef = useRef<HTMLInputElement>(null);
  const selectedFolder =
    localStorageObjects[selectedFolderIndex];
  const renameFolderHandler = (
    index: number,
    newName: string
  ) => {
    if (!localStorageObjects) return;
    const newObjects = renameFolder(
      index,
      newName,
      localStorageObjects
    );
    setLocalStorageObjects(newObjects);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start px-2 py-1.5"
        >
          <Pencil1Icon width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Rename {selectedFolder.name}
          </DialogTitle>
          <DialogDescription>
            フォルダー名を変更します。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={selectedFolder.name}
              className="col-span-3"
              ref={inputRenameRef}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() =>
                renameFolderHandler(
                  selectedFolderIndex,
                  inputRenameRef.current?.value ??
                    selectedFolder.name
                )
              }
            >
              変更
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistTitleDialog;
