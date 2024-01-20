import { LocalStorageObjects } from '@/types/localstrageObjects';
import {
  Pencil1Icon,
  TriangleRightIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getOnVideoEndIndex } from './logics/getOnVideoEndIndex';
import YoutubePlayer from '@/components/ui/youtubePlayer';
import { renameFolder } from '../PlayListSideBar/logics/renameFolder';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            <button
              key={movie.id}
              onClick={() => {
                setSelectedMovieIndex(index);
                setIsPlaying(true);
              }}
              className="h-[100px] w-full flex border-b-2 border-primary-background overflow-hidden"
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
          )
        )}
      </div>
    </div>
  );
};

export default PlayList;
