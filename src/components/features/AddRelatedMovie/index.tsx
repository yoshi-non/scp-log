import { Button } from '@/components/ui/button';
import { localStorageInputKey } from '@/constants/localStorageKey';
import { Movies } from '@/types/localstrageObjects';
import { getFromLocalStorageInputKey } from '@/utils/storage';
import { youtubeRelatedSearch } from '@/utils/youtubeRelatedSearch';

type Props = {
  movies: Movies;
};

const AddRelatedMovie = ({ movies }: Props) => {
  const localStorageInputValue =
    getFromLocalStorageInputKey(localStorageInputKey);

  const youtubeRelatedSearchHandler = async () => {
    await youtubeRelatedSearch(
      movies,
      localStorageInputValue
    );
  };
  return (
    <div className="w-full p-2">
      <div>
        <Button
          className="w-full"
          variant="outline"
          onClick={youtubeRelatedSearchHandler}
        >
          関連動画を追加
        </Button>
      </div>
    </div>
  );
};

export default AddRelatedMovie;
