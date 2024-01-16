import { mockYoutubeSearchGet } from '@/apis/mocks/youtubeSearch/get';
import { Input } from '@/components/ui/input';
import { youtubeSearch } from '@/utils/youtubeSearch';
import { DownloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
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
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { preserveToFolder } from './logics/preserveToFolder';

type Props = {
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
};

const AddMovie = ({
  localStorageObjects,
  setLocalStorageObjects,
}: Props) => {
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any[]>(
    []
  );
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number | null>(null);
  const youtubeSearchHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!checkValidate()) return;
    // localhostの場合は、APIを叩かない
    const domain = window.location.origin;
    if (domain === 'http://localhost:3000') {
      const data = mockYoutubeSearchGet();
      setSearchResult(data);
    } else {
      const data = await youtubeSearch(keyword);
      if (!data) return;
      setSearchResult(data);
    }
  };

  const checkValidate = () => {
    return !!keyword.trim();
  };

  const preserveToFolderHandler = (movieId: string) => {
    if (!value) return;
    const newObjects = preserveToFolder(
      value,
      movieId,
      localStorageObjects
    );
    setLocalStorageObjects(newObjects);
    setOpen(false);
  };

  return (
    <div>
      <div className="w-[70%] mx-auto mt-5">
        <form onSubmit={youtubeSearchHandler}>
          <Input
            type="search"
            placeholder="動画を検索"
            value={keyword}
            onChange={(event) =>
              setKeyword(event.target.value)
            }
            required
          />
        </form>
      </div>
      <div className="w-full flex flex-wrap justify-center">
        {searchResult.map((item) => (
          <div
            key={item.id.videoId}
            className="w-[240px] mx-5 my-2"
          >
            <Image
              width={240}
              height={130}
              className="w-[240px] h-[130px] object-cover rounded-md"
              src={item.snippet.thumbnails.high.url}
              alt={item.snippet.title}
              onError={(e) =>
                console.error('Image failed to load', e)
              }
            />
            <div>
              <div className="mt-2 flex justify-between">
                <div>
                  <p className="text-sm text-destructive">
                    {item.snippet.channelTitle}
                  </p>
                  <p className="h-[50px] w-[190px] overflow-hidden">
                    {item.snippet.title}
                  </p>
                </div>
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
                      <DialogTitle>
                        プレイリストに追加
                      </DialogTitle>
                      <DialogDescription>
                        どのフォルダに保存しますか？
                        <br />
                        ※フォルダがない場合は新規作成されます。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Popover
                        open={open}
                        onOpenChange={setOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {value !== null
                              ? localStorageObjects[value]
                                  .name
                              : 'Select folder...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandGroup>
                              {localStorageObjects.map(
                                (
                                  localStorageObject,
                                  index
                                ) => (
                                  <CommandItem
                                    key={index}
                                    value={String(index)}
                                    onSelect={() => {
                                      setValue(
                                        Number(index)
                                      );
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
                                    {
                                      localStorageObject.name
                                    }
                                  </CommandItem>
                                )
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={!value}
                        onClick={() =>
                          preserveToFolderHandler(
                            item.id.videoId
                          )
                        }
                      >
                        保存
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddMovie;
