import { Input } from '@/components/ui/input';
import { youtubeSearch } from '@/utils/youtubeSearch';
import { useEffect, useState } from 'react';

const AddMovie = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any[]>(
    []
  );
  const youtubeSearchHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!checkValidate()) return;
    const data = youtubeSearch(keyword);
    if (!data) return;
    setSearchResult(data);
  };

  const checkValidate = () => {
    return !!keyword.trim();
  };

  useEffect(() => {
    console.log(searchResult);
  }, [searchResult]);

  return (
    <div className="w-[70%] mx-auto mt-5">
      <form onSubmit={youtubeSearchHandler}>
        <Input
          type="search"
          placeholder="動画を検索"
          value={keyword}
          onChange={(event) =>
            setKeyword(event.target.value)
          }
          required
        />
      </form>
    </div>
  );
};

export default AddMovie;
