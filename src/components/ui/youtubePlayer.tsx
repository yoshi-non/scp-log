import { useEffect, useRef } from 'react';
import { useYouTubeSupportInited } from '../functions/youtube-provider';

type Props = {
  videoId: string;
  onVideoEnd: () => void;
};

const YoutubePlayer = ({ videoId, onVideoEnd }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  let player: YT.Player | undefined = undefined;
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
    if (player) {
      player.loadVideoById(videoId);
      return;
    }

    isYouTubeReady.then(() => {
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
          onStateChange: (e) => {
            if (e.data === 0) {
              onVideoEnd();
            }
          },
        },
      }) as YT.Player;
    });

    return () => {
      player?.destroy();
    };
  }, [videoId, player]);

  return <div ref={wrapperRef} />;
};

export default YoutubePlayer;
