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
import { YouTubeContextProvider } from '@/components/functions/youtube-provider';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [localStorageObjects, setLocalStorageObjects] =
    useState<LocalStorageObjects>([]);
  const [selectedFolderIndex, setSelectedFolderIndex] =
    useState<number>(0);

  // 検索キーワードの一時保存
  const [tmpKeyword, setTmpKeyword] = useState<string>('');

  const [searchResult, setSearchResult] = useState<
    YouTubeSearchResult[]
  >([]);
  const [tabName, setTabName] =
    useState<string>('playlist');

  useEffect(() => {
    const getLocalStorageData = () => {
      const storedData =
        getFromLocalStorage(localStorageKey);
      if (storedData) {
        setLocalStorageObjects(storedData);
      }
      setLoading(false);
    };
    getLocalStorageData();
  }, []);

  return (
    <main>
      <YouTubeContextProvider>
        <Tabs defaultValue="playlist" className="w-full">
          <TabsList className="mx-5">
            <TabsTrigger
              value="playlist"
              onClick={() => setTabName('playlist')}
            >
              Playlist
            </TabsTrigger>
            <TabsTrigger
              value="addMovie"
              onClick={() => setTabName('addMovie')}
            >
              Add Movie
            </TabsTrigger>
            <TabsTrigger
              value="download"
              onClick={() => setTabName('download')}
            >
              Download
            </TabsTrigger>
          </TabsList>
          <TabsContent value="playlist">
            {loading ? (
              <div className="w-full min-h-[620px] h-full flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                  defaultSize={20}
                  maxSize={50}
                >
                  <PlayListSideBar
                    localStorageObjects={
                      localStorageObjects
                    }
                    setLocalStorageObjects={
                      setLocalStorageObjects
                    }
                    selectedFolderIndex={
                      selectedFolderIndex
                    }
                    setSelectedFolderIndex={
                      setSelectedFolderIndex
                    }
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={80}>
                  <PlayList
                    localStorageObjects={
                      localStorageObjects
                    }
                    setLocalStorageObjects={
                      setLocalStorageObjects
                    }
                    selectedFolderIndex={
                      selectedFolderIndex
                    }
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </TabsContent>
          <TabsContent value="addMovie">
            <AddMovie
              tab={tabName}
              localStorageObjects={localStorageObjects}
              setLocalStorageObjects={
                setLocalStorageObjects
              }
              tmpKeyword={tmpKeyword}
              setTmpKeyword={setTmpKeyword}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          </TabsContent>
          <TabsContent value="download">
            <AddMovie
              tab={tabName}
              localStorageObjects={localStorageObjects}
              setLocalStorageObjects={
                setLocalStorageObjects
              }
              tmpKeyword={tmpKeyword}
              setTmpKeyword={setTmpKeyword}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          </TabsContent>
        </Tabs>
      </YouTubeContextProvider>
    </main>
  );
}
