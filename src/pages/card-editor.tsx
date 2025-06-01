
import { useState, useCallback } from "react";
import { CardData } from "../types/card";
import { createDefaultCard } from "../utils/cardDefaults";
import { useCardHistory } from "../hooks/useCardHistory";
import { useCardOperations } from "../hooks/useCardOperations";
import CardEditorHeader from "../components/card-editor/CardEditorHeader";
import CardEditorToolbar from "../components/card-editor/CardEditorToolbar";
import CardEditorSidebar from "../components/card-editor/CardEditorSidebar";
import CardPreview from "../components/card-editor/CardPreview";
import CardEditorBottomBar from "../components/card-editor/CardEditorBottomBar";
import Dockbar from "../components/dockbar";

export default function CardEditor() {
  const [activeCard, setActiveCard] = useState<CardData>(createDefaultCard());
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState("style");
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState('1.0');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(3);

  const { canUndo, canRedo, addToHistory, undo, redo } = useCardHistory(activeCard);
  const { generateRandomCard, exportCard, handleShare } = useCardOperations();

  const updateCard = useCallback(
    (updates: Partial<CardData>) => {
      const newCard = { ...activeCard, ...updates };
      setActiveCard(newCard);
      addToHistory(newCard);
    },
    [activeCard, addToHistory]
  );

  const handleUndo = useCallback(() => {
    const previousCard = undo();
    if (previousCard) {
      setActiveCard(previousCard);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextCard = redo();
    if (nextCard) {
      setActiveCard(nextCard);
    }
  }, [redo]);

  const handleGenerateRandom = useCallback(() => {
    const randomUpdates = generateRandomCard();
    updateCard(randomUpdates);
  }, [generateRandomCard, updateCard]);

  const handleOpenPanel = useCallback((panel: string) => {
    setActivePanelTab(panel);
    setIsPanelOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    exportCard(activeCard);
  }, [exportCard, activeCard]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Dockbar
        activeCard={activeCard}
        updateCard={updateCard}
      />

      <CardEditorHeader 
        onSave={handleExport}
        onShare={handleShare}
        onExport={handleExport}
      />
      
      <CardEditorToolbar
        activeCard={activeCard}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenPanel={handleOpenPanel}
        onUpdateCard={updateCard}
        onGenerateRandom={handleGenerateRandom}
      />

      <div className="flex flex-1 overflow-hidden">
        <CardEditorSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewCard={handleGenerateRandom}
          onUpdateCard={updateCard}
        />

        <main className="flex-1 bg-gray-800 flex flex-col items-center justify-center p-8 relative">
          <CardPreview
            activeCard={activeCard}
            zoomLevel={zoomLevel}
          />

          <CardEditorBottomBar
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoomLevel={zoomLevel}
            onPrevSlide={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            onNextSlide={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
            onZoomChange={setZoomLevel}
          />
        </main>
      </div>
    </div>
  );
}
