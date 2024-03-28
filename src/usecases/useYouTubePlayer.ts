import { useRef } from 'react';

const useYouTubePlayer = () => {
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

  return { playVideo, pauseVideo, playerRef };
};

export default useYouTubePlayer;
