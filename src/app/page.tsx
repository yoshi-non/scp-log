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
import PlayListSideBar from '@/components/features/PlayListSideBar';

export default function Home() {
  // localstarageに保存されているデータを取得
  // dev環境ではkeyをmyDataにしている
  const [localStorageObjects, setLocalStorageObjects] =
    useState<LocalStorageObjects | null>(null);
  const [selectedFolder, setSelectedFolder] =
    useState<number>(0);

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
    <main>
      <Tabs defaultValue="playlist" className="w-full">
        <TabsList className="mx-5">
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
            className="min-h-[620px] border-y-2"
          >
            <ResizablePanel defaultSize={20} maxSize={50}>
              <PlayListSideBar
                localStorageObjects={localStorageObjects}
                setLocalStorageObjects={
                  setLocalStorageObjects
                }
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
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
