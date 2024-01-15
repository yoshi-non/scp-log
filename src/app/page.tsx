'use client';
import { useEffect, useState } from 'react';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utils/storage';

export default function Home() {
  // localstarageに保存されているデータを取得
  // dev環境ではkeyをmyDataにしている
  const [localStorageObjects, setLocalStorageObjects] =
    useState<LocalStorageObjects | null>(null);

  useEffect(() => {
    const storedData = getFromLocalStorage('myData');
    if (storedData) {
      setLocalStorageObjects(storedData);
    } else {
      const initialData: LocalStorageObjects = [];

      saveToLocalStorage('myData', initialData);
      setLocalStorageObjects(initialData);
    }
  }, []);

  return <main></main>;
}
