
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { CardData } from '@/types/card';

interface AppSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGenerateRandom: () => void;
  onUpdateCard: (updates: Partial<CardData>) => void;
}

export default function AppSidebar({ 
  searchQuery, 
  onSearchChange, 
  onGenerateRandom, 
  onUpdateCard 
}: AppSidebarProps) {
  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-700 flex flex-col pt-3 flex-shrink-0">
      <div className="px-3 pb-3">
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input 
            type="search" 
            className="w-full pl-8 pr-2 py-1.5 bg-gray-800 text-gray-200 border border-transparent rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-blue-600"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button 
          onClick={onGenerateRandom}
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
            onClick={() => onUpdateCard({
              title: "Business Card",
              description: "Professional design",
              bgGradientFrom: "#667eea",
              bgGradientTo: "#764ba2"
            })}
          >
            <div className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
            <p className="text-xs text-gray-300">Business Card</p>
          </div>
          <div 
            className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => onUpdateCard({
              title: "Social Media",
              description: "Vibrant and engaging",
              bgGradientFrom: "#ff6b6b",
              bgGradientTo: "#feca57"
            })}
          >
            <div className="w-full h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded mb-2"></div>
            <p className="text-xs text-gray-300">Social Media</p>
          </div>
          <div 
            className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => onUpdateCard({
              title: "Minimal Design",
              description: "Clean and simple",
              bgGradientFrom: "#ffffff",
              bgGradientTo: "#f8f9fa"
            })}
          >
            <div className="w-full h-12 bg-gradient-to-r from-white to-gray-100 rounded mb-2"></div>
            <p className="text-xs text-gray-300">Minimal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
