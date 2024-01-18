import { useEffect, useRef } from 'react';
import { useYouTubeSupportInited } from '../functions/youtube-provider';

type Props = {
  videoId: string;
  onVideoEnd: () => void;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
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
        ): void;
      };
    };
  }
}

const YoutubePlayer = ({ videoId, onVideoEnd }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  let player: YT.Player | undefined;
  const [isYouTubeReady] = useYouTubeSupportInited()!;
  useEffect(() => {
    if (!wrapperRef) return;
    const tag = document.createElement('div');
    tag.id = `__yt_player`;
    tag.className = `w-full h-full`;
    wrapperRef.current?.appendChild(tag);
  }, [videoId]);
  useEffect(() => {
    console.log('videoId', videoId);
    // console.log('player', player);
    // console.log('isYouTubeReady', isYouTubeReady);
    // console.log('wrapperRef', wrapperRef);
    const asyncFunction = async () => {
      try {
        if (player) {
          player.loadVideoById(videoId);
          return;
        }
        console.log('create player');
        await isYouTubeReady;
        console.log('isYouTubeReady');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        player = new window.YT.Player('__yt_player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            fs: 0,
            modestbranding: 1,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        }) as YT.Player;
      } catch (error) {
        console.error('Error create player:', error);
      }
    };

    asyncFunction();
    return () => {
      console.log('destroy');
      player?.destroy();
    };
  }, [wrapperRef]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    event.target.playVideo();
  };

  const onPlayerStateChange = (
    event: YT.OnStateChangeEvent
  ) => {
    if (event.data === 0) {
      console.log('video end');
      onVideoEnd?.();
    }
  };
  return <div ref={wrapperRef} />;
};

export default YoutubePlayer;
