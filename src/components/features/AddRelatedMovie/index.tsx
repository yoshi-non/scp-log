import { Button } from '@/components/ui/button';
import { localStorageInputKey } from '@/constants/localStorageKey';
import { Movies } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { getFromLocalStorageInputKey } from '@/utils/storage';
import { youtubeRelatedSearch } from '@/utils/youtubeRelatedSearch';
import { PlusIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  movies: Movies;
};

const AddRelatedMovie = ({ movies }: Props) => {
  const localStorageInputValue =
    getFromLocalStorageInputKey(localStorageInputKey);
  const [relatedMovies, setRelatedMovies] = useState<
    YouTubeSearchResult[]
  >([]);

  const youtubeRelatedSearchHandler = async () => {
    const searchRelatedMovies = await youtubeRelatedSearch(
      movies,
      localStorageInputValue
    );
    setRelatedMovies(searchRelatedMovies);
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
              <button className="hover:bg-background rounded-full p-3">
                <PlusIcon width={23} height={23} />
              </button>
            </div>
          </button>
        ))}
      </div>
      <div>
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
    </div>
  );
};

export default AddRelatedMovie;
