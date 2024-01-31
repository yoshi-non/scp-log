import { mockYoutubeSearchGet } from '@/apis/mocks/youtubeSearch/get';
import { Input } from '@/components/ui/input';
import { youtubeSearch } from '@/utils/youtubeSearch';
import { DownloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
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
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { preserveToFolder } from './logics/preserveToFolder';
import { mockYoutubeSearchGetDomain } from '@/apis/mocks/common';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { localStorageInputKey } from '@/constants/localStorageKey';
import { getFromLocalStorageInputKey } from '@/utils/storage';
import { toast } from 'sonner';
import { youtubeDownload } from '@/utils/youtubeDownload';

type Props = {
  tab: string;
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  searchResult: YouTubeSearchResult[];
  setSearchResult: React.Dispatch<
    React.SetStateAction<YouTubeSearchResult[]>
  >;
};

const AddMovie = ({
  tab,
  localStorageObjects,
  setLocalStorageObjects,
  keyword,
  setKeyword,
  searchResult,
  setSearchResult,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number | null>(null);
  const localStorageInputValue =
    getFromLocalStorageInputKey(localStorageInputKey);

  const youtubeSearchHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!checkValidate()) return;
    // localhostの場合は、APIを叩かない
    const domain = window.location.origin;
    if (domain === mockYoutubeSearchGetDomain) {
      const data =
        mockYoutubeSearchGet() as YouTubeSearchResult[];
      const filterData = data.filter((item) => {
        return item.id.kind === 'youtube#video';
      });
      setSearchResult(filterData);
    } else {
      const data = await youtubeSearch(
        keyword,
        localStorageInputValue
      );
      if (!data || data.length === 0) {
        toast.error(
          'Youtube Data API keyが間違っているか、APIの呼び出し回数が上限に達しました。'
        );
        return;
      }
      setSearchResult(data);
    }
  };

  const checkValidate = () => {
    return !!keyword.trim();
  };

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
        {searchResult.map((item, i) => (
          <div key={i} className="w-[240px] mx-5 my-2">
            <Image
              width={240}
              height={130}
              className="w-[240px] h-[130px] object-cover rounded-md"
              src={item.snippet.thumbnails.high.url}
              alt={item.snippet.title}
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
                  {tab === 'addMovie' ? (
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
                      {localStorageObjects.length === 0 ? (
                        <div>
                          フォルダがないため、自動作成されます。
                        </div>
                      ) : (
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
                                  ? localStorageObjects[
                                      value
                                    ].name
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
                                        value={String(
                                          index
                                        )}
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
                      )}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="submit"
                            disabled={
                              value === null &&
                              localStorageObjects.length !==
                                0
                            }
                            onClick={() =>
                              preserveToFolderHandler(
                                item.id.videoId,
                                item.snippet.title,
                                item.snippet.thumbnails.high
                                  .url
                              )
                            }
                          >
                            保存
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  ) : (
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          オフライン保存
                        </DialogTitle>
                        <DialogDescription>
                          このPCに動画データ(mp4)を保存します。
                          {item.snippet.title}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={() =>
                              youtubeDownload(
                                item.id.videoId
                              )
                            }
                          >
                            保存
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  )}
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
