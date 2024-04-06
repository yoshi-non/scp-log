import { useState } from 'react';

export const usePlaybackPattern = () => {
  const [playbackPattern, setPlaybackPattern] = useState<
    'normal' | 'loop' | 'shuffle'
  >('normal');

  /**
   * 通常再生、ループ、ランダム再生
   * - 通常再生 -> ループ再生 -> ランダム再生 -> 通常再生
   */
  const handlePlaybackPattern = () => {
    if (playbackPattern === 'normal') {
      setPlaybackPattern('loop');
    } else if (playbackPattern === 'loop') {
      setPlaybackPattern('shuffle');
    } else {
      setPlaybackPattern('normal');
    }
  };

  return {
    playbackPattern,
    setPlaybackPattern,
    handlePlaybackPattern,
  };
};
