import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useYouTubeSupportInited } from '../functions/youtube-provider';

type PlayerRef = {
  playVideo: () => void;
  pauseVideo: () => void;
};

type Props = {
  videoId: string;
  onVideoEnd: () => void;
  onVideoPlay: () => void;
  onVideoPause: () => void;
  onVideoBuffering: () => void;
};

const YoutubePlayer = forwardRef<PlayerRef, Props>(
  (props, ref) => {
    const {
      videoId,
      onVideoEnd,
      onVideoPlay,
      onVideoPause,
      onVideoBuffering,
    } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    let player: YT.Player | undefined;
    const [isYouTubeReady] = useYouTubeSupportInited()!;

    useEffect(() => {
      if (!wrapperRef) return;
      const tag = document.createElement('div');
      tag.id = `__yt_player`;
      tag.className = `w-full h-full`;
      wrapperRef.current?.appendChild(tag);
    }, []);

    useEffect(() => {
      if (!document.getElementById('__yt_player')) return;
      if (
        player &&
        typeof player.loadVideoById === 'function'
      ) {
        player.loadVideoById(videoId);
        return;
      }

      isYouTubeReady.then(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        player = new window.YT.Player('__yt_player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 1,
            fs: 0,
            modestbranding: 1,
          },
          events: {
            onStateChange: (e) => {
              if (e.data === 0) {
                onVideoEnd();
              }
              if (e.data === 1) {
                onVideoPlay();
              }
              if (e.data === 2) {
                onVideoPause();
              }
              if (e.data === 3) {
                onVideoBuffering();
              }
            },
          },
        }) as YT.Player;
      });

      return () => {
        player?.destroy();
      };
    }, [videoId, isYouTubeReady]);

    useImperativeHandle(ref, () => ({
      playVideo: () => {
        const iframe =
          wrapperRef.current?.querySelector('iframe');
        if (iframe) {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          );
        }
      },
      pauseVideo: () => {
        const iframe =
          wrapperRef.current?.querySelector('iframe');
        if (iframe) {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          );
        }
      },
    }));

    return <div className="h-full" ref={wrapperRef} />;
  }
);

YoutubePlayer.displayName = 'YoutubePlayer';

export default YoutubePlayer;
