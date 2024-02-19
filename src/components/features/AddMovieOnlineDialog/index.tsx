import { DownloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/libs/utils';
import { preserveToFolder } from '../AddMovie/logics/preserveToFolder';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { LocalStorageObjects } from '@/types/localstrageObjects';

type Props = {
  item: YouTubeSearchResult;
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  value: number | null;
  setValue: React.Dispatch<
    React.SetStateAction<number | null>
  >;
};

const AddMovieOnlineDialog = ({
  item,
  localStorageObjects,
  setLocalStorageObjects,
  value,
  setValue,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const preserveToFolderHandler = (
    movieId: string,
    movieTitle: string,
    thumbnailUrl: string
  ) => {
    const newObjects = preserveToFolder(
      value !== null ? value : 0,
      movieId,
      movieTitle,
      thumbnailUrl,
      localStorageObjects
    );

    setLocalStorageObjects(newObjects);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="mt-5"
        >
          <DownloadIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>プレイリストに追加</DialogTitle>
          <DialogDescription>
            どのフォルダに保存しますか？
            <br />
            ※フォルダがない場合は新規作成されます。
          </DialogDescription>
        </DialogHeader>
        {localStorageObjects.length === 0 ? (
          <div>フォルダがないため、自動作成されます。</div>
        ) : (
          <div className="py-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value !== null
                    ? localStorageObjects[value].name
                    : 'Select folder...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandGroup>
                    {localStorageObjects.map(
                      (localStorageObject, index) => (
                        <CommandItem
                          key={index}
                          value={String(index)}
                          onSelect={() => {
                            setValue(Number(index));
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === index
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {localStorageObject.name}
                        </CommandItem>
                      )
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={
                value === null &&
                localStorageObjects.length !== 0
              }
              onClick={() =>
                preserveToFolderHandler(
                  item.id.videoId,
                  item.snippet.title,
                  item.snippet.thumbnails.high.url
                )
              }
            >
              保存
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovieOnlineDialog;
