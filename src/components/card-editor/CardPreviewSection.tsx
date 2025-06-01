
import React from 'react';
import { CardData } from '@/types/card';
import { generateCardStyle } from '@/utils/cardStyles';

interface CardPreviewSectionProps {
  activeCard: CardData;
  zoomLevel: number;
}

export default function CardPreviewSection({ activeCard, zoomLevel }: CardPreviewSectionProps) {
  const cardStyle = generateCardStyle(activeCard, zoomLevel);

  return (
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
  );
}
