import { PlayingType } from '@/types/PlayingType';
import { useEffect } from 'react';

/**
 * k or スペースキーを押すと動画を一時停止または再生する
 * - input要素にフォーカスがある場合は動作しない
 * @param isPlaying
 * @param playVideo
 * @param pauseVideo
 * @returns void
 * @example
 * const { isPlaying, playVideo, pauseVideo } = useYouTubePlayer();
 * useSpacebarToggle(isPlaying, playVideo, pauseVideo);
 */
export const useShortcutToggle = (
  isPlaying: PlayingType,
  playVideo: () => void,
  pauseVideo: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlaying === null || isPlaying === 'BUFFERING')
        return;
      if (
        document.activeElement instanceof HTMLInputElement
      )
        return;

      if (e.key === 'k' || e.key === ' ') {
        e.preventDefault();

        if (isPlaying === 'PLAYING') pauseVideo();
        if (isPlaying === 'PAUSED') playVideo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [isPlaying, playVideo, pauseVideo]);
};
