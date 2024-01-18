import { useEffect, useRef } from 'react';

type Props = {
  videoId: string;
  onVideoEnd: () => void;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

const YoutubePlayer = ({ videoId, onVideoEnd }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrapperRef) return;
    const tag = document.createElement('div');
    tag.id = `player`;
    tag.className = `w-full h-full`;
    wrapperRef.current?.append(tag);
  }, []);
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag =
      document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(
      tag,
      firstScriptTag
    );

    let player: YT.Player;

    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player('player', {
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
      });
    };

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
    return () => {
      player?.destroy();
    };
  }, [videoId, onVideoEnd]);

  return <div id="player_box" ref={wrapperRef} />;
};

export default YoutubePlayer;
