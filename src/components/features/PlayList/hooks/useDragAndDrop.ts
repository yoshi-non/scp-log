import { LocalStorageObjects } from '@/types/localstrageObjects';
import {
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { dndExchangeMovie } from '../logics/dndExchangeMovie';

export const useDragAndDrop = (
  selectedFolderIndex: number,
  lsPlaylists: LocalStorageObjects,
  updateLSPlaylists: (
    newPlaylist: LocalStorageObjects
  ) => void,
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>,
  selectedMovieIndex: number,
  setSelectedMovieIndex: React.Dispatch<
    React.SetStateAction<number>
  >
) => {
  const [items, setItems] = useState<{
    [key: string]: string[];
  }>({ container1: [] });

  useEffect(() => {
    setItems({
      container1: lsPlaylists[
        selectedFolderIndex
      ]?.movies.map((_, index) => String(index)),
    });
  }, [selectedFolderIndex, lsPlaylists]);

  /**
   * 各コンテナ取得関数
   */
  const findContainer = (id: UniqueIdentifier) => {
    const containerKey = Object.keys(items).find((key) =>
      items[key].includes(id.toString())
    );
    return containerKey || id;
  };

  /**
   * ドラッグ可能なアイテムがドロップ可能なコンテナの上に移動時に発火する関数
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id;
    if (!overId) return;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(
        overId.toString()
      );
      const newIndex =
        overId in prev
          ? overItems.length + 1
          : overIndex >= 0
          ? overIndex +
            (overIndex === overItems.length - 1 ? 1 : 0)
          : overItems.length + 1;
      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter(
          (item) => item !== id
        ),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...overItems.slice(
            newIndex,
            prev[overContainer].length
          ),
        ],
      };
    });
  };

  /**
   * ドラッグ終了時に発火する関数
   * - ドラッグしたものとドロップしたもののインデックスを交換する
   * - ドラッグしたものとドロップしたものが同じ場合は動画を再生する
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const id = active.id.toString();
    const overId = over?.id;
    if (!overId) return;
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }
    const activeIndex = items[activeContainer].indexOf(id);
    const overIndex = items[overContainer].indexOf(
      overId.toString()
    );
    if (activeIndex !== overIndex) {
      const newObjects = dndExchangeMovie(
        activeIndex,
        overIndex,
        selectedFolderIndex,
        lsPlaylists
      );
      updateLSPlaylists(newObjects);
      if (activeIndex === selectedMovieIndex) {
        setSelectedMovieIndex(overIndex);
      }
      if (overIndex === selectedMovieIndex) {
        setSelectedMovieIndex(activeIndex);
      }
      if (
        overIndex !== selectedMovieIndex &&
        activeIndex !== selectedMovieIndex &&
        overIndex < selectedMovieIndex &&
        activeIndex > selectedMovieIndex
      ) {
        setSelectedMovieIndex(selectedMovieIndex + 1);
      }
      if (
        activeIndex !== selectedMovieIndex &&
        overIndex !== selectedMovieIndex &&
        activeIndex < selectedMovieIndex &&
        overIndex > selectedMovieIndex
      ) {
        setSelectedMovieIndex(selectedMovieIndex - 1);
      }
    } else {
      setSelectedMovieIndex(activeIndex);
      setIsReady(true);
    }
  };

  return {
    items,
    setItems,
    handleDragOver,
    handleDragEnd,
  };
};
