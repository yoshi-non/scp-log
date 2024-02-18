import { LocalStorageObjects } from '@/types/localstrageObjects';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getOnVideoEndIndex } from './logics/getOnVideoEndIndex';
import YoutubePlayer from '@/components/ui/youtubePlayer';
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
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import SortableItemWrapper from '../DndKit/SortableItemWrapper';
import { dndExchangeMovie } from './logics/dndExchangeMovie';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddRelatedMovie from '../AddRelatedMovie';
import PlaylistTitleDialog from '../PlaylistTitleDialog';
import PlaylistMenubarDialog from '../PlaylistMenubarDialog';

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
  const [selectedMovieIndex, setSelectedMovieIndex] =
    useState<number>(0);
  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [selectedFolderIndex]);

  const selectedFolder =
    localStorageObjects[selectedFolderIndex];
  const movies = selectedFolder?.movies;
  // ドラッグ&ドロップでソート可能なリスト
  const [items, setItems] = useState<{
    [key: string]: string[];
  }>({ container1: [] });

  useEffect(() => {
    setItems({
      container1: localStorageObjects[
        selectedFolderIndex
      ]?.movies.map((_, index) => String(index)),
    });
  }, [selectedFolderIndex, localStorageObjects]);

  const onVideoEndHandler = () => {
    const index = getOnVideoEndIndex(
      selectedMovieIndex,
      movies.length
    );
    setSelectedMovieIndex(index);
  };

  // ドラッグの開始、移動、終了などにどのような入力を許可するかを決めるprops
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //各コンテナ取得関数
  const findContainer = (id: UniqueIdentifier) => {
    const containerKey = Object.keys(items).find((key) =>
      items[key].includes(id.toString())
    );
    return containerKey || id;
  };

  //ドラッグ可能なアイテムがドロップ可能なコンテナの上に移動時に発火する関数
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id;
    if (!overId) return;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(
        overId.toString()
      );
      const newIndex =
        overId in prev
          ? overItems.length + 1
          : overIndex >= 0
          ? overIndex +
            (overIndex === overItems.length - 1 ? 1 : 0)
          : overItems.length + 1;
      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter(
          (item) => item !== id
        ),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...overItems.slice(
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
    const id = active.id.toString();
    const overId = over?.id;
    if (!overId) return;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }
    const activeIndex = items[activeContainer].indexOf(id);
    const overIndex = items[overContainer].indexOf(
      overId.toString()
    );
    if (activeIndex !== overIndex) {
      const newObjects = dndExchangeMovie(
        activeIndex,
        overIndex,
        selectedFolderIndex,
        localStorageObjects
      );
      setLocalStorageObjects(newObjects);
      if (activeIndex === selectedMovieIndex) {
        setSelectedMovieIndex(overIndex);
      }
      if (overIndex === selectedMovieIndex) {
        setSelectedMovieIndex(activeIndex);
      }
      if (
        overIndex !== selectedMovieIndex &&
        activeIndex !== selectedMovieIndex &&
        overIndex < selectedMovieIndex &&
        activeIndex > selectedMovieIndex
      ) {
        setSelectedMovieIndex(selectedMovieIndex + 1);
      }
      if (
        activeIndex !== selectedMovieIndex &&
        overIndex !== selectedMovieIndex &&
        activeIndex < selectedMovieIndex &&
        overIndex > selectedMovieIndex
      ) {
        setSelectedMovieIndex(selectedMovieIndex - 1);
      }
    } else {
      setSelectedMovieIndex(activeIndex);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-120px)] overflow-hidden">
      {movies && movies.length > 0 ? (
        <div className="w-[300px] bg-muted">
          {isPlaying ? (
            // youtubeを再生するプレイヤー
            <div>
              <div className="w-[300px] h-[169px]">
                <YoutubePlayer
                  videoId={movies[selectedMovieIndex]?.id}
                  onVideoEnd={onVideoEndHandler}
                />
              </div>
              <p className="text-xl p-2">
                {movies[selectedMovieIndex]?.title}
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="overflow-hidden flex justify-center items-center w-[300px] h-[169px]">
                <Image
                  src={movies[0].thumbnail}
                  width={300}
                  height={169}
                  alt="thumbnail"
                />
              </div>
              <div className="text-left p-2">
                <div className="flex items-center text-xl gap-1">
                  <PlaylistTitleDialog
                    selectedFolderIndex={
                      selectedFolderIndex
                    }
                    localStorageObjects={
                      localStorageObjects
                    }
                    setLocalStorageObjects={
                      setLocalStorageObjects
                    }
                  />
                  <p className="font-bold">
                    {selectedFolder.name}
                  </p>
                </div>
                <p className="text-primary">
                  {movies.length}
                  本の動画
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <p>動画を追加してください。</p>
        </div>
      )}

      {items.container1?.length > 0 &&
        movies?.length > 0 && (
          <ScrollArea className="w-full">
            <div className="flex">
              <div className="flex-auto">
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
                    {movies.map((movie, index) => (
                      // Webアクセシビリティのためのdivタグを使用
                      // todo:ドラッグアンドドロップの判定で何秒以上長押ししたらドラッグアンドドロップが開始されるかを設定する
                      <div
                        key={index}
                        className="h-[100px] w-full border-b-2 border-primary-background hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setSelectedMovieIndex(index);
                          setIsPlaying(true);
                        }}
                      >
                        <SortableItemWrapper
                          id={String(index)}
                        >
                          <div className="h-[100px] flex overflow-hidden justify-center">
                            <div className="h-[100px] w-10 min-w-10 flex justify-center items-center overflow-hidden">
                              {index ===
                                selectedMovieIndex &&
                              isPlaying ? (
                                <TriangleRightIcon
                                  width={30}
                                  height={30}
                                />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <Image
                              src={movie.thumbnail}
                              width={240}
                              height={130}
                              alt="thumbnail"
                              className="object-cover w-[200px] min-w-[200px] h-[98px] overflow-hidden"
                            />
                            <p className="h-full p-2 text-left flex-auto">
                              {movie.title}
                            </p>
                          </div>
                        </SortableItemWrapper>
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
              <div className="w-[39px]">
                {movies.map((movie, index) => (
                  <PlaylistMenubarDialog
                    key={index}
                    movie={movie}
                    index={index}
                    selectedMovieIndex={selectedMovieIndex}
                    selectedFolderIndex={
                      selectedFolderIndex
                    }
                    localStorageObjects={
                      localStorageObjects
                    }
                    setLocalStorageObjects={
                      setLocalStorageObjects
                    }
                    setIsPlaying={setIsPlaying}
                  />
                ))}
              </div>
            </div>
            <AddRelatedMovie
              localStorageObjects={localStorageObjects}
              setLocalStorageObjects={
                setLocalStorageObjects
              }
              selectedFolderIndex={selectedFolderIndex}
              movies={movies}
              setItems={setItems}
            />
          </ScrollArea>
        )}
    </div>
  );
};

export default PlayList;
