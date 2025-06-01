import { useCallback } from "react";
import { CardData } from "../types/card";
import { useToast } from "./use-toast";

export const useCardOperations = () => {
  const { toast } = useToast();

  const generateRandomCard = useCallback((): Partial<CardData> => {
    const titles = ["Creative Card", "Modern Design", "Elegant Style", "Dynamic Card", "Innovative UI"];
    const descriptions = [
      "Beautiful and responsive design",
      "Crafted with precision and care",
      "Designed for maximum impact",
      "Built for the future of web",
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

    return {
      title: randomTitle,
      description: randomDescription,
      bgGradientFrom: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      bgGradientTo: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
    };
  }, []);

  const exportCard = useCallback((activeCard: CardData) => {
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

    toast({
      title: "Card Exported",
      description: "Your card design has been exported successfully",
    });
  }, [toast]);

  const handleShare = useCallback(() => {
    toast({
      title: "Share Feature",
      description: "Share functionality coming soon",
    });
  }, [toast]);

  return {
    generateRandomCard,
    exportCard,
    handleShare,
  };
};
