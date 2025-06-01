
export interface CardData {
  id: string;
  title: string;
  description: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  bgOpacityFrom: string;
  bgOpacityTo: string;
  shadowColor: string;
  shadowOpacity: string;
  enableHoverEffects: boolean;
  enableAnimations: boolean;
  cardWidth: string;
  cardHeight: string;
  cardPadding: string;
  cardBorderRadius: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    unit: string;
  };
  cardOpacity: number;
  shadowSettings: {
    inset: boolean;
    x: string;
    y: string;
    blur: string;
    spread: string;
  };
  titleFont?: string;
  titleSize?: number;
  titleWeight?: string;
  titleAlign?: string;
  descriptionFont?: string;
  descriptionSize?: number;
  descriptionWeight?: string;
  descriptionAlign?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export interface CardTemplate {
  id: string;
  name: string;
  data: Partial<CardData>;
  gradient: string;
}
