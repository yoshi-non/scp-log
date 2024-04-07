import { Input } from '@/components/ui/input';
import { youtubeSearch } from '@/utils/youtubeSearch';
import Image from 'next/image';
import {
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { localStorageInputKey } from '@/constants/localStorageKey';
import { getFromLocalStorageInputKey } from '@/utils/storage';
import { toast } from 'sonner';
import AddMovieOnlineDialog from '../AddMovieOnlineDialog';
import AddMovieOfflineDialog from '../AddMovieOfflineDialog';
import { useLSYoutubeSearchHistory } from '@/usecases/useLSYoutubeSearchHistory';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  tab: string;
  localStorageObjects: LocalStorageObjects;
  setLocalStorageObjects: React.Dispatch<
    React.SetStateAction<LocalStorageObjects>
  >;
  tmpKeyword: string;
  setTmpKeyword: React.Dispatch<
    React.SetStateAction<string>
  >;
  searchResult: YouTubeSearchResult[];
  setSearchResult: React.Dispatch<
    React.SetStateAction<YouTubeSearchResult[]>
  >;
};

const AddMovie = ({
  tab,
  localStorageObjects,
  setLocalStorageObjects,
  tmpKeyword,
  setTmpKeyword,
  searchResult,
  setSearchResult,
}: Props) => {
  /**
   * 初期ロード
   * - inputにフォーカスを当てる
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tab]);

  // 保存先のフォルダーの値
  const [value, setValue] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  /**
   * ローカルストレージからAPIキーを取得
   */
  const youtubeApiKey = getFromLocalStorageInputKey(
    localStorageInputKey
  );

  const [keyword, setKeyword] = useState<string>('');

  const {
    searchHistory,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
  } = useLSYoutubeSearchHistory();

  const youtubeSearchHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!inputRef.current) return;
    if (inputRef.current.value.trim() === '') return;
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
        inputRef.current.value,
        youtubeApiKey
      );
      if (!data || data.length === 0) {
        toast.error(
          'Youtube Data API keyが間違っているか、APIの呼び出し回数が上限に達しました。'
        );
        return;
      }
      setSearchResult(data);
      setTmpKeyword(inputRef.current.value);
    }
  };

  const handleSearchHistory = (keyword: string) => {};

  // inputが一定時間変更されなかったらkeywordを更新
  const debounced: ChangeEventHandler<HTMLInputElement> =
    useDebouncedCallback(({ target: { value } }) => {
      setTmpKeyword(value);
      setKeyword(value);
    }, 200);

  useEffect(() => {
    console.log(keyword);
  }, [keyword]);

  return (
    <div>
      <div className="w-[70%] mx-auto mt-5">
        <form onSubmit={youtubeSearchHandler}>
          <Input
            type="search"
            placeholder="動画を検索"
            defaultValue={tmpKeyword}
            ref={inputRef}
            value={keyword}
            onChange={debounced}
            required
          />
          {/* 検索履歴 */}
          <div>
            {searchHistory.length > 0 && (
              <div className="mt-2 flex flex-wrap">
                {searchHistory.map((history, i) => (
                  <div key={i}>
                    <button
                      className="bg-gray-200 px-2 py-1 rounded-md m-1"
                      onClick={() =>
                        handleSearchHistory(history)
                      }
                    >
                      {history}
                    </button>
                    <button
                      className="text-xs text-destructive"
                      onClick={() =>
                        removeSearchHistory(history)
                      }
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
