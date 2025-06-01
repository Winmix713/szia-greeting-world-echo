import React, { useState, useCallback, useMemo, useEffect, ChangeEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Layers,
  Type,
  Settings,
  Sparkles,
  Circle,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  X,
  Box,
  LucideIcon,
  ArrowLeft,
  Save,
  Share,
  Play,
  Download,
  MoreVertical,
  Undo,
  Redo,
  Layout,
  ChevronLeft,
  ChevronRight,
  ZoomOut,
  ZoomIn,
  Maximize,
  Shuffle,
  Eye,
  Search,
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered
} from "lucide-react";
import Dockbar from '@/components/dockbar';
import { CardData } from '@/types/card';
import { DEFAULT_CARD_DATA } from '@/utils/cardDefaults';

// --- UI Components ---
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
  }
>(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- Debounce Function ---
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Parameters<F>) => void;
}

// --- Main App Component ---
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

  const cardStyle = useMemo(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 82, g: 48, b: 145 };
    };

    const bgFromRgb = hexToRgb(activeCard.bgGradientFrom || "#523091");
    const bgToRgb = hexToRgb(activeCard.bgGradientTo || "#1a0b33");
    const shadowRgb = hexToRgb(activeCard.shadowColor || "#7c3aed");

    const shadow = `${activeCard.shadowSettings?.x || "0"}px ${
      activeCard.shadowSettings?.y || "30"
    }px ${activeCard.shadowSettings?.blur || "50"}px ${activeCard.shadowSettings?.spread || "0"}px rgba(${
      shadowRgb.r
    }, ${shadowRgb.g}, ${shadowRgb.b}, ${activeCard.shadowOpacity || "0.3"})`;

    const transform = `rotate(${activeCard.rotation || 0}deg) scaleX(${activeCard.scaleX || 1}) scaleY(${activeCard.scaleY || 1})`;

    const background = activeCard.bgGradientTo 
      ? `linear-gradient(${activeCard.gradientAngle || 135}deg, rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${(activeCard.bgOpacityFrom || 70) / 100}), rgba(${bgToRgb.r}, ${bgToRgb.g}, ${bgToRgb.b}, ${(activeCard.bgOpacityTo || 14) / 100}))`
      : `rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${(activeCard.cardOpacity || 100) / 100})`;

    return {
      width: activeCard.cardWidth || 320,
      height: activeCard.cardHeight || 200,
      background,
      borderRadius: activeCard.cardBorderRadius?.topLeft || 16,
      boxShadow: shadow,
      padding: activeCard.cardPadding || 24,
      opacity: (activeCard.cardOpacity || 100) / 100,
      color: "white",
      transform: `${transform} scale(${zoomLevel})`,
      filter: `blur(${activeCard.blur || 0}px) brightness(${activeCard.brightness || 100}%) contrast(${activeCard.contrast || 100}%) saturate(${activeCard.saturation || 100}%)`,
    };
  }, [activeCard, zoomLevel]);

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

      {/* Header */}
      <header className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700 bg-gray-900 text-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-medium cursor-pointer">Card Editor Pro</h1>
            <span className="text-xs text-gray-400">All changes saved</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCard}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button 
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <Share className="w-3.5 h-3.5" />
            Share
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Play className="w-3.5 h-3.5 fill-current" />
            Present
          </button>
          <div className="w-px h-5 bg-gray-700 mx-1"></div>
          <button 
            onClick={exportCard}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="More options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex items-center justify-center px-3 py-1 border-b border-gray-700 bg-gray-900 flex-shrink-0 gap-1">
        <div className="flex items-center gap-0.5">
          <button 
            onClick={undo} 
            disabled={!canUndo} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Layout Options"
          >
            <Layout className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Theme"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center min-w-15 px-2 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors text-sm" 
            title="Font"
          >
            {activeCard.titleFont || 'Inter'}
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
          <button 
            className="flex items-center min-w-10 px-2 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors text-sm" 
            title="Font Size"
          >
            {activeCard.titleSize || 18}
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => updateCard({titleAlign: 'left'}, true)} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateCard({titleAlign: 'center'}, true)} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateCard({titleAlign: 'right'}, true)} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Effects"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            onClick={generateRandomCard} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Random Card"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-gray-900 border-r border-gray-700 flex flex-col pt-3 flex-shrink-0">
          <div className="px-3 pb-3">
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input 
                type="search" 
                className="w-full pl-8 pr-2 py-1.5 bg-gray-800 text-gray-200 border border-transparent rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-blue-600"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={generateRandomCard}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Card
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              <div 
                className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => updateCard({
                  title: "Business Card",
                  description: "Professional design",
                  bgGradientFrom: "#667eea",
                  bgGradientTo: "#764ba2"
                }, true)}
              >
                <div className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                <p className="text-xs text-gray-300">Business Card</p>
              </div>
              <div 
                className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => updateCard({
                  title: "Social Media",
                  description: "Vibrant and engaging",
                  bgGradientFrom: "#ff6b6b",
                  bgGradientTo: "#feca57"
                }, true)}
              >
                <div className="w-full h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded mb-2"></div>
                <p className="text-xs text-gray-300">Social Media</p>
              </div>
              <div 
                className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => updateCard({
                  title: "Minimal Design",
                  description: "Clean and simple",
                  bgGradientFrom: "#ffffff",
                  bgGradientTo: "#f8f9fa"
                }, true)}
              >
                <div className="w-full h-12 bg-gradient-to-r from-white to-gray-100 rounded mb-2"></div>
                <p className="text-xs text-gray-300">Minimal</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
          {/* Preview Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Card Preview Container */}
            <div className="relative">
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 blur-3xl opacity-30 -z-10"
                style={{
                  background: `radial-gradient(circle, ${activeCard.bgGradientFrom}40, ${activeCard.bgGradientTo || activeCard.bgGradientFrom}20, transparent 70%)`,
                  transform: 'scale(1.5)'
                }}
              ></div>

              {/* Card Preview */}
              <div 
                className="transition-all duration-700 ease-out cursor-pointer hover:scale-105 shadow-2xl relative group"
                style={{
                  ...cardStyle,
                  boxShadow: `${cardStyle.boxShadow}, 0 0 100px rgba(139, 92, 246, 0.1)`
                }}
              >
                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>

                <div className="relative z-10">
                  <h2 
                    className="font-semibold mb-3 drop-shadow-sm" 
                    style={{ 
                      fontSize: `${activeCard.titleSize || 18}px`,
                      fontWeight: activeCard.titleWeight || "600",
                      textAlign: (activeCard.titleAlign || "left") as any
                    }}
                  >
                    {activeCard.title}
                  </h2>
                  <p 
                    className="opacity-90 leading-relaxed drop-shadow-sm"
                    style={{ 
                      fontSize: `${activeCard.descriptionSize || 14}px`,
                      fontWeight: activeCard.descriptionWeight || "400",
                      textAlign: (activeCard.descriptionAlign || "left") as any
                    }}
                  >
                    {activeCard.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300 font-medium">Live Preview</span>
              </div>
            </div>
          </div>

          {/* Dockbar */}
          <Dockbar activeCard={activeCard} updateCard={updateCard} />

          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <button 
                disabled={currentCardIndex <= 0}
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Previous card"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-400 w-16 text-center">
                Card {currentCardIndex + 1} / {totalCards}
              </span>
              <button 
                disabled={currentCardIndex >= totalCards - 1}
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Next card"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))} 
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <select 
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="bg-gray-800 border border-gray-700 text-gray-200 px-1 py-0.5 rounded text-xs w-20 text-center"
              >
                <option value="0.5">50%</option>
                <option value="0.75">75%</option>
                <option value="1.0">100%</option>
                <option value="1.5">150%</option>
                <option value="2.0">200%</option>
              </select>
              <button 
                onClick={() => setZoomLevel(Math.min(3.0, zoomLevel + 0.25))} 
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-gray-700 mx-1"></div>
              <button 
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
