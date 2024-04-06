import { useState } from 'react';

export const usePlaybackPattern = () => {
  const [playbackPattern, setPlaybackPattern] = useState<
    'normal' | 'shuffle'
  >('normal');

  /**
   * 通常再生、ランダム再生
   * - 通常再生 -> ランダム再生 -> 通常再生
   */
  const handlePlaybackPattern = () => {
    if (playbackPattern === 'normal') {
      setPlaybackPattern('shuffle');
    } else {
      setPlaybackPattern('normal');
    }
  };

  return {
    playbackPattern,
    handlePlaybackPattern,
  };
};
