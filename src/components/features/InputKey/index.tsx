import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLSYoutubeApiKey } from '@/usecases/useLSYoutubeApiKey';
import { useMasked } from './hooks/useMasked';

const InputKey = () => {
  const { youtubeApiKey, updateYoutubeApiKey } =
    useLSYoutubeApiKey();
  const { isMasked, changeMaskHandler } = useMasked();

  return (
    <div className="px-20">
      <p className="text-xl font-bold">
        Youtube Data API key (検索機能に使用します)
      </p>
      <p className="text-xs text-primary">
        *デスクトップアプリではKeyの設定が必須になります。
        (WEBアプリでは設定しなくても検索機能は使用できます)
      </p>
      <div className="flex gap-2 mt-2">
        <Input
          type={isMasked ? 'password' : 'text'}
          name="val_password"
          placeholder="Youtube Data API key"
          value={youtubeApiKey}
          onChange={(e) =>
            updateYoutubeApiKey(e.target.value)
          }
        />
        <Button
          variant="link"
          type="button"
          onClick={changeMaskHandler}
        >
          {isMasked ? 'show' : 'hide'}
        </Button>
      </div>
    </div>
  );
};

export default InputKey;
