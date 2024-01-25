import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { preserveInputKey } from './logics/preserveInputKey';
import { localStorageInputKey } from '@/constants/localStorageKey';
import {
  getFromLocalStorageInputKey,
  saveToLocalStorage,
} from '@/utils/storage';
import { useEffect, useState } from 'react';

const InputKey = () => {
  const [
    localStorageInputValue,
    setLocalStorageInputValue,
  ] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isMasked, setIsMasked] = useState<boolean>(true);

  useEffect(() => {
    const storedData = getFromLocalStorageInputKey(
      localStorageInputKey
    );
    if (storedData) {
      setLocalStorageInputValue(storedData);
      setInputValue(storedData);
    } else {
      saveToLocalStorage(
        localStorageInputKey,
        localStorageInputValue
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMaskHandler = () => {
    if (!isMasked) {
      setIsMasked(true);
    } else {
      setIsMasked(false);
    }
  };

  const changeInputKeyHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValue(e.target.value);
  };

  const preserveInputKeyHandler = () => {
    if (localStorageInputValue === inputValue) return;
    preserveInputKey(inputValue);
  };

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
          value={inputValue}
          onChange={changeInputKeyHandler}
          onBlur={preserveInputKeyHandler}
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
