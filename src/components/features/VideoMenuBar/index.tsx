import { Button } from '@/components/ui/button';
import {
  PauseIcon,
  PlayIcon,
  TrackNextIcon,
  TrackPreviousIcon,
} from '@radix-ui/react-icons';
import { PlayingType } from '../PlayList';

type Props = {
  isPlaying: PlayingType;
  playVideo: () => void;
  pauseVideo: () => void;
  prevVideo: () => void;
  nextVideo: () => void;
};

const VideoMenuBar = ({
  isPlaying,
  playVideo,
  pauseVideo,
  prevVideo,
  nextVideo,
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
      <div className="flex justify-around items-center">
        <Button
          className="rounded-full p-2"
          onClick={() => prevVideo()}
        >
          <TrackPreviousIcon className="w-6 h-6" />
        </Button>
        <Button
          disabled={
            isPlaying === 'BUFFERING' || isPlaying === null
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

export default VideoMenuBar;
