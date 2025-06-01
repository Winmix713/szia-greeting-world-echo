
import { useCallback } from 'react';
import { CardData, CardExportOptions } from '@/types/card';
import { COLOR_PALETTE } from '@/utils/cardDefaults';
import { generateCSSCode, generateHTMLCode, generateSVGCode } from '@/utils/cardStyles';

interface UseCardOperationsReturn {
  exportCard: (card: CardData, options?: CardExportOptions) => void;
  generateRandomCard: () => Partial<CardData>;
  duplicateCard: (card: CardData) => CardData;
  resetCard: () => Partial<CardData>;
}

export const useCardOperations = (): UseCardOperationsReturn => {
  const exportCard = useCallback((card: CardData, options: CardExportOptions = {
    format: 'json',
    includeMetadata: true,
    compressed: false
  }) => {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (options.format) {
      case 'css':
        content = generateCSSCode(card);
        filename = `card-${card.id}.css`;
        mimeType = 'text/css';
        break;
      case 'html':
        content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${card.title}</title>
    <style>
        ${generateCSSCode(card)}
    </style>
</head>
<body>
    ${generateHTMLCode(card)}
</body>
</html>`.trim();
        filename = `card-${card.id}.html`;
        mimeType = 'text/html';
        break;
      case 'svg':
        content = generateSVGCode(card);
        filename = `card-${card.id}.svg`;
        mimeType = 'image/svg+xml';
        break;
      default:
        const exportData = {
          card: options.includeMetadata ? card : {
            ...card,
            createdAt: undefined,
            updatedAt: undefined,
            id: undefined
          },
          exportedAt: new Date().toISOString(),
          version: "2.0.0",
        };
        content = JSON.stringify(exportData, null, options.compressed ? 0 : 2);
        filename = `card-${card.id}.json`;
        mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const generateRandomCard = useCallback((): Partial<CardData> => {
    const titles = [
      "Creative Card", "Modern Design", "Elegant Style", "Dynamic Card", 
      "Innovative UI", "Digital Art", "Future Vision", "Bold Statement"
    ];
    
    const descriptions = [
      "Beautiful and responsive design",
      "Crafted with precision and care", 
      "Designed for maximum impact",
      "Built for the future of web",
      "Inspiring creativity through design",
      "Where innovation meets aesthetics",
      "Pushing the boundaries of design"
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    const colors = COLOR_PALETTE;
    const randomFrom = colors[Math.floor(Math.random() * colors.length)];
    let randomTo = colors[Math.floor(Math.random() * colors.length)];
    while (randomTo === randomFrom) {
      randomTo = colors[Math.floor(Math.random() * colors.length)];
    }

    const randomRadius = Math.floor(Math.random() * 45) + 5;
    const randomAngle = Math.floor(Math.random() * 360);
    const randomRotation = Math.floor(Math.random() * 20) - 10;

    return {
      title: randomTitle,
      description: randomDescription,
      bgGradientFrom: randomFrom,
      bgGradientTo: randomTo,
      gradientAngle: randomAngle,
      rotation: randomRotation,
      cardBorderRadius: {
        topLeft: randomRadius,
        topRight: randomRadius,
        bottomLeft: randomRadius,
        bottomRight: randomRadius,
        unit: "px"
      },
      cardOpacity: Math.floor(Math.random() * 20) + 80,
      bgOpacityFrom: Math.floor(Math.random() * 30) + 70,
      bgOpacityTo: Math.floor(Math.random() * 40) + 40,
      updatedAt: new Date().toISOString()
    };
  }, []);

  const duplicateCard = useCallback((card: CardData): CardData => {
    return {
      ...card,
      id: `${card.id}-copy-${Date.now()}`,
      title: `${card.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, []);

  const resetCard = useCallback((): Partial<CardData> => {
    return {
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      cardOpacity: 100,
      bgOpacityFrom: 90,
      bgOpacityTo: 60,
      gradientAngle: 135,
      shadowOpacity: 0.3,
      updatedAt: new Date().toISOString()
    };
  }, []);

  return {
    exportCard,
    generateRandomCard,
    duplicateCard,
    resetCard
  };
};
