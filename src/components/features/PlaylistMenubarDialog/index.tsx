import { Button } from '@/components/ui/button';
import {
  DotsVerticalIcon,
  RocketIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/libs/utils';
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
import { useState } from 'react';
import { transferFile } from './logics/transferFile';
import { deleteFile } from './logics/deleteFile';
import {
  LocalStorageObjects,
  Movie,
} from '@/types/localstrageObjects';

type Props = {
  movie: Movie;
  index: number;
  selectedMovieIndex: number;
  selectedFolderIndex: number;
  lsPlaylists: LocalStorageObjects;
  updateLSPlaylists: (
    newPlaylist: LocalStorageObjects
  ) => void;
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlaylistMenubarDialog = ({
  movie,
  index,
  selectedMovieIndex,
  selectedFolderIndex,
  lsPlaylists,
  updateLSPlaylists,
  setIsReady,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [newFolderIndex, setNewFolderIndex] = useState<
    number | null
  >(null);

  const transferFileHandler = (movieIndex: number) => {
    if (
      !lsPlaylists ||
      selectedFolderIndex === newFolderIndex ||
      newFolderIndex === null
    )
      return;
    const newObjects = transferFile(
      movieIndex,
      selectedFolderIndex,
      newFolderIndex,
      lsPlaylists
    );
    if (movieIndex === selectedMovieIndex) {
      setIsReady(false);
    }
    updateLSPlaylists(newObjects);
  };

  const deleteFileHandler = (movieIndex: number) => {
    if (!lsPlaylists) return;
    const newObject = deleteFile(
      movieIndex,
      selectedFolderIndex,
      lsPlaylists
    );
    updateLSPlaylists(newObject);
  };

  return (
    <Menubar className="h-[100px] p-0 flex flex-col border-x-0 border-t-0 border-b-2 border-primary-background rounded-none">
      <MenubarMenu>
        <MenubarTrigger className="h-full border-none hover:bg-primary-foreground rounded-none">
          <DotsVerticalIcon className="text-primary" />
        </MenubarTrigger>
        <MenubarContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-1.5"
              >
                <RocketIcon />
                &nbsp; ファイル転送
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  <p className="sm:max-w-[350px] whitespace-nowrap text-ellipsis overflow-hidden">
                    Transfer {movie.title}
                  </p>
                </DialogTitle>
                <DialogDescription>
                  ファイルを別のフォルダーに移動します。
                  転送先のフォルダーを選択してください。
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {newFolderIndex !== null
                        ? lsPlaylists[newFolderIndex].name
                        : 'Select folder...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandGroup>
                        {lsPlaylists.map(
                          (lsPlaylist, folderIndex) => (
                            <CommandItem
                              key={folderIndex}
                              value={String(folderIndex)}
                              onSelect={() => {
                                setNewFolderIndex(
                                  Number(folderIndex)
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  newFolderIndex ===
                                    folderIndex
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {lsPlaylist.name}
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    disabled={
                      newFolderIndex === null ||
                      newFolderIndex === selectedFolderIndex
                    }
                    onClick={() =>
                      transferFileHandler(index)
                    }
                  >
                    転送
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-1.5 text-primary hover:text-primary"
              >
                <TrashIcon />
                &nbsp; ファイル削除
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  <p className="sm:max-w-[350px] whitespace-nowrap text-ellipsis overflow-hidden">
                    Delete {movie.title}
                  </p>
                </DialogTitle>
                <DialogDescription>
                  動画を削除します。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() => deleteFileHandler(index)}
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
  );
};

export default PlaylistMenubarDialog;
