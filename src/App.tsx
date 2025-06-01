
import React, { useState, useCallback } from "react";
import AppHeader from "./components/card-editor/AppHeader";
import AppToolbar from "./components/card-editor/AppToolbar";
import AppSidebar from "./components/card-editor/AppSidebar";
import CardPreviewSection from "./components/card-editor/CardPreviewSection";
import StatusBar from "./components/card-editor/StatusBar";
import Dockbar from '@/components/dockbar';
import { CardData } from '@/types/card';
import { DEFAULT_CARD_DATA } from '@/utils/cardDefaults';

const App: React.FC = () => {
  const [activeCard, setActiveCard] = useState<CardData>(DEFAULT_CARD_DATA);
  const [history, setHistory] = useState<CardData[]>([DEFAULT_CARD_DATA]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [totalCards, setTotalCards] = useState(3);

  const updateCard = useCallback((updates: Partial<CardData>, immediate = false) => {
    const newCard = { ...activeCard, ...updates, updatedAt: new Date().toISOString() };
    setActiveCard(newCard);

    if (immediate) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newCard);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [activeCard, history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      setActiveCard(history[historyIndex - 1]);
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      setActiveCard(history[historyIndex + 1]);
    }
  }, [canRedo, historyIndex, history]);

  const generateRandomCard = useCallback(() => {
    const titles = ["Creative Card", "Modern Design", "Elegant Style", "Dynamic Card", "Innovative UI"];
    const descriptions = [
      "Beautiful and responsive design",
      "Crafted with precision and care", 
      "Designed for maximum impact",
      "Built for the future of web",
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

    updateCard({
      title: randomTitle,
      description: randomDescription,
      bgGradientFrom: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      bgGradientTo: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
    }, true);
  }, [updateCard]);

  const exportCard = useCallback(() => {
    const exportData = {
      card: activeCard,
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `card-editor-pro-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Card exported successfully");
  }, [activeCard]);

  const handleUpdateCard = useCallback((updates: Partial<CardData>) => {
    updateCard(updates, true);
  }, [updateCard]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Custom CSS */}
      <style>{`
        .slider {
          background: #1f2937;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      <AppHeader onExport={exportCard} />
      
      <AppToolbar 
        activeCard={activeCard}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onUpdateCard={handleUpdateCard}
        onGenerateRandom={generateRandomCard}
      />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onGenerateRandom={generateRandomCard}
          onUpdateCard={handleUpdateCard}
        />

        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
          <CardPreviewSection 
            activeCard={activeCard} 
            zoomLevel={zoomLevel} 
          />

          <Dockbar activeCard={activeCard} updateCard={updateCard} />

          <StatusBar 
            currentCardIndex={currentCardIndex}
            totalCards={totalCards}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
