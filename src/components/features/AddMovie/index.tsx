import { Input } from '@/components/ui/input';
import { youtubeSearch } from '@/utils/youtubeSearch';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import { toast } from 'sonner';
import AddMovieOnlineDialog from '../AddMovieOnlineDialog';
import AddMovieOfflineDialog from '../AddMovieOfflineDialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLSYoutubeApiKey } from '@/usecases/useLSYoutubeApiKey';

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
    if (inputRef.current && inputRef.current.value === '') {
      inputRef.current.focus();
    }
  }, [tab]);

  // 保存先のフォルダーの値
  const [value, setValue] = useState<number | null>(null);
  // ID検索モード
  const [isIdSearch, setIsIdSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { youtubeApiKey } = useLSYoutubeApiKey();

  const youtubeSearchHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!inputRef.current) return;
    if (inputRef.current.value.trim() === '') return;
    const data = await youtubeSearch(
      isIdSearch,
      inputRef.current.value,
      youtubeApiKey
    );
    if (!data) {
      toast.error(
        'Youtube Data API keyが間違っているか、APIの呼び出し回数が上限に達しました。'
      );
      return;
    } else if (data.length === 0) {
      toast.error('検索結果がありません。');
      return;
    }
    setSearchResult(data);
    setTmpKeyword(inputRef.current.value);
  };

  return (
    <div>
      <div className="w-[70%] mx-auto mt-5">
        <div className="w-full flex gap-2 justify-end items-center mb-2">
          <Label htmlFor="id-search-mode">
            {isIdSearch ? 'ID検索' : 'キーワード検索'}
          </Label>
          <Switch
            id="id-search-mode"
            checked={isIdSearch}
            onCheckedChange={(value) => {
              setIsIdSearch(value);
            }}
          />
        </div>
        <form onSubmit={youtubeSearchHandler}>
          <Input
            type="search"
            placeholder="動画を検索"
            defaultValue={tmpKeyword}
            ref={inputRef}
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
