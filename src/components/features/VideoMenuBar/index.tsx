import { Button } from '@/components/ui/button';
import {
  PauseIcon,
  PlayIcon,
  TrackNextIcon,
  TrackPreviousIcon,
} from '@radix-ui/react-icons';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { PlayingType } from '@/types/PlayingType';
import {
  Repeat1Icon,
  RepeatIcon,
  ShuffleIcon,
} from 'lucide-react';

type Props = {
  isPlaying: PlayingType;
  playVideo: () => void;
  pauseVideo: () => void;
  prevVideo: () => void;
  nextVideo: () => void;
  playbackPattern: 'normal' | 'loop' | 'shuffle';
  handlePlaybackPattern: () => void;
};

export const VideoMenuBar = ({
  isPlaying,
  playVideo,
  pauseVideo,
  prevVideo,
  nextVideo,
  playbackPattern,
  handlePlaybackPattern,
}: Props) => {
  const handlePlayClick = () => {
    if (isPlaying === 'PLAYING') {
      pauseVideo();
    }
    if (isPlaying === 'PAUSED') {
      playVideo();
    }
  };
  return (
    <div className="w-[200px] mx-auto mt-3">
      <div className="flex justify-between items-center">
        {/* 通常再生、ループ、ランダム再生ボタン */}
        <Button
          className="rounded-full p-2"
          onClick={() => handlePlaybackPattern()}
        >
          {playbackPattern === 'normal' && (
            <RepeatIcon className="w-6 h-6" />
          )}
          {playbackPattern === 'loop' && (
            <Repeat1Icon className="w-6 h-6" />
          )}
          {playbackPattern === 'shuffle' && (
            <ShuffleIcon className="w-6 h-6" />
          )}
        </Button>
        <Button
          className="rounded-full p-2"
          onClick={() => prevVideo()}
        >
          <TrackPreviousIcon className="w-6 h-6" />
        </Button>
        <TooltipWrapper
          text={
            isPlaying === 'PLAYING' ||
            isPlaying === 'BUFFERING'
              ? '一時停止（k）'
              : '再生（k）'
          }
        >
          <Button
            disabled={
              isPlaying === 'BUFFERING' ||
              isPlaying === null
            }
            className="rounded-full p-2"
            onClick={handlePlayClick}
          >
            {isPlaying === 'PLAYING' ||
            isPlaying === 'BUFFERING' ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </Button>
        </TooltipWrapper>
        <Button
          className="rounded-full p-2"
          onClick={() => nextVideo()}
        >
          <TrackNextIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
