import { Input } from '@/components/ui/input';
import { youtubeSearch } from '@/utils/youtubeSearch';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { localStorageInputKey } from '@/constants/localStorageKey';
import { getFromLocalStorageInputKey } from '@/utils/storage';
import { toast } from 'sonner';
import AddMovieOnlineDialog from '../AddMovieOnlineDialog';
import AddMovieOfflineDialog from '../AddMovieOfflineDialog';

type Props = {
  tab: string;
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  searchResult: YouTubeSearchResult[];
  setSearchResult: React.Dispatch<
    React.SetStateAction<YouTubeSearchResult[]>
  >;
};

const AddMovie = ({
  tab,
  localStorageObjects,
  setLocalStorageObjects,
  keyword,
  setKeyword,
  searchResult,
  setSearchResult,
}: Props) => {
  const [value, setValue] = useState<number | null>(null);
  const localStorageInputValue =
    getFromLocalStorageInputKey(localStorageInputKey);

  const youtubeSearchHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!checkValidate()) return;
    if (
      process.env.NEXT_PUBLIC_IS_MOCK_YOUTUBE_SEARCH ===
      'true'
    ) {
      // 開発環境でのみ使用
      const fetchMockData = async () => {
        const data = await fetch(
          'http://localhost:3000/api/mocks/youtube-search'
        );
        return data.json();
      };
      const data: YouTubeSearchResult[] =
        await fetchMockData();
      const filterData = data.filter((item) => {
        return item.id.kind === 'youtube#video';
      });
      setSearchResult(filterData);
    } else {
      const data = await youtubeSearch(
        keyword,
        localStorageInputValue
      );
      if (!data || data.length === 0) {
        toast.error(
          'Youtube Data API keyが間違っているか、APIの呼び出し回数が上限に達しました。'
        );
        return;
      }
      setSearchResult(data);
    }
  };

  const checkValidate = () => {
    return !!keyword.trim();
  };

  /**
   * 初期ロード
   * - inputにフォーカスを当てる
   */
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tab]);

  return (
    <div>
      <div className="w-[70%] mx-auto mt-5">
        <form onSubmit={youtubeSearchHandler}>
          <Input
            type="search"
            placeholder="動画を検索"
            ref={inputRef}
            value={keyword}
            onChange={(event) =>
              setKeyword(event.target.value)
            }
            required
          />
        </form>
      </div>
      <div className="w-full flex flex-wrap justify-center">
        {searchResult.map((item, i) => (
          <div key={i} className="w-[240px] mx-5 my-2">
            <Image
              width={240}
              height={130}
              className="w-[240px] h-[130px] object-cover rounded-md"
              src={item.snippet.thumbnails.high.url}
              alt={item.snippet.title}
            />
            <div>
              <div className="mt-2 flex justify-between">
                <div>
                  <p className="text-sm text-destructive">
                    {item.snippet.channelTitle}
                  </p>
                  <p className="h-[50px] w-[190px] overflow-hidden">
                    {item.snippet.title}
                  </p>
                </div>
                {tab === 'addMovie' && (
                  <AddMovieOnlineDialog
                    item={item}
                    localStorageObjects={
                      localStorageObjects
                    }
                    setLocalStorageObjects={
                      setLocalStorageObjects
                    }
                    value={value}
                    setValue={setValue}
                  />
                )}
                {tab === 'download' && (
                  <AddMovieOfflineDialog item={item} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddMovie;
