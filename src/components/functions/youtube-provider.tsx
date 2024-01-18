import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const YouTubeSupportContext = createContext<
  [Promise<void>]
>([Promise.resolve()]);

const YouTubeContextProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  useEffect(() => {
    if (document.getElementById('__yt_script')) return;
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
      console.log('remove');
    };
  }, []);

  const [promise] = useState(
    new Promise<void>((resolve) => {
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
    })
  );

  return (
    <YouTubeSupportContext.Provider value={[promise]}>
      {props.children}
    </YouTubeSupportContext.Provider>
  );
};

export function useYouTubeSupportInited():
  | Promise<void>[]
  | undefined {
  return useContext(YouTubeSupportContext);
}

export { YouTubeContextProvider, YouTubeSupportContext };
