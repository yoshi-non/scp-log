'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
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

const YouTubeSupportContext = createContext<boolean>(false);

const YouTubeContextProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    const initializeYouTubeAPI = () => {
      if (
        typeof window.YT !== 'undefined' &&
        typeof window.YT.Player !== 'undefined'
      ) {
        setIsReady(true);
      } else {
        const tag = document.createElement('script');
        tag.id = '__yt_script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag =
          document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(
          tag,
          firstScriptTag
        );

        window.onYouTubeIframeAPIReady = () => {
          setIsReady(true);
        };
      }
    };

    initializeYouTubeAPI();

    return () => {
      setIsReady(false);
    };
  }, []);

  return (
    <YouTubeSupportContext.Provider value={isReady}>
      {props.children}
    </YouTubeSupportContext.Provider>
  );
};

export const useYouTubeSupportInited = (): boolean => {
  return useContext(YouTubeSupportContext);
};

export { YouTubeContextProvider, YouTubeSupportContext };
