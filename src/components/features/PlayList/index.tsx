import { LocalStorageObjects } from '@/types/localstrageObjects';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getOnVideoEndIndex } from './logics/getOnVideoEndIndex';
import YoutubePlayer from '@/components/ui/youtubePlayer';
import SortableItemWrapper from '../../functions/DndKit/SortableItemWrapper';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddRelatedMovie from '../AddRelatedMovie';
import PlaylistTitleDialog from '../PlaylistTitleDialog';
import PlaylistMenubarDialog from '../PlaylistMenubarDialog';
import DndContextWrapper from '../../functions/DndKit/DndContextWrapper';
import { VideoMenuBar } from '../VideoMenuBar';
import { useYouTubePlayer } from '@/usecases/useYouTubePlayer';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { PlayingType } from '@/types/PlayingType';
import { useShortcutToggle } from './hooks/useShortcutToggle';
import { usePlaybackPattern } from './hooks/usePlaybackPattern';

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
  const [isReady, setIsReady] = useState<boolean>(false);
  const [selectedMovieIndex, setSelectedMovieIndex] =
    useState<number>(0);
  const [isPlaying, setIsPlaying] =
    useState<PlayingType>(null);
  const { playVideo, pauseVideo, seekTo, playerRef } =
    useYouTubePlayer();
  const { playbackPattern, handlePlaybackPattern } =
    usePlaybackPattern();

  // ショートカットキーの設定
  useShortcutToggle(
    isPlaying,
    playVideo,
    pauseVideo,
    seekTo
  );

  useEffect(() => {
    setIsReady(false);
  }, [selectedFolderIndex]);

  const { items, setItems, handleDragOver, handleDragEnd } =
    useDragAndDrop(
      selectedFolderIndex,
      localStorageObjects,
      setLocalStorageObjects,
      setIsReady,
      selectedMovieIndex,
      setSelectedMovieIndex
    );

  const selectedFolder =
    localStorageObjects[selectedFolderIndex];
  const movies = selectedFolder?.movies;

  /**
   * 動画が終了したときに次の動画を再生する
   */
  const onVideoEndHandler = () => {
    if (playbackPattern === 'normal') {
      const index = getOnVideoEndIndex(
        selectedMovieIndex,
        movies.length
      );
      setSelectedMovieIndex(index);
    } else {
      let index = Math.floor(Math.random() * movies.length);
      while (index === selectedMovieIndex) {
        index = Math.floor(Math.random() * movies.length);
      }
      setSelectedMovieIndex(index);
    }
  };

  /**
   * 前の動画を再生する
   */
  const handlePrevVideo = () => {
    const newIndex =
      (selectedMovieIndex - 1 + movies.length) %
      movies.length;
    setSelectedMovieIndex(newIndex);
  };

  /**
   * 次の動画を再生する
   */
  const handleNextVideo = () => {
    const newIndex =
      (selectedMovieIndex + 1) % movies.length;
    setSelectedMovieIndex(newIndex);
  };

  return (
    <div className="flex w-full h-[calc(100vh-120px)] overflow-hidden">
      {movies && movies.length > 0 ? (
        <div className="w-[300px] bg-muted">
          {isReady ? (
            <div>
              <div className="w-[300px] h-[169px]">
                <YoutubePlayer
                  ref={playerRef}
                  videoId={movies[selectedMovieIndex]?.id}
                  onVideoEnd={onVideoEndHandler}
                  onVideoPlay={() =>
                    setIsPlaying('PLAYING')
                  }
                  onVideoPause={() =>
                    setIsPlaying('PAUSED')
                  }
                  onVideoBuffering={() =>
                    setIsPlaying('BUFFERING')
                  }
                />
              </div>
              <VideoMenuBar
                isPlaying={isPlaying}
                playVideo={playVideo}
                pauseVideo={pauseVideo}
                prevVideo={handlePrevVideo}
                nextVideo={handleNextVideo}
                playbackPattern={playbackPattern}
                handlePlaybackPattern={
                  handlePlaybackPattern
                }
              />
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
                  priority
                  className="object-cover w-[300px] min-w[300px] h-[169px] overflow-hidden"
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
                <DndContextWrapper
                  sortableContextId="container1"
                  handleDragOver={handleDragOver}
                  handleDragEnd={handleDragEnd}
                  items={items}
                >
                  {movies.map((movie, index) => (
                    // Webアクセシビリティのためのdivタグを使用
                    // todo:ドラッグアンドドロップの判定で何秒以上長押ししたらドラッグアンドドロップが開始されるかを設定する
                    <div
                      key={index}
                      className="h-[100px] w-full border-b-2 border-primary-background hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setSelectedMovieIndex(index);
                        setIsReady(true);
                      }}
                    >
                      <SortableItemWrapper
                        id={String(index)}
                      >
                        <div className="h-[100px] flex overflow-hidden justify-center">
                          <div className="h-[100px] w-10 min-w-10 flex justify-center items-center overflow-hidden">
                            {index === selectedMovieIndex &&
                            isReady ? (
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
                            priority
                          />
                          <p className="h-full p-2 text-left flex-auto">
                            {movie.title}
                          </p>
                        </div>
                      </SortableItemWrapper>
                    </div>
                  ))}
                </DndContextWrapper>
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
                    setIsReady={setIsReady}
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
