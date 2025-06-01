
import { useState, useCallback } from 'react';
import { CardData } from '@/types/card';

interface UseCardHistoryReturn {
  currentCard: CardData;
  history: CardData[];
  historyIndex: number;
  updateCard: (updates: Partial<CardData>) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  addToHistory: () => void;
  clearHistory: () => void;
}

export const useCardHistory = (initialCard: CardData): UseCardHistoryReturn => {
  const [currentCard, setCurrentCard] = useState<CardData>(initialCard);
  const [history, setHistory] = useState<CardData[]>([initialCard]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const maxHistorySize = 50;

  const updateCard = useCallback((updates: Partial<CardData>) => {
    setCurrentCard(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentCard);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  }, [currentCard, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentCard(history[newIndex]);
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentCard(history[newIndex]);
    }
  }, [canRedo, historyIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([currentCard]);
    setHistoryIndex(0);
  }, [currentCard]);

  return {
    currentCard,
    history,
    historyIndex,
    updateCard,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory,
    clearHistory
  };
};
