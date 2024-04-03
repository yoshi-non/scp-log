import { PlayingType } from '@/types/PlayingType';
import { useEffect } from 'react';

/**
 * ショートカットキーコマンド
 * - k or スペースキーを押すと一時停止または再生
 * - lを押すと10秒進む
 * - jを押すと10秒戻る
 * - →を押すと5秒進む
 * - ←を押すと5秒戻る
 * ※ input要素にフォーカスがある場合は動作しない
 * @param isPlaying
 * @param playVideo
 * @param pauseVideo
 * @returns void
 * @example
 * const { isPlaying, playVideo, pauseVideo, seekForward, seekBackward } = useYouTubePlayer();
 * useShortcutToggle(isPlaying, playVideo, pauseVideo, seekForward, seekBackward);
 */
export const useShortcutToggle = (
  isPlaying: PlayingType,
  playVideo: () => void,
  pauseVideo: () => void,
  seekTo: (time: number) => void
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
      if (e.key === 'l') {
        e.preventDefault();
        seekTo(10);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekTo(5);
      }
      if (e.key === 'j') {
        e.preventDefault();
        seekTo(-10);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekTo(-5);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [isPlaying, playVideo, pauseVideo, seekTo]);
};
