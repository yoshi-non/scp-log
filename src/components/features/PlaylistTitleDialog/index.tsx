import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { renameFolder } from './logics/renameFolder';
import { useRef, useState } from 'react';

type Props = {
  selectedFolderIndex: number;
  lsPlaylists: LocalStorageObjects;
  updateLSPlaylists: (
    newPlaylist: LocalStorageObjects
  ) => void;
};

const PlaylistTitleDialog = ({
  selectedFolderIndex,
  lsPlaylists,
  updateLSPlaylists,
}: Props) => {
  const inputRenameRef = useRef<HTMLInputElement>(null);
  const selectedFolder = lsPlaylists[selectedFolderIndex];
  const renameFolderHandler = (
    index: number,
    newName: string
  ) => {
    if (!lsPlaylists) return;
    if (newName === '') return;
    const newObjects = renameFolder(
      index,
      newName,
      lsPlaylists
    );
    updateLSPlaylists(newObjects);
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
    <Dialog open={open} onOpenChange={setOpen}>
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
              placeholder="フォルダー名"
              defaultValue={selectedFolder.name}
              className="col-span-3"
              ref={inputRenameRef}
              onCompositionStart={startComposition}
              onCompositionEnd={endComposition}
              onKeyDown={(event) =>
                handleKeyDown(
                  event.key,
                  selectedFolderIndex,
                  inputRenameRef.current?.value ??
                    selectedFolder.name
                )
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistTitleDialog;
