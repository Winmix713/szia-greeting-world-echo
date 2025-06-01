import { useCallback, useState } from "react";
import { CardData } from "../types/card";

export const useCardHistory = (initialCard: CardData) => {
  const [history, setHistory] = useState<CardData[]>([initialCard]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addToHistory = useCallback((card: CardData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(card);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      return history[historyIndex - 1];
    }
    return null;
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      return history[historyIndex + 1];
    }
    return null;
  }, [canRedo, historyIndex, history]);

  return {
    canUndo,
    canRedo,
    addToHistory,
    undo,
    redo,
  };
};
