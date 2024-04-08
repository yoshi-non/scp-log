'use client';

import { useState } from 'react';
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
import { YouTubeSearchResult } from '@/types/youtubeSearchResult';
import Loader from '@/components/features/Loader';
import { YouTubeContextProvider } from '@/components/functions/youtube-provider';
import { useLSPlaylists } from '@/usecases/useLSPlaylists';

export default function Home() {
  const { loading, lsPlaylists, updateLSPlaylists } =
    useLSPlaylists();

  const [selectedFolderIndex, setSelectedFolderIndex] =
    useState<number>(0);

  // 検索キーワードの一時保存
  const [tmpKeyword, setTmpKeyword] = useState<string>('');

  const [searchResult, setSearchResult] = useState<
    YouTubeSearchResult[]
  >([]);
  const [tabName, setTabName] =
    useState<string>('playlist');

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
            {loading !== 'false' ? (
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
                    lsPlaylists={lsPlaylists}
                    updateLSPlaylists={updateLSPlaylists}
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
                    lsPlaylists={lsPlaylists}
                    updateLSPlaylists={updateLSPlaylists}
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
              lsPlaylists={lsPlaylists}
              updateLSPlaylists={updateLSPlaylists}
              tmpKeyword={tmpKeyword}
              setTmpKeyword={setTmpKeyword}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          </TabsContent>
          <TabsContent value="download">
            <AddMovie
              tab={tabName}
              lsPlaylists={lsPlaylists}
              updateLSPlaylists={updateLSPlaylists}
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
