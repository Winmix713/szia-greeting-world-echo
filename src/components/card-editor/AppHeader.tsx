
import React from 'react';
import { ArrowLeft, Save, Share, Play, Download, MoreVertical } from 'lucide-react';

interface AppHeaderProps {
  onExport: () => void;
}

export default function AppHeader({ onExport }: AppHeaderProps) {
  return (
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
          onClick={onExport}
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
          onClick={onExport}
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
  );
}
