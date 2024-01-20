import { LocalStorageObjects } from '@/types/localstrageObjects';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { getOnVideoEndIndex } from './logics/getOnVideoEndIndex';
import YoutubePlayer from '@/components/ui/youtubePlayer';

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
  const [selectedMovieIndex, setSelectedMovieIndex] =
    useState<number>(0);
  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  const onVideoEndHandler = () => {
    const index = getOnVideoEndIndex(
      selectedMovieIndex,
      localStorageObjects[selectedFolder].movies.length
    );
    setSelectedMovieIndex(index);
  };

  useEffect(() => {
    setIsPlaying(false);
  }, [selectedFolder]);

  return (
    <div className="flex w-full">
      {localStorageObjects[selectedFolder]?.movies.length >
      0 ? (
        <div className="min-h-[620px] w-[300px] bg-primary-foreground flex direction-normal items-start justify-center">
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
              <div>
                <p className="text-xl p-2">
                  {
                    localStorageObjects[selectedFolder]
                      .movies[selectedMovieIndex].title
                  }
                </p>
              </div>
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
              <div className="text-left">
                <p className="font-bold">
                  {localStorageObjects[selectedFolder].name}
                </p>
                <p>
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
        <div className="flex justify-between items-center border-b-2 border-primary-background">
          <div>動画がありません</div>
        </div>
      )}
      <div className="w-full">
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
