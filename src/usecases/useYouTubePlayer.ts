import { useRef } from 'react';

export const useYouTubePlayer = () => {
  const playerRef = useRef<YT.Player | null>(null);

  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  const seekTo = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  return {
    playVideo,
    pauseVideo,
    seekTo,
    playerRef,
  };
};
