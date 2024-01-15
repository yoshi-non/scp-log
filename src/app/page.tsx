'use client';

import { useEffect, useState } from 'react';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utils/storage';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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

  return (
    <main className="px-24">
      <Tabs defaultValue="playlist" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="playlist">
            Playlist
          </TabsTrigger>
          <TabsTrigger value="addMovie">
            Add Movie
          </TabsTrigger>
        </TabsList>
        <TabsContent value="playlist">playlist</TabsContent>
        <TabsContent value="addMovie">addMovie</TabsContent>
      </Tabs>
    </main>
  );
}
