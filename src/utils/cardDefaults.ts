
import { CardData, CardPreset } from '@/types/card';

export const DEFAULT_CARD_DATA: CardData = {
  id: "default",
  title: "Modern Card",
  description: "Live preview with real-time updates",
  bgGradientFrom: "#8b5cf6",
  bgGradientTo: "#06b6d4",
  cardOpacity: 100,
  cardBorderRadius: { 
    topLeft: 16, 
    topRight: 16, 
    bottomLeft: 16, 
    bottomRight: 16, 
    unit: "px" 
  },
  enableHoverEffects: true,
  cardWidth: 320,
  cardHeight: 200,
  bgOpacityFrom: 90,
  bgOpacityTo: 60,
  gradientAngle: 135,
  shadowSettings: { x: 0, y: 8, blur: 32, spread: 0 },
  shadowColor: "#8b5cf6",
  shadowOpacity: 0.3,
  titleFont: "Inter",
  titleWeight: "600",
  titleSize: 18,
  titleAlign: "left",
  descriptionFont: "Inter",
  descriptionWeight: "400",
  descriptionSize: 14,
  descriptionAlign: "left",
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  enableAnimations: true,
  cardPadding: 24,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const CARD_PRESETS: CardPreset[] = [
  {
    name: "Glassmorphism",
    description: "Modern frosted glass effect",
    gradient: "from-white/10 to-white/5",
    config: {
      bgGradientFrom: "rgba(255,255,255,0.15)",
      bgGradientTo: "rgba(255,255,255,0.05)",
      cardBorderRadius: { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20, unit: "px" },
      enableHoverEffects: true,
      cardOpacity: 85,
      shadowColor: "#000000",
      shadowOpacity: 0.1,
      shadowSettings: { x: 0, y: 8, blur: 32, spread: 0 }
    }
  },
  {
    name: "Neon Glow",
    description: "Vibrant and energetic",
    gradient: "from-purple-600 to-blue-600",
    config: {
      bgGradientFrom: "#8b5cf6",
      bgGradientTo: "#3b82f6",
      cardOpacity: 100,
      shadowColor: "#8b5cf6",
      shadowOpacity: 0.4,
      shadowSettings: { x: 0, y: 0, blur: 25, spread: 2 },
      enableAnimations: true,
      titleFont: "Inter",
      titleWeight: "700",
      cardBorderRadius: { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, unit: "px" }
    }
  },
  {
    name: "Gradient Dream",
    description: "Smooth color transitions",
    gradient: "from-pink-500 to-violet-600",
    config: {
      bgGradientFrom: "#ec4899",
      bgGradientTo: "#8b5cf6",
      cardOpacity: 100,
      cardBorderRadius: { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, unit: "px" },
      gradientAngle: 45,
      shadowColor: "#000000",
      shadowOpacity: 0.15,
      shadowSettings: { x: 0, y: 6, blur: 12, spread: 0 }
    }
  },
  {
    name: "Minimal Clean",
    description: "Simple and elegant",
    gradient: "from-gray-100 to-gray-200",
    config: {
      bgGradientFrom: "#f3f4f6",
      bgGradientTo: "#e5e7eb",
      cardOpacity: 100,
      cardBorderRadius: { topLeft: 8, topRight: 8, bottomLeft: 8, bottomRight: 8, unit: "px" },
      shadowColor: "#000000",
      shadowOpacity: 0.08,
      shadowSettings: { x: 0, y: 4, blur: 6, spread: -1 }
    }
  }
];

export const GRADIENT_PRESETS = [
  { from: "#667eea", to: "#764ba2", name: "Royal Blue to Purple" },
  { from: "#f093fb", to: "#f5576c", name: "Pink to Red" },
  { from: "#4facfe", to: "#00f2fe", name: "Sky Blue to Cyan" },
  { from: "#43e97b", to: "#38f9d7", name: "Green to Mint" },
  { from: "#fa709a", to: "#fee140", name: "Rose to Gold" },
  { from: "#a8edea", to: "#fed6e3", name: "Aqua to Light Pink" },
  { from: "#ff9a9e", to: "#fecfef", name: "Coral to Lavender" },
  { from: "#a18cd1", to: "#fbc2eb", name: "Purple to Pink" },
  { from: "#fad0c4", to: "#ffd1ff", name: "Peach to Pink" },
  { from: "#ff8a80", to: "#ea4c89", name: "Light Red to Dark Pink" }
];

export const COLOR_PALETTE = [
  "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7",
  "#dda0dd", "#98d8c8", "#f8a5c2", "#6a89cc", "#f5cd79",
  "#f78fb3", "#ff7f50", "#ffdab9", "#b2f7ef", "#c7ceea",
  "#a8e6cf", "#ffd3a5", "#fd9644", "#fe9090", "#87ceeb"
];

export const FONT_FAMILIES = [
  "Inter", "Arial", "Helvetica", "Georgia", "Verdana", "Times New Roman"
] as const;

export const FONT_WEIGHTS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "ExtraBold" }
] as const;
