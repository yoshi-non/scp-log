import { localStorageInputKey } from '@/constants/localStorageKey';
import { saveToLocalStorage } from '@/utils/storage';
import { toast } from 'sonner';

export const preserveInputKey = (inputValue: string) => {
  toast(`Youtube Data API keyを保存しました。`);
  saveToLocalStorage(localStorageInputKey, inputValue);
};
