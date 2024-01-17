import { LocalStorageObjects } from '@/types/localstrageObjects';
import Image from 'next/image';
import { useState } from 'react';

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
  return (
    <div className="flex w-full">
      {localStorageObjects[selectedFolder]?.movies.length >
      0 ? (
        <div className="min-h-[620px] w-[300px] bg-primary-foreground flex direction-normal items-start justify-center">
          <div className="">
            <div className="overflow-hidden flex justify-center items-center w-[240px] h-[130px]">
              <Image
                src={
                  localStorageObjects[selectedFolder]
                    .movies[0].thumbnail
                }
                width={240}
                height={130}
                alt="thumbnail"
              />
            </div>
            <div>
              <p className="font-bold">
                {localStorageObjects[selectedFolder].name}
              </p>
              <p>
                {
                  localStorageObjects[selectedFolder].movies
                    .length
                }
                本の動画
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center border-b-2 border-primary-background">
          <div>動画がありません</div>
        </div>
      )}
      <div className="w-full">
        <div>
          {localStorageObjects[selectedFolder]?.movies.map(
            (movie, index) => (
              <button
                key={movie.id}
                onClick={() => {
                  setSelectedMovieIndex(index);
                }}
                className="h-[130px] w-full flex border-b-2 border-primary-background overflow-hidden"
              >
                <div className="min-w-[240px] w-[240px] h-[130px] overflow-hidden flex justify-center items-center bg-black">
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
    </div>
  );
};

export default PlayList;
