
import { CardData } from '@/types/card';

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 82, g: 48, b: 145 };
};

export const generateCardStyle = (activeCard: CardData, zoomLevel: number = 1) => {
  const bgFromRgb = hexToRgb(activeCard.bgGradientFrom || "#523091");
  const bgToRgb = hexToRgb(activeCard.bgGradientTo || "#1a0b33");
  const shadowRgb = hexToRgb(activeCard.shadowColor || "#7c3aed");

  const shadow = `${activeCard.shadowSettings?.x || 0}px ${
    activeCard.shadowSettings?.y || 30
  }px ${activeCard.shadowSettings?.blur || 50}px ${activeCard.shadowSettings?.spread || 0}px rgba(${
    shadowRgb.r
  }, ${shadowRgb.g}, ${shadowRgb.b}, ${activeCard.shadowOpacity || 0.3})`;

  const transform = `rotate(${activeCard.rotation || 0}deg) scaleX(${activeCard.scaleX || 1}) scaleY(${activeCard.scaleY || 1})`;

  const background = activeCard.bgGradientTo 
    ? `linear-gradient(${activeCard.gradientAngle || 135}deg, rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${(activeCard.bgOpacityFrom || 70) / 100}), rgba(${bgToRgb.r}, ${bgToRgb.g}, ${bgToRgb.b}, ${(activeCard.bgOpacityTo || 14) / 100}))`
    : `rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${(activeCard.cardOpacity || 100) / 100})`;

  return {
    width: String(activeCard.cardWidth || 320),
    height: String(activeCard.cardHeight || 200),
    background,
    borderRadius: String(activeCard.cardBorderRadius?.topLeft || 16),
    boxShadow: shadow,
    padding: String(activeCard.cardPadding || 24),
    opacity: (activeCard.cardOpacity || 100) / 100,
    color: "white",
    transform: `${transform} scale(${zoomLevel})`,
    filter: `blur(${activeCard.blur || 0}px) brightness(${activeCard.brightness || 100}%) contrast(${activeCard.contrast || 100}%) saturate(${activeCard.saturation || 100}%)`,
  };
};
