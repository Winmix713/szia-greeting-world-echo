
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CardEditorHeader from '@/components/card-editor/CardEditorHeader';
import CardEditorSidebar from '@/components/card-editor/CardEditorSidebar';
import CardEditorToolbar from '@/components/card-editor/CardEditorToolbar';
import CardPreview from '@/components/card-editor/CardPreview';
import CardEditorBottomBar from '@/components/card-editor/CardEditorBottomBar';
import Dockbar from '@/components/dockbar';
import { useCardHistory } from '@/hooks/useCardHistory';
import { useCardOperations } from '@/hooks/useCardOperations';
import { CardData } from '@/types/card';
import { DEFAULT_CARD_DATA } from '@/utils/cardDefaults';

const CardEditorPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState('1.0');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides] = useState(3);

  const {
    currentCard,
    history,
    historyIndex,
    updateCard,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory
  } = useCardHistory(DEFAULT_CARD_DATA);

  const {
    exportCard,
    generateRandomCard,
    applyPreset
  } = useCardOperations();

  const handleUpdateCard = useCallback((updates: Partial<CardData>, immediate = false) => {
    updateCard(updates);
    if (immediate) {
      addToHistory();
    }
  }, [updateCard, addToHistory]);

  const handleSave = useCallback(() => {
    console.log('Saving card...', currentCard);
    // Implement save functionality
  }, [currentCard]);

  const handleShare = useCallback(() => {
    console.log('Sharing card...', currentCard);
    // Implement share functionality
  }, [currentCard]);

  const handleExport = useCallback(() => {
    exportCard(currentCard);
  }, [exportCard, currentCard]);

  const handleNewCard = useCallback(() => {
    handleUpdateCard(DEFAULT_CARD_DATA, true);
  }, [handleUpdateCard]);

  const handleGenerateRandom = useCallback(() => {
    const randomCard = generateRandomCard();
    handleUpdateCard(randomCard, true);
  }, [generateRandomCard, handleUpdateCard]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const handleNextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides]);

  const handleZoomChange = useCallback((zoom: string) => {
    const numZoom = parseFloat(zoom);
    if (numZoom >= 0.25 && numZoom <= 3.0) {
      setZoomLevel(zoom);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Header */}
      <CardEditorHeader
        onSave={handleSave}
        onShare={handleShare}
        onExport={handleExport}
      />

      {/* Toolbar */}
      <CardEditorToolbar
        activeCard={currentCard}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onOpenPanel={(panel) => console.log('Opening panel:', panel)}
        onUpdateCard={handleUpdateCard}
        onGenerateRandom={handleGenerateRandom}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CardEditorSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewCard={handleNewCard}
          onUpdateCard={handleUpdateCard}
        />

        {/* Canvas Area */}
        <main className="flex-1 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background">
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />
          </div>

          {/* Preview Container */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Ambient Glow */}
              <div 
                className="absolute inset-0 blur-3xl opacity-20 -z-10"
                style={{
                  background: `radial-gradient(circle, ${currentCard.bgGradientFrom}40, ${currentCard.bgGradientTo || currentCard.bgGradientFrom}20, transparent 70%)`,
                  transform: 'scale(1.5)'
                }}
              />
              
              {/* Card Preview */}
              <CardPreview 
                activeCard={currentCard} 
                zoomLevel={zoomLevel} 
              />
            </motion.div>

            {/* Preview Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Live Preview</span>
              </div>
            </motion.div>
          </div>

          {/* Dockbar */}
          <Dockbar 
            activeCard={currentCard} 
            updateCard={handleUpdateCard} 
          />

          {/* Bottom Bar */}
          <CardEditorBottomBar
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            zoomLevel={zoomLevel}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
            onZoomChange={handleZoomChange}
          />
        </main>
      </div>
    </div>
  );
};

export default CardEditorPage;
