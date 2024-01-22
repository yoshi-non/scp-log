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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deleteFile } from './logics/deleteFile';
import { transferFile } from './logics/transferFile';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import SortableItemWrapper from '../DndKit/SortableItemWrapper';
import { saveToLocalStorage } from '@/utils/storage';
import Timer from '@/components/ui/timer';

type Props = {
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  selectedFolderIndex: number;
};

const PlayList = ({
  localStorageObjects,
  setLocalStorageObjects,
  selectedFolderIndex,
}: Props) => {
  const inputRenameRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [newFolderIndex, setNewFolderIndex] = useState<
    number | null
  >(null);

  const [selectedMovieIndex, setSelectedMovieIndex] =
    useState<number>(0);
  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [selectedFolderIndex]);

  const onVideoEndHandler = () => {
    const index = getOnVideoEndIndex(
      selectedMovieIndex,
      localStorageObjects[selectedFolderIndex].movies.length
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

  const transferFileHandler = (movieIndex: number) => {
    if (
      !localStorageObjects ||
      selectedFolderIndex === newFolderIndex ||
      newFolderIndex === null
    )
      return;
    const newObjects = transferFile(
      movieIndex,
      selectedFolderIndex,
      newFolderIndex,
      localStorageObjects
    );
    if (movieIndex === selectedMovieIndex) {
      setIsPlaying(false);
    }
    setLocalStorageObjects(newObjects);
  };

  const deleteFileHandler = (movieIndex: number) => {
    if (!localStorageObjects) return;
    const newObject = deleteFile(
      movieIndex,
      selectedFolderIndex,
      localStorageObjects
    );
    setLocalStorageObjects(newObject);
  };

  // ドラッグ&ドロップでソート可能なリスト
  const [items, setItems] = useState<{
    [key: string]: string[];
  }>({
    container1: [],
  });

  // ドラッグの開始、移動、終了などにどのような入力を許可するかを決めるprops
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //各コンテナ取得関数
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key: string) =>
      items[key].includes(id.toString())
    );
  };

  //ドラッグ可能なアイテムがドロップ可能なコンテナの上に移動時に発火する関数
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    //ドラッグしたリソースのid
    const id = active.id.toString();
    //ドロップした場所にあったリソースのid
    const overId = over?.id;

    if (!overId) return;

    // ドラッグ、ドロップ時のコンテナ取得
    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      // 移動元のコンテナの要素配列を取得
      const activeItems = prev[activeContainer];
      // 移動先のコンテナの要素配列を取得
      const overItems = prev[overContainer];

      // 配列のインデックス取得
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(
        overId.toString()
      );

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over && overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex =
          overIndex >= 0
            ? overIndex + modifier
            : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter(
            (item) => item !== active.id
          ),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(
            newIndex,
            prev[overContainer].length
          ),
        ],
      };
    });
  };

  // ドラッグ終了時に発火する関数
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    //ドラッグしたリソースのid
    const id = active.id.toString();
    //ドロップした場所にあったリソースのid
    const overId = over?.id;

    if (!overId) return;

    // ドラッグ、ドロップ時のコンテナ取得
    const activeContainer = findContainer(id);
    const overContainer = findContainer(over?.id);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    // 配列のインデックス取得
    const activeIndex = items[activeContainer].indexOf(id);
    const overIndex = items[overContainer].indexOf(
      overId.toString()
    );

    if (activeIndex !== overIndex) {
      // ローカルストレージの更新
      const newLocalStorageObjects = [
        ...localStorageObjects,
      ];
      // newLocalStorageObjects[selectedFolderIndex].moviesのindex値でactiveIndexとoverIndexを入れ替える
      const newObjects = newLocalStorageObjects.map(
        (localStorageObject, folderIndex) => {
          if (folderIndex === selectedFolderIndex) {
            return {
              ...localStorageObject,
              movies: arrayMove(
                localStorageObject.movies,
                activeIndex,
                overIndex
              ),
            };
          } else {
            return localStorageObject;
          }
        }
      );
      setLocalStorageObjects(newObjects);
      saveToLocalStorage('myData', newObjects);
    } else {
      // 動画を再生する
      setSelectedMovieIndex(activeIndex);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setItems({
      container1: localStorageObjects[
        selectedFolderIndex
      ]?.movies.map((_, index) => String(index)),
    });
  }, [localStorageObjects, selectedFolderIndex]);

  return (
    <div className="flex w-full h-full">
      {localStorageObjects[selectedFolderIndex]?.movies
        .length > 0 ? (
        <div className="min-h-[620px] w-[300px] bg-muted flex direction-normal items-start justify-center">
          {isPlaying ? (
            // youtubeを再生するプレイヤー
            <div>
              <div className="w-[300px] h-[170px]">
                <YoutubePlayer
                  videoId={
                    localStorageObjects[selectedFolderIndex]
                      .movies[selectedMovieIndex]?.id
                  }
                  onVideoEnd={onVideoEndHandler}
                />
              </div>
              <p className="text-xl p-2">
                {
                  localStorageObjects[selectedFolderIndex]
                    .movies[selectedMovieIndex]?.title
                }
              </p>
            </div>
          ) : (
            <div className="w-[300px] flex flex-col">
              <div className="overflow-hidden flex justify-center items-center w-[300px] h-[170px]">
                <Image
                  src={
                    localStorageObjects[selectedFolderIndex]
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
                              selectedFolderIndex
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
                                selectedFolderIndex
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
                                selectedFolderIndex,
                                inputRenameRef.current
                                  ?.value ??
                                  localStorageObjects[
                                    selectedFolderIndex
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
                      localStorageObjects[
                        selectedFolderIndex
                      ].name
                    }
                  </p>
                </div>
                <p className="text-primary">
                  {
                    localStorageObjects[selectedFolderIndex]
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

      {items.container1?.length > 0 && (
        <div className="flex flex-auto justify-between">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              id="container1"
              items={items.container1}
              strategy={rectSortingStrategy}
            >
              <div className="flex-auto">
                {localStorageObjects[
                  selectedFolderIndex
                ]?.movies.map((movie, index) => (
                  <div
                    key={index}
                    className="h-[100px] border-b-2 border-primary-background"
                  >
                    <SortableItemWrapper id={String(index)}>
                      <div className="flex">
                        <div className="h-[100px] min-w-10 w-10 flex justify-center items-center">
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
                        <div>
                          <button
                            onClick={() => {
                              setSelectedMovieIndex(index);
                              setIsPlaying(true);
                            }}
                            className="h-[100px] w-full flex overflow-hidden"
                          >
                            <div className="min-w-[200px] w-[200px] h-[98px] flex justify-center items-center bg-black">
                              <Image
                                src={movie.thumbnail}
                                width={240}
                                height={130}
                                alt="thumbnail"
                                className="object-cover min-w-[200px] w-[200px] h-[98px] overflow-hidden"
                              />
                            </div>
                            <p className="h-full p-2 text-left flex-auto">
                              {movie.title}
                            </p>
                          </button>
                        </div>
                      </div>
                    </SortableItemWrapper>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="w-[39px]">
            {localStorageObjects[
              selectedFolderIndex
            ]?.movies.map((movie, index) => (
              <Menubar
                className="h-[100px] p-0 flex flex-col border-x-0 border-t-0 border-b-2 border-primary-background rounded-none"
                key={index}
              >
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
                                {newFolderIndex !== null
                                  ? localStorageObjects[
                                      newFolderIndex
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
                                      folderIndex
                                    ) => (
                                      <CommandItem
                                        key={folderIndex}
                                        value={String(
                                          folderIndex
                                        )}
                                        onSelect={() => {
                                          setNewFolderIndex(
                                            Number(
                                              folderIndex
                                            )
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
                          <DialogClose asChild>
                            <Button
                              disabled={
                                newFolderIndex === null ||
                                newFolderIndex ===
                                  selectedFolderIndex
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayList;
