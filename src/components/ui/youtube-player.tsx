import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useYouTubeSupportInited } from '../functions/youtube-provider';

type PlayerRef = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (
    seconds: number,
    allowSeekAhead: boolean
  ) => void;
};

type Props = {
  videoId: string;
  onVideoEnd: () => void;
  onVideoPlay: () => void;
  onVideoPause: () => void;
  onVideoBuffering: () => void;
};

const YoutubePlayer = forwardRef<PlayerRef, Props>(
  (props, ref) => {
    const {
      videoId,
      onVideoEnd,
      onVideoPlay,
      onVideoPause,
      onVideoBuffering,
    } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    let player: YT.Player | undefined;
    const isYouTubeReady = useYouTubeSupportInited()!;
    const [tmpCurrentTime, setTmpCurrentTime] =
      useState<number>(0);
    const [currentTime, setCurrentTime] =
      useState<number>(0);
    const [isPlaying, setIsPlaying] =
      useState<boolean>(false);

    useEffect(() => {
      if (!wrapperRef) return;
      const tag = document.createElement('div');
      tag.id = `__yt_player`;
      tag.className = `w-full h-full`;
      wrapperRef.current?.appendChild(tag);
    }, []);

    const playerSetup = (videoId: string) => {
      isYouTubeReady;
      setTmpCurrentTime(0);
      player = new window.YT.Player('__yt_player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5&hl=ja
          autoplay: 1,
          fs: 0,
          modestbranding: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onStateChange: (e) => {
            if (e.data === 0) {
              setTmpCurrentTime(0);
              onVideoEnd();
            }
            if (e.data === 1) {
              onVideoPlay();
              const newCurrentTime =
                player?.getCurrentTime() || 0;
              setIsPlaying(true);
              setTmpCurrentTime(newCurrentTime);
            }
            if (e.data === 2) {
              onVideoPause();
              const newCurrentTime =
                player?.getCurrentTime() || 0;
              setIsPlaying(false);
              setTmpCurrentTime(newCurrentTime);
            }
            if (e.data === 3) {
              onVideoBuffering();
              const newCurrentTime =
                player?.getCurrentTime() || 0;
              setTmpCurrentTime(newCurrentTime);
            }
          },
        },
      }) as YT.Player;
    };

    useEffect(() => {
      const intervalId = setInterval(() => {
        // プレーヤーが準備完了した後に、定期的に再生時間を取得する処理を開始します
        if (tmpCurrentTime === 0) {
          // 0秒の場合は何もしない
          setCurrentTime(0);
          return;
        }
        setCurrentTime(tmpCurrentTime + 0.1);
      }, 100);
      return () => clearInterval(intervalId);
    }, [
      player,
      tmpCurrentTime,
      setTmpCurrentTime,
      isPlaying,
    ]);

    useEffect(() => {
      if (!document.getElementById('__yt_player')) return;
      if (
        player &&
        typeof player.loadVideoById === 'function'
      ) {
        player.loadVideoById(videoId);
        return;
      }
      playerSetup(videoId);
      return () => {
        player?.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    //APIのコマンドを送信する関数
    const ag2ytControl = (action: string, arg = '[]') => {
      const iframe =
        wrapperRef.current?.querySelector('iframe');
      iframe?.contentWindow?.postMessage(
        '{"event":"command", "func":"' +
          action +
          '", "args":' +
          arg +
          '}',
        '*'
      );
    };

    useImperativeHandle(ref, () => ({
      playVideo: () => {
        ag2ytControl('playVideo');
      },
      pauseVideo: () => {
        ag2ytControl('pauseVideo');
      },
      seekTo: (seconds, allowSeekAhead) => {
        if (!isPlaying) {
          // 一旦ミュートにして再生してからシークする
          ag2ytControl('mute');
          ag2ytControl('playVideo');
          ag2ytControl(
            'seekTo',
            `[${currentTime + seconds}, ${allowSeekAhead}]`
          );
          ag2ytControl('pauseVideo');
          ag2ytControl('unMute');
        } else {
          ag2ytControl(
            'seekTo',
            `[${currentTime + seconds}, ${allowSeekAhead}]`
          );
        }
      },
    }));

    return <div className="h-full" ref={wrapperRef} />;
  }
);

YoutubePlayer.displayName = 'YoutubePlayer';

export default YoutubePlayer;
