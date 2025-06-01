
import { CardData } from '@/types/card';

export const generateCardStyle = (card: CardData, zoomLevel: number = 1): React.CSSProperties => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 139, g: 92, b: 246 };
  };

  const bgFromRgb = hexToRgb(card.bgGradientFrom);
  const bgToRgb = hexToRgb(card.bgGradientTo || card.bgGradientFrom);
  const shadowRgb = hexToRgb(card.shadowColor);

  const shadow = card.shadowSettings 
    ? `${card.shadowSettings.x}px ${card.shadowSettings.y}px ${card.shadowSettings.blur}px ${card.shadowSettings.spread}px rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${card.shadowOpacity})`
    : "0 8px 32px rgba(139, 92, 246, 0.3)";

  const transform = `rotate(${card.rotation}deg) scaleX(${card.scaleX}) scaleY(${card.scaleY}) scale(${zoomLevel})`;

  const background = card.bgGradientTo 
    ? `linear-gradient(${card.gradientAngle}deg, rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${card.bgOpacityFrom / 100}), rgba(${bgToRgb.r}, ${bgToRgb.g}, ${bgToRgb.b}, ${card.bgOpacityTo / 100}))`
    : `rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${card.cardOpacity / 100})`;

  const filter = `blur(${card.blur}px) brightness(${card.brightness}%) contrast(${card.contrast}%) saturate(${card.saturation}%)`;

  return {
    width: `${card.cardWidth}px`,
    height: `${card.cardHeight}px`,
    background,
    borderRadius: `${card.cardBorderRadius.topLeft}${card.cardBorderRadius.unit}`,
    boxShadow: shadow,
    padding: `${card.cardPadding}px`,
    color: "white",
    transform,
    filter,
    transition: "all 0.3s ease",
    backdropFilter: card.enableHoverEffects ? "blur(20px)" : "none",
    border: card.enableHoverEffects ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
  };
};

export const generateCSSCode = (card: CardData): string => {
  const style = generateCardStyle(card);
  
  return `
.card {
  width: ${style.width};
  height: ${style.height};
  background: ${style.background};
  border-radius: ${style.borderRadius};
  box-shadow: ${style.boxShadow};
  padding: ${style.padding};
  color: ${style.color};
  filter: ${style.filter};
  transition: ${style.transition};
  ${style.backdropFilter !== "none" ? `backdrop-filter: ${style.backdropFilter};` : ""}
  ${style.border !== "none" ? `border: ${style.border};` : ""}
}

.card-title {
  font-family: ${card.titleFont};
  font-weight: ${card.titleWeight};
  font-size: ${card.titleSize}px;
  text-align: ${card.titleAlign};
}

.card-description {
  font-family: ${card.descriptionFont};
  font-weight: ${card.descriptionWeight};
  font-size: ${card.descriptionSize}px;
  text-align: ${card.descriptionAlign};
}
`.trim();
};

export const generateHTMLCode = (card: CardData): string => {
  return `
<div class="card">
  <h2 class="card-title">${card.title}</h2>
  <p class="card-description">${card.description}</p>
</div>
`.trim();
};

export const generateSVGCode = (card: CardData): string => {
  const style = generateCardStyle(card);
  
  return `
<svg width="${card.cardWidth}" height="${card.cardHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${card.bgGradientFrom};stop-opacity:${card.bgOpacityFrom / 100}" />
      <stop offset="100%" style="stop-color:${card.bgGradientTo || card.bgGradientFrom};stop-opacity:${card.bgOpacityTo / 100}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#gradient)" rx="${card.cardBorderRadius.topLeft}" />
  <text x="${card.cardPadding}" y="${card.cardPadding + card.titleSize}" 
        font-family="${card.titleFont}" 
        font-size="${card.titleSize}" 
        font-weight="${card.titleWeight}" 
        fill="white"
        text-anchor="${card.titleAlign === 'center' ? 'middle' : card.titleAlign === 'right' ? 'end' : 'start'}">
    ${card.title}
  </text>
  <text x="${card.cardPadding}" y="${card.cardPadding + card.titleSize + 20 + card.descriptionSize}" 
        font-family="${card.descriptionFont}" 
        font-size="${card.descriptionSize}" 
        font-weight="${card.descriptionWeight}" 
        fill="rgba(255,255,255,0.9)"
        text-anchor="${card.descriptionAlign === 'center' ? 'middle' : card.descriptionAlign === 'right' ? 'end' : 'start'}">
    ${card.description}
  </text>
</svg>
`.trim();
};
