import { LocalStorageObjects } from '@/types/localstrageObjects';
import {
  DotsVerticalIcon,
  Pencil1Icon,
  RocketIcon,
  TrashIcon,
  TriangleRightIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getOnVideoEndIndex } from './logics/getOnVideoEndIndex';
import YoutubePlayer from '@/components/ui/youtubePlayer';
import { renameFolder } from '../PlayListSideBar/logics/renameFolder';
import { Button } from '@/components/ui/button';
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
import { deleteFile } from './logics/deleteFile';
import { toast } from 'sonner';

type Props = {
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  selectedFolder: number;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<number>
  >;
};

const PlayList = ({
  localStorageObjects,
  setLocalStorageObjects,
  selectedFolder,
  setSelectedFolder,
}: Props) => {
  const inputRenameRef = useRef<HTMLInputElement>(null);

  const [selectedMovieIndex, setSelectedMovieIndex] =
    useState<number>(0);
  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [selectedFolder]);

  const onVideoEndHandler = () => {
    const index = getOnVideoEndIndex(
      selectedMovieIndex,
      localStorageObjects[selectedFolder].movies.length
    );
    setSelectedMovieIndex(index);
  };

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

  const transferFileHandler = (
    movieIndex: number,
    crrFolderIndex: number,
    newFoldlerIndex: number
  ) => {};

  const deleteFileHandler = (movieIndex: number) => {
    if (!localStorageObjects) return;
    const newObject = deleteFile(
      movieIndex,
      selectedFolder,
      localStorageObjects
    );
    setLocalStorageObjects(newObject);
    toast(
      `${localStorageObjects[selectedFolder].movies[movieIndex].title}を削除しました。`,
      {
        style: {
          background: '#f44336',
          color: '#fff',
        },
      }
    );
  };

  return (
    <div className="flex w-full h-full">
      {localStorageObjects[selectedFolder]?.movies.length >
      0 ? (
        <div className="min-h-[620px] w-[300px] bg-muted  flex direction-normal items-start justify-center">
          {isPlaying ? (
            // youtubeを再生するプレイヤー
            <div>
              <div className="w-[300px] h-[170px]">
                <YoutubePlayer
                  videoId={
                    localStorageObjects[selectedFolder]
                      .movies[selectedMovieIndex].id
                  }
                  onVideoEnd={onVideoEndHandler}
                />
              </div>
              <p className="text-xl p-2">
                {
                  localStorageObjects[selectedFolder]
                    .movies[selectedMovieIndex].title
                }
              </p>
            </div>
          ) : (
            <div className="w-[300px] flex flex-col">
              <div className="overflow-hidden flex justify-center items-center w-[300px] h-[170px]">
                <Image
                  src={
                    localStorageObjects[selectedFolder]
                      .movies[0].thumbnail
                  }
                  width={300}
                  height={170}
                  alt="thumbnail"
                />
              </div>
              <div className="text-left p-2">
                <div className="flex items-center text-xl gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="justify-start px-2 py-1.5"
                      >
                        <Pencil1Icon
                          width={20}
                          height={20}
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          Rename{' '}
                          {
                            localStorageObjects[
                              selectedFolder
                            ].name
                          }
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
                            defaultValue={
                              localStorageObjects[
                                selectedFolder
                              ].name
                            }
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
                                selectedFolder,
                                inputRenameRef.current
                                  ?.value ??
                                  localStorageObjects[
                                    selectedFolder
                                  ].name
                              )
                            }
                          >
                            変更
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <p className="font-bold">
                    {
                      localStorageObjects[selectedFolder]
                        .name
                    }
                  </p>
                </div>
                <p className="text-primary">
                  {
                    localStorageObjects[selectedFolder]
                      .movies.length
                  }
                  本の動画
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <div>動画を追加してください。</div>
        </div>
      )}
      <div>
        {localStorageObjects[selectedFolder]?.movies.map(
          (movie, index) => (
            <div
              key={movie.id}
              className="h-[100px] flex justify-between items-center border-b-2 border-primary-background"
            >
              <button
                onClick={() => {
                  setSelectedMovieIndex(index);
                  setIsPlaying(true);
                }}
                className="h-full w-full flex overflow-hidden"
              >
                <div className="h-full min-w-10 flex justify-center items-center">
                  {index === selectedMovieIndex &&
                  isPlaying ? (
                    <TriangleRightIcon
                      width={30}
                      height={30}
                    />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="min-w-[200px] w-[180px] h-[100px] overflow-hidden flex justify-center items-center bg-black">
                  <Image
                    src={movie.thumbnail}
                    width={240}
                    height={130}
                    alt="thumbnail"
                  />
                </div>
                <p className="p-2 text-left flex-auto">
                  {movie.title}
                </p>
              </button>
              <Menubar className="h-full p-0 border-none">
                <MenubarMenu>
                  <MenubarTrigger className="h-full border-none hover:bg-primary-foreground rounded-none">
                    <DotsVerticalIcon className="text-primary" />
                  </MenubarTrigger>
                  <MenubarContent>
                    {/* <Dialog>
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
                              Transfer {}
                            </DialogTitle>
                            <DialogDescription>
                              ファイルを別のフォルダーに移動します。
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                onClick={() =>
                                  transferFileHandler(index)
                                }
                              >
                                転送
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog> */}
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
                              onClick={() =>
                                deleteFileHandler(index)
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
          )
        )}
      </div>
    </div>
  );
};

export default PlayList;
