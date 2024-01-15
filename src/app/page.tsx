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
import { Button } from '@/components/ui/button';
import { CardStackPlusIcon } from '@radix-ui/react-icons';

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

  const addFolderHandler = () => {
    const newFolder = {
      id: localStorageObjects?.length || 0,
      name: 'New Folder',
    };

    const newLocalStorageObjects = localStorageObjects
      ? [...localStorageObjects, newFolder]
      : [newFolder];

    saveToLocalStorage('myData', newLocalStorageObjects);
    setLocalStorageObjects(newLocalStorageObjects);
  };

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
              <div className="flex h-full p-2">
                <Button
                  onClick={addFolderHandler}
                  variant="ghost"
                  className="w-full"
                >
                  <CardStackPlusIcon />
                  <span>&nbsp;&nbsp;Add Folder</span>
                </Button>
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
