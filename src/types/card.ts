export interface CardBorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  unit: "px" | "%" | "em" | "rem";
}

export interface ShadowSettings {
  x: number;
  y: number;
  blur: number;
  spread: number;
}

export type TextAlign = "left" | "center" | "right" | "justify";

export type FontWeight = "300" | "400" | "500" | "600" | "700" | "800";

export type FontFamily = "Inter" | "Arial" | "Helvetica" | "Georgia" | "Verdana" | "Times New Roman";

export interface CardData {
  id: string;
  title: string;
  description: string;
  bgGradientFrom: string;
  bgGradientTo?: string;
  cardOpacity: number;
  cardBorderRadius: CardBorderRadius;
  enableHoverEffects: boolean;
  cardWidth: number;
  cardHeight: number;
  bgOpacityFrom: number;
  bgOpacityTo: number;
  gradientAngle: number;
  shadowSettings?: ShadowSettings;
  shadowColor: string;
  shadowOpacity: number;
  titleFont: FontFamily;
  titleWeight: FontWeight;
  titleSize: number;
  titleAlign: TextAlign;
  descriptionFont: FontFamily;
  descriptionWeight: FontWeight;
  descriptionSize: number;
  descriptionAlign: TextAlign;
  rotation: number;
  scaleX: number;
  scaleY: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  enableAnimations: boolean;
  cardPadding: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardPreset {
  name: string;
  description: string;
  gradient: string;
  config: Partial<CardData>;
}

export interface CardHistory {
  cards: CardData[];
  currentIndex: number;
  maxHistorySize: number;
}

export interface DockbarTool {
  id: string;
  icon: any;
  label: string;
  description?: string;
}

export interface CardExportOptions {
  format: 'json' | 'css' | 'html' | 'svg';
  includeMetadata: boolean;
  compressed: boolean;
}
