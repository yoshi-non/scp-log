import { useState, useEffect } from 'react';

type Props = {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

const Timer = ({ isPlaying, setIsPlaying }: Props) => {
  // タイマーが動いているかどうか
  const [isTimerMoving, setIsTimerMoving] =
    useState<boolean>(false);
  // 一時停止しているかどうか
  const [isTimerPaused, setIsTimerPaused] =
    useState<boolean>(false);
  const [initialHourTime, setInitialHourTime] =
    useState<number>(0);
  const [initialMinuteTime, setInitialMinuteTime] =
    useState<number>(0);
  const [initialSecondTime, setInitialSecondTime] =
    useState<number>(0);
  const [inputHourTime, setInputHourTime] =
    useState<number>(0);
  const [inputMinuteTime, setInputMinuteTime] =
    useState<number>(0);
  const [inputSecondTime, setInputSecondTime] =
    useState<number>(0);

  const removeTimerHandler = () => {
    setIsTimerMoving(false);
    setIsTimerPaused(false);
    setIsPlaying(false);
  };

  const restartTimerHandler = () => {
    setIsTimerPaused(false);
  };

  const pauseTimerHandler = () => {
    setIsTimerPaused(true);
  };

  const startTimerHandler = () => {
    setIsTimerMoving(true);
    setInitialHourTime(inputHourTime);
    setInitialMinuteTime(inputMinuteTime);
    setInitialSecondTime(inputSecondTime);
  };

  const resetTimerHandler = () => {
    setInputHourTime(0);
    setInputMinuteTime(0);
    setInputSecondTime(0);
  };

  useEffect(() => {}, [isTimerMoving]);

  return (
    <div className="absolute text-center bottom-5 w-[280px] ml-[10px] overflow-hidden bg-background border-primary border-2 p-5 rounded-xl">
      {isTimerMoving ? (
        <div>
          <p>
            {initialHourTime}:{initialMinuteTime}:
            {initialSecondTime}
          </p>
          <div>
            <p className="text-2xl">
              {inputHourTime}:{inputMinuteTime}:
              {inputSecondTime}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center text-xl">
          <input
            type="number"
            placeholder="hour"
            value={inputHourTime}
            max={59}
            min={0}
            onChange={(e) =>
              setInputHourTime(parseInt(e.target.value))
            }
            className="w-[60px] text-center bg-transparent"
          />
          :
          <input
            type="number"
            placeholder="minute"
            value={inputMinuteTime}
            max={59}
            min={0}
            onChange={(e) =>
              setInputMinuteTime(parseInt(e.target.value))
            }
            className="w-[60px] text-center bg-transparent"
          />
          :
          <input
            type="number"
            placeholder="second"
            value={inputSecondTime}
            max={59}
            min={0}
            onChange={(e) =>
              setInputSecondTime(parseInt(e.target.value))
            }
            className="w-[60px] text-center bg-transparent"
          />
        </div>
      )}
      {isTimerMoving ? (
        <div className="flex justify-around mt-6 gap-4">
          <button
            onClick={removeTimerHandler}
            className="flex-1 bg-secondary rounded-xl p-2"
          >
            削除
          </button>
          {isTimerPaused ? (
            <button
              onClick={restartTimerHandler}
              className="flex-1 bg-blue-600 rounded-xl p-2"
            >
              再開
            </button>
          ) : (
            <button
              onClick={pauseTimerHandler}
              className="flex-1 bg-primary rounded-xl p-2"
            >
              一時停止
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-around mt-6 gap-4">
          <button
            onClick={startTimerHandler}
            className="flex-1 bg-blue-600 rounded-xl p-2"
          >
            開始
          </button>
          <button
            onClick={resetTimerHandler}
            className="flex-1 bg-secondary rounded-xl p-2"
          >
            リセット
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
