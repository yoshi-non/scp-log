import { Input } from '@/components/ui/input';
import { youtubeSearch } from '@/utils/youtubeSearch';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AddMovie = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any[]>(
    []
  );
  const youtubeSearchHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!checkValidate()) return;
    const data = await youtubeSearch(keyword);
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
    <div>
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
      <div className="w-full flex flex-wrap justify-center">
        {searchResult.length > 0 ? (
          searchResult.map((item, index) => (
            <div
              key={index}
              className="w-[240px] h-[130px] m-5"
            >
              <Image
                width={240}
                height={130}
                className="w-full h-full object-cover"
                src={item.snippet.thumbnails.high.url}
                alt={item.snippet.title}
                onError={(e) =>
                  console.error('Image failed to load', e)
                }
              />
            </div>
          ))
        ) : (
          <div>検索結果がありません</div>
        )}
      </div>
    </div>
  );
};

export default AddMovie;
