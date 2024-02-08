'use client';

import { useEffect, useState } from 'react';
import { LocalStorageObjects } from '@/types/localstrageObjects';
import { getFromLocalStorage } from '@/utils/storage';
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
import AddMovie from '@/components/features/AddMovie';
import PlayList from '@/components/features/PlayList';
import { localStorageKey } from '@/constants/localStorageKey';
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import Loader from '@/components/features/Loader';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [localStorageObjects, setLocalStorageObjects] =
    useState<LocalStorageObjects>([]);
  const [selectedFolderIndex, setSelectedFolderIndex] =
    useState<number>(0);

  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<
    YouTubeSearchResult[]
  >([]);

  useEffect(() => {
    const storedData = getFromLocalStorage(localStorageKey);
    if (storedData) {
      setLocalStorageObjects(storedData);
      setLoading(false);
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
          <TabsTrigger value="download">
            Download
          </TabsTrigger>
        </TabsList>
        <TabsContent value="playlist">
          {loading ? (
            <div className="w-full min-h-[620px] h-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
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
                  selectedFolderIndex={selectedFolderIndex}
                  setSelectedFolderIndex={
                    setSelectedFolderIndex
                  }
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={80}>
                <PlayList
                  localStorageObjects={localStorageObjects}
                  setLocalStorageObjects={
                    setLocalStorageObjects
                  }
                  selectedFolderIndex={selectedFolderIndex}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </TabsContent>
        <TabsContent value="addMovie">
          <AddMovie
            tab="addMovie"
            localStorageObjects={localStorageObjects}
            setLocalStorageObjects={setLocalStorageObjects}
            keyword={keyword}
            setKeyword={setKeyword}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
          />
        </TabsContent>
        <TabsContent value="download">
          <AddMovie
            tab="download"
            localStorageObjects={localStorageObjects}
            setLocalStorageObjects={setLocalStorageObjects}
            keyword={keyword}
            setKeyword={setKeyword}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
