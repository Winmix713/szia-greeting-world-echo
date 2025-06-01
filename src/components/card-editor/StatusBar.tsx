
import React from 'react';
import { ChevronLeft, ChevronRight, ZoomOut, ZoomIn, Maximize } from 'lucide-react';

interface StatusBarProps {
  currentCardIndex: number;
  totalCards: number;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

export default function StatusBar({ 
  currentCardIndex, 
  totalCards, 
  zoomLevel, 
  onZoomChange 
}: StatusBarProps) {
  return (
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
          onClick={() => onZoomChange(Math.max(0.25, zoomLevel - 0.25))} 
          className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <select 
          value={zoomLevel}
          onChange={(e) => onZoomChange(parseFloat(e.target.value))}
          className="bg-gray-800 border border-gray-700 text-gray-200 px-1 py-0.5 rounded text-xs w-20 text-center"
        >
          <option value="0.5">50%</option>
          <option value="0.75">75%</option>
          <option value="1.0">100%</option>
          <option value="1.5">150%</option>
          <option value="2.0">200%</option>
        </select>
        <button 
          onClick={() => onZoomChange(Math.min(3.0, zoomLevel + 0.25))} 
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
  );
}
