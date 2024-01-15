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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

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
    <main className="px-10">
      <Tabs defaultValue="playlist" className="w-full">
        <TabsList>
          <TabsTrigger value="playlist">
            Playlist
          </TabsTrigger>
          <TabsTrigger value="addMovie">
            Add Movie
          </TabsTrigger>
        </TabsList>
        <TabsContent value="playlist">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] rounded-lg border"
          >
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">
                  Sidebar
                </span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">
                  Content
                </span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        <TabsContent value="addMovie">addMovie</TabsContent>
      </Tabs>
    </main>
  );
}
