'use client';

import {
  createContext,
  useContext,
  useEffect,
} from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: {
        new (
          id: string,
          options: {
            videoId: string;
            playerVars?: {
              [key: string]: string | number | boolean;
            };
            events: {
              onReady?: () => void;
              onStateChange?: (event: {
                data: number;
              }) => void;
            };
          }
        ): YT.Player;
      };
    };
  }
}

const YouTubeSupportContext = createContext<
  [Promise<void>] | undefined
>(undefined);

const YouTubeContextProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  useEffect(() => {
    if (document.getElementById('__yt_script')) {
      console.log('already loaded');
      return;
    }
    const tag = document.createElement('script');
    tag.id = '__yt_script';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag =
      document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(
      tag,
      firstScriptTag
    );

    return () => {
      document.getElementById('__yt_script')?.remove();
    };
  }, []);

  const promise = new Promise<void>((resolve) => {
    if (typeof window !== 'undefined') {
      window.onYouTubeIframeAPIReady = resolve;
    } else {
      resolve();
    }
  });

  return (
    <YouTubeSupportContext.Provider value={[promise]}>
      {props.children}
    </YouTubeSupportContext.Provider>
  );
};

export const useYouTubeSupportInited = ():
  | Promise<void>[]
  | undefined => {
  return useContext(YouTubeSupportContext);
};

export { YouTubeContextProvider, YouTubeSupportContext };
