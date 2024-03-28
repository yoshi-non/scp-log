import {
  forwardRef,
  useEffect,
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
};

const YoutubePlayer = forwardRef<PlayerRef, Props>(
  (props, ref) => {
    const {
      videoId,
      onVideoEnd,
      onVideoPlay,
      onVideoPause,
    } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState<YT.Player>();
    const [isYouTubeReady] = useYouTubeSupportInited()!;

    useEffect(() => {
      if (!wrapperRef) return;
      const tag = document.createElement('div');
      tag.id = `__yt_player`;
      tag.className = `w-full h-full`;
      wrapperRef.current?.appendChild(tag);
    }, []);

    useEffect(() => {
      let mounted = true;
      if (!document.getElementById('__yt_player')) return;
      if (
        player &&
        typeof player.loadVideoById === 'function'
      ) {
        player.loadVideoById(videoId);
        return;
      }

      isYouTubeReady.then(() => {
        if (!mounted) return;
        const newPlayer = new window.YT.Player(
          '__yt_player',
          {
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
              },
            },
          }
        ) as YT.Player;
        if (mounted) {
          setPlayer(newPlayer);
        }
      });

      return () => {
        setPlayer(undefined);
        mounted = false;
      };
    }, [videoId, isYouTubeReady]);

    // useImperativeHandle(ref, () => ({
    //   playVideo: () => {
    //     console.log('playVideo');
    //     console.log(player);
    //     player?.playVideo();
    //   },
    //   pauseVideo: () => {
    //     player?.pauseVideo();
    //   },
    // }));

    if (typeof ref === 'function') {
      ref({
        playVideo: () => {
          if (
            player &&
            typeof player.playVideo === 'function'
          ) {
            player.playVideo();
          }
        },
        pauseVideo: () => {
          if (
            player &&
            typeof player.pauseVideo === 'function'
          ) {
            player.pauseVideo();
          }
        },
      });
    } else if (ref) {
      ref.current = {
        playVideo: () => {
          if (
            player &&
            typeof player.playVideo === 'function'
          ) {
            player.playVideo();
          }
        },
        pauseVideo: () => {
          if (
            player &&
            typeof player.pauseVideo === 'function'
          ) {
            player.pauseVideo();
          }
        },
      };
    }

    return <div className="h-full" ref={wrapperRef} />;
  }
);

YoutubePlayer.displayName = 'YoutubePlayer';

export default YoutubePlayer;
