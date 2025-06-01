import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw, 
  Grid3X3,
  Eye,
  EyeOff,
  Move,
  MousePointer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CardData } from '@/types/card';

interface EditorCanvasProps {
  activeCard?: Partial<CardData>;
  children?: React.ReactNode;
  onCardUpdate?: (updates: Partial<CardData>) => void;
  showGrid?: boolean;
  onGridToggle?: () => void;
}

export default function EditorCanvas({
  activeCard,
  children,
  onCardUpdate,
  showGrid = false,
  onGridToggle,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Canvas controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 300));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (!canvasRef.current || !activeCard) return;

    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const cardWidth = activeCard.cardWidth || 300;
    const cardHeight = activeCard.cardHeight || 200;

    const scaleX = (canvasRect.width * 0.8) / cardWidth;
    const scaleY = (canvasRect.height * 0.8) / cardHeight;
    const newZoom = Math.min(scaleX, scaleY) * 100;

    setZoom(Math.max(25, Math.min(300, newZoom)));
    setPanOffset({ x: 0, y: 0 });
  }, [activeCard]);

  // Pan controls
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle click or Ctrl+click
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isPanning, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomReset();
            break;
          case '1':
            e.preventDefault();
            handleFitToScreen();
            break;
          case 'g':
            e.preventDefault();
            onGridToggle?.();
            break;
        }
      }

      if (e.key === ' ') {
        e.preventDefault();
        setShowPreview(!showPreview);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleZoomReset, handleFitToScreen, onGridToggle, showPreview]);

  // Card style generation
  const getCardStyle = useCallback((): React.CSSProperties => {
    if (!activeCard) return {};

    const {
      cardWidth = 300,
      cardHeight = 200,
      bgGradientFrom = '#3b82f6',
      bgGradientTo,
      cardOpacity = 100,
      cardBorderRadius = '12px',
      gradientAngle = 135,
      shadowX = 0,
      shadowY = 10,
      shadowBlur = 20,
      shadowSpread = 0,
      shadowColor = '#000000',
      shadowOpacity = 0.25,
      rotation = 0,
      scaleX = 1,
      scaleY = 1,
      blur = 0,
      brightness = 100,
      contrast = 100,
      saturation = 100,
    } = activeCard;

    const background = bgGradientTo
      ? `linear-gradient(${gradientAngle}deg, ${bgGradientFrom}, ${bgGradientTo})`
      : bgGradientFrom;

    const boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')}`;

    const filter = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    return {
      width: cardWidth,
      height: cardHeight,
      background,
      opacity: cardOpacity / 100,
      borderRadius: cardBorderRadius,
      boxShadow,
      transform: `rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
      filter,
      transition: 'all 0.3s ease',
    };
  }, [activeCard]);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <Button
          onClick={handleZoomOut}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Zoom Out (Ctrl+-)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 px-2">
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={25}
            max={300}
            step={25}
            className="w-20"
          />
          <span className="text-xs font-mono min-w-[40px] text-center">
            {zoom}%
          </span>
        </div>

        <Button
          onClick={handleZoomIn}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Zoom In (Ctrl++)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300" />

        <Button
          onClick={handleZoomReset}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Reset Zoom (Ctrl+0)"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          onClick={handleFitToScreen}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Fit to Screen (Ctrl+1)"
        >
          <Maximize className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300" />

        <Button
          onClick={onGridToggle}
          variant={showGrid ? "secondary" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          title="Toggle Grid (Ctrl+G)"
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => setShowPreview(!showPreview)}
          variant={showPreview ? "secondary" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          title="Toggle Preview (Space)"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Canvas Info */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {isPanning ? (
            <Move className="w-3 h-3" />
          ) : (
            <MousePointer className="w-3 h-3" />
          )}
          <span>
            {activeCard?.cardWidth || 300} × {activeCard?.cardHeight || 200}px
          </span>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={`relative w-full h-full overflow-hidden ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: showGrid
            ? `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `
            : undefined,
          backgroundSize: showGrid ? '20px 20px' : undefined,
          backgroundPosition: showGrid ? `${panOffset.x}px ${panOffset.y}px` : undefined,
        }}
      >
        {/* Canvas Content */}
        <div
          className="flex items-center justify-center w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
            transformOrigin: 'center',
          }}
        >
          {/* Card Preview */}
          <motion.div
            className="relative bg-white shadow-xl flex items-center justify-center"
            style={getCardStyle()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Card Content */}
            <div className="p-6 text-center">
              <h3 
                className="font-semibold mb-2"
                style={{
                  fontFamily: activeCard?.titleFont || 'Inter',
                  fontWeight: activeCard?.titleWeight || '600',
                  fontSize: `${activeCard?.titleSize || 18}px`,
                  textAlign: (activeCard?.titleAlign as any) || 'left',
                  color: '#1f2937',
                }}
              >
                Sample Card Title
              </h3>
              <p 
                className="text-gray-600"
                style={{
                  fontFamily: activeCard?.descriptionFont || 'Inter',
                  fontWeight: activeCard?.descriptionWeight || '400',
                  fontSize: `${activeCard?.descriptionSize || 14}px`,
                  textAlign: (activeCard?.descriptionAlign as any) || 'left',
                }}
              >
                This is a sample description for your card design. It shows how your text styling will look.
              </p>
            </div>

            {/* Card Border Indicator */}
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-lg pointer-events-none" />

            {/* Resize Handles */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full shadow-md" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full shadow-md" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full shadow-md" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full shadow-md" />
          </motion.div>
        </div>

        {/* Additional Canvas Content */}
        {children}
      </div>

      {/* Preview Mode Overlay */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white shadow-2xl mb-4"
                style={getCardStyle()}
              >
                <div className="p-6 text-center">
                  <h3 
                    className="font-semibold mb-2"
                    style={{
                      fontFamily: activeCard?.titleFont || 'Inter',
                      fontWeight: activeCard?.titleWeight || '600',
                      fontSize: `${activeCard?.titleSize || 18}px`,
                      textAlign: (activeCard?.titleAlign as any) || 'left',
                      color: '#1f2937',
                    }}
                  >
                    Sample Card Title
                  </h3>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontFamily: activeCard?.descriptionFont || 'Inter',
                      fontWeight: activeCard?.descriptionWeight || '400',
                      fontSize: `${activeCard?.descriptionSize || 14}px`,
                      textAlign: (activeCard?.descriptionAlign as any) || 'left',
                    }}
                  >
                    This is a sample description for your card design.
                  </p>
                </div>
              </motion.div>
              <p className="text-white/60 text-sm">
                Press <kbd className="bg-white/20 px-2 py-1 rounded">Space</kbd> to exit preview
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pan Instruction */}
      {!isPanning && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded px-2 py-1">
          Hold Ctrl+Click or Middle Click to pan
        </div>
      )}
    </div>
  );
}
