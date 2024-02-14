import { Button } from '@/components/ui/button';
import { localStorageInputKey } from '@/constants/localStorageKey';
import {
  LocalStorageObjects,
  Movies,
} from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { getFromLocalStorageInputKey } from '@/utils/storage';
import { youtubeRelatedSearch } from '@/utils/youtubeRelatedSearch';
import { PlusIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';
import { preserveToFolder } from '../AddMovie/logics/preserveToFolder';

type Props = {
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  selectedFolderIndex: number;
  movies: Movies;
  setItems: React.Dispatch<{ [key: string]: string[] }>;
};

const AddRelatedMovie = ({
  localStorageObjects,
  setLocalStorageObjects,
  selectedFolderIndex,
  movies,
  setItems,
}: Props) => {
  const localStorageInputValue =
    getFromLocalStorageInputKey(localStorageInputKey);
  const [relatedMovies, setRelatedMovies] = useState<
    YouTubeSearchResult[]
  >([]);
  const [nextPageToken, setNextPageToken] = useState<
    string | undefined
  >(undefined);

  const youtubeRelatedSearchHandler = async () => {
    const searchRelatedMovies = await youtubeRelatedSearch(
      movies,
      localStorageInputValue,
      nextPageToken
    );
    setNextPageToken(searchRelatedMovies.nextPageToken);
    setRelatedMovies([
      ...relatedMovies,
      ...searchRelatedMovies.result,
    ]);
  };

  const preserveToFolderHandler = (
    movieId: string,
    movieTitle: string,
    thumbnailUrl: string
  ) => {
    const newObjects = preserveToFolder(
      selectedFolderIndex,
      movieId,
      movieTitle,
      thumbnailUrl,
      localStorageObjects
    );
    setLocalStorageObjects(newObjects);
    // 関連動画に追加したIDの動画を削除
    const newRelatedMovies = relatedMovies.filter(
      (movie) => movie.id.videoId !== movieId
    );
    setRelatedMovies(newRelatedMovies);
    setItems({
      container1: newObjects[
        selectedFolderIndex
      ].movies.map((_, index) => String(index)),
    });
  };
  return (
    <div className="w-full p-2">
      <div className="mt-2">
        {relatedMovies.map((relatedMovie) => (
          <button
            key={relatedMovie.id.videoId}
            onClick={() => {}}
            className="h-[112px] w-full p-2 flex items-center overflow-hidden hover:bg-secondary hover:opacity-70 rounded-md"
          >
            <div className="min-w-[200px] w-[200px] h-[98px] flex justify-center items-center bg-black rounded-md overflow-hidden">
              <Image
                src={
                  relatedMovie.snippet.thumbnails.high.url
                }
                width={240}
                height={130}
                alt="thumbnail"
                className="object-cover min-w-[200px] w-[200px] h-[98px] overflow-hidden"
              />
            </div>
            <p className="h-full p-2 text-left flex-auto">
              {relatedMovie.snippet.title}
            </p>
            <div className="flex justify-center items-center h-full">
              <button
                onClick={() =>
                  preserveToFolderHandler(
                    relatedMovie.id.videoId,
                    relatedMovie.snippet.title,
                    relatedMovie.snippet.thumbnails.high.url
                  )
                }
                className="hover:bg-background rounded-full p-3"
              >
                <PlusIcon width={23} height={23} />
              </button>
            </div>
          </button>
        ))}
      </div>
      <Button
        className="w-full"
        variant="outline"
        onClick={youtubeRelatedSearchHandler}
      >
        {relatedMovies.length > 0
          ? 'さらに検索'
          : '関連動画を追加'}
      </Button>
    </div>
  );
};

export default AddRelatedMovie;