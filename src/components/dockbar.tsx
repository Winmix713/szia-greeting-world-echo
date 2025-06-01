
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Layers,
  Type,
  Settings,
  Sparkles,
  Circle,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  X,
  Box,
  LucideIcon,
  Sliders,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CardData } from '@/types/card';

interface DockbarProps {
  activeCard?: Partial<CardData>;
  updateCard: (updates: Partial<CardData>) => void;
  onPreview?: () => void;
}

// Debounce utility
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// UI Components
const LabeledSlider = React.memo(({
  label,
  value,
  onValueChange,
  min = 0,
  max,
  step = 1,
  unit = "",
  className = "",
}: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
}) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-200">{label}</label>
      <span className="text-xs text-blue-300 font-mono min-w-[40px] text-right">
        {value}{unit}
      </span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([val]) => onValueChange(val)}
      min={min}
      max={max}
      step={step}
      className="w-full"
    />
  </div>
));

const ColorInput = React.memo(({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium text-gray-200">{label}</label>
    <div className="relative">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border-2 border-gray-600 cursor-pointer bg-transparent"
      />
    </div>
  </div>
));

const SectionHeader = React.memo(({
  icon: Icon,
  title,
  description = "",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) => (
  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-700">
    <div className="p-2 bg-blue-500/20 rounded-lg">
      <Icon className="w-4 h-4 text-blue-400" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  </div>
));

const DOCK_TOOLS = [
  { id: "style", icon: Palette, label: "Style Controls", color: "blue" },
  { id: "gradient", icon: Layers, label: "Gradient Builder", color: "purple" },
  { id: "shadow", icon: Box, label: "Shadow & Depth", color: "green" },
  { id: "text", icon: Type, label: "Typography", color: "orange" },
  { id: "effects", icon: Sparkles, label: "Advanced Effects", color: "pink" },
  { id: "presets", icon: Settings, label: "Smart Presets", color: "indigo" },
];

const DEFAULT_CARD: Partial<CardData> = {
  bgGradientFrom: "#3b82f6",
  bgGradientTo: "#8b5cf6",
  cardOpacity: 100,
  cardBorderRadius: "12px",
  enableHoverEffects: false,
  cardWidth: 300,
  cardHeight: 200,
  gradientAngle: 135,
  shadowX: 0,
  shadowY: 10,
  shadowBlur: 20,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 0.25,
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
  enableAnimations: false,
};

export default function Dockbar({ activeCard, updateCard: rawUpdateCard, onPreview }: DockbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState("style");

  const debouncedUpdateCard = useMemo(() => debounce(rawUpdateCard, 200), [rawUpdateCard]);

  const updateCard = useCallback((updates: Partial<CardData>, immediate = false) => {
    if (immediate) {
      rawUpdateCard(updates);
    } else {
      debouncedUpdateCard(updates);
    }
  }, [rawUpdateCard, debouncedUpdateCard]);

  const card = useMemo(() => ({ ...DEFAULT_CARD, ...activeCard }), [activeCard]);

  const selectTool = useCallback((toolId: string) => {
    setActiveTool(toolId);
    if (!isExpanded) setIsExpanded(true);
  }, [isExpanded]);

  const handleGradientAngleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = Math.max(0, Math.min(359, parseInt(e.target.value, 10) || 0));
    updateCard({ gradientAngle: newAngle }, true);
  }, [updateCard]);

  const rotateGradient = useCallback(() => {
    const newAngle = ((card.gradientAngle || 0) + 45) % 360;
    updateCard({ gradientAngle: newAngle }, true);
  }, [card.gradientAngle, updateCard]);

  const resetEffects = useCallback(() => {
    updateCard({
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
    }, true);
  }, [updateCard]);

  const applyPreset = useCallback((presetConfig: Partial<CardData>) => {
    updateCard(presetConfig, true);
  }, [updateCard]);

  const currentTool = DOCK_TOOLS.find(t => t.id === activeTool);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      {/* Main Dock */}
      <div className="flex items-center gap-2 p-3 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
        {DOCK_TOOLS.map((tool) => (
          <Button
            key={tool.id}
            onClick={() => selectTool(tool.id)}
            variant={activeTool === tool.id ? "secondary" : "ghost"}
            size="sm"
            className={`h-12 w-12 p-0 rounded-xl transition-all duration-200 ${
              activeTool === tool.id
                ? `bg-${tool.color}-500/20 text-${tool.color}-400 shadow-lg scale-105`
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </Button>
        ))}
        
        <div className="w-px h-8 bg-gray-600 mx-2" />
        
        {onPreview && (
          <Button
            onClick={onPreview}
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50"
            title="Preview Card"
          >
            <Eye className="w-5 h-5" />
          </Button>
        )}
        
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
      </div>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && currentTool && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-full mb-4 left-0 right-0 w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Panel Header */}
            <div className={`bg-gradient-to-r from-${currentTool.color}-500/20 to-${currentTool.color}-600/20 p-4 border-b border-gray-700/50`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${currentTool.color}-500/20 rounded-lg`}>
                    <currentTool.icon className={`w-5 h-5 text-${currentTool.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{currentTool.label}</h3>
                    <p className="text-gray-400 text-sm">Customize your card design</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {activeTool === "style" && (
                <div className="space-y-6">
                  <SectionHeader icon={Palette} title="Background" />
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => updateCard({ bgGradientTo: undefined }, true)}
                      variant={!card.bgGradientTo ? "secondary" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                    >
                      <Circle className="w-5 h-5" />
                      <span className="text-xs">Solid</span>
                    </Button>
                    <Button
                      onClick={() => updateCard({ bgGradientTo: "#8b5cf6" }, true)}
                      variant={card.bgGradientTo ? "secondary" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      <span className="text-xs">Gradient</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <ColorInput
                      label="Primary Color"
                      value={card.bgGradientFrom || "#3b82f6"}
                      onChange={(val) => updateCard({ bgGradientFrom: val }, true)}
                    />
                    <LabeledSlider
                      label="Opacity"
                      value={card.cardOpacity || 100}
                      onValueChange={(val) => updateCard({ cardOpacity: val })}
                      max={100}
                      unit="%"
                    />
                  </div>

                  <SectionHeader icon={Box} title="Dimensions" />
                  <div className="grid grid-cols-2 gap-4">
                    <LabeledSlider
                      label="Width"
                      value={card.cardWidth || 300}
                      onValueChange={(val) => updateCard({ cardWidth: val })}
                      min={150}
                      max={800}
                      unit="px"
                    />
                    <LabeledSlider
                      label="Height"
                      value={card.cardHeight || 200}
                      onValueChange={(val) => updateCard({ cardHeight: val })}
                      min={100}
                      max={600}
                      unit="px"
                    />
                  </div>

                  <LabeledSlider
                    label="Border Radius"
                    value={parseInt((card.cardBorderRadius || "12px").replace(/\D/g, '')) || 12}
                    onValueChange={(val) => updateCard({ cardBorderRadius: `${val}px` })}
                    max={60}
                    unit="px"
                  />

                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Hover Effects</p>
                      <p className="text-gray-400 text-sm">Enable interactive animations</p>
                    </div>
                    <Switch
                      checked={card.enableHoverEffects || false}
                      onCheckedChange={(checked) => updateCard({ enableHoverEffects: checked }, true)}
                    />
                  </div>
                </div>
              )}

              {activeTool === "gradient" && (
                <div className="space-y-6">
                  <SectionHeader icon={Layers} title="Gradient Builder" />
                  
                  <div 
                    className="w-full h-20 rounded-lg border border-gray-600"
                    style={{
                      background: card.bgGradientTo 
                        ? `linear-gradient(${card.gradientAngle || 135}deg, ${card.bgGradientFrom}, ${card.bgGradientTo})`
                        : card.bgGradientFrom
                    }}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <ColorInput
                      label="Start Color"
                      value={card.bgGradientFrom || "#3b82f6"}
                      onChange={(val) => updateCard({ bgGradientFrom: val }, true)}
                    />
                    <ColorInput
                      label="End Color"
                      value={card.bgGradientTo || "#8b5cf6"}
                      onChange={(val) => updateCard({ bgGradientTo: val }, true)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-200">Direction</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-gray-800 rounded-full border border-gray-600">
                        <button
                          onClick={rotateGradient}
                          className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 origin-center cursor-pointer"
                          style={{ transform: `translate(-50%, -50%) rotate(${card.gradientAngle || 135}deg)` }}
                          title={`Angle: ${card.gradientAngle || 135}°`}
                        >
                          <div className="absolute right-0 top-1/2 w-2 h-2 bg-blue-400 rounded-full transform translate-x-1/2 -translate-y-1/2" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <LabeledSlider
                          label="Angle"
                          value={card.gradientAngle || 135}
                          onValueChange={(val) => updateCard({ gradientAngle: val })}
                          max={359}
                          unit="°"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-200">Preset Gradients</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { from: "#667eea", to: "#764ba2", name: "Purple Blue" },
                        { from: "#f093fb", to: "#f5576c", name: "Pink Red" },
                        { from: "#4facfe", to: "#00f2fe", name: "Sky Blue" },
                        { from: "#43e97b", to: "#38f9d7", name: "Green Mint" },
                        { from: "#fa709a", to: "#fee140", name: "Rose Gold" },
                        { from: "#a8edea", to: "#fed6e3", name: "Aqua Pink" },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => updateCard({ bgGradientFrom: preset.from, bgGradientTo: preset.to }, true)}
                          className="h-10 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors"
                          style={{ background: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTool === "shadow" && (
                <div className="space-y-6">
                  <SectionHeader icon={Box} title="Shadow & Depth" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <LabeledSlider
                      label="Offset X"
                      value={card.shadowX || 0}
                      onValueChange={(val) => updateCard({ shadowX: val })}
                      min={-50}
                      max={50}
                      unit="px"
                    />
                    <LabeledSlider
                      label="Offset Y"
                      value={card.shadowY || 0}
                      onValueChange={(val) => updateCard({ shadowY: val })}
                      min={-50}
                      max={50}
                      unit="px"
                    />
                    <LabeledSlider
                      label="Blur"
                      value={card.shadowBlur || 0}
                      onValueChange={(val) => updateCard({ shadowBlur: val })}
                      max={100}
                      unit="px"
                    />
                    <LabeledSlider
                      label="Spread"
                      value={card.shadowSpread || 0}
                      onValueChange={(val) => updateCard({ shadowSpread: val })}
                      min={-50}
                      max={50}
                      unit="px"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ColorInput
                      label="Shadow Color"
                      value={card.shadowColor || "#000000"}
                      onChange={(val) => updateCard({ shadowColor: val }, true)}
                    />
                    <LabeledSlider
                      label="Opacity"
                      value={Math.round((card.shadowOpacity || 0.25) * 100)}
                      onValueChange={(val) => updateCard({ shadowOpacity: val / 100 })}
                      max={100}
                      unit="%"
                    />
                  </div>
                </div>
              )}

              {activeTool === "text" && (
                <div className="space-y-6">
                  <SectionHeader icon={Type} title="Typography" />
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Title</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        value={card.titleFont || "Inter"}
                        onValueChange={(value) => updateCard({ titleFont: value }, true)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={card.titleWeight || "600"}
                        onValueChange={(value) => updateCard({ titleWeight: value }, true)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="400">Normal</SelectItem>
                          <SelectItem value="500">Medium</SelectItem>
                          <SelectItem value="600">Semibold</SelectItem>
                          <SelectItem value="700">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <LabeledSlider
                      label="Size"
                      value={card.titleSize || 18}
                      onValueChange={(val) => updateCard({ titleSize: val })}
                      min={10}
                      max={60}
                      unit="px"
                    />
                    <div className="flex gap-1">
                      {[
                        { icon: AlignLeft, value: "left" },
                        { icon: AlignCenter, value: "center" },
                        { icon: AlignRight, value: "right" },
                        { icon: AlignJustify, value: "justify" },
                      ].map(({ icon: Icon, value }) => (
                        <Button
                          key={value}
                          onClick={() => updateCard({ titleAlign: value as any }, true)}
                          variant={card.titleAlign === value ? "secondary" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Icon className="w-3 h-3" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Description</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        value={card.descriptionFont || "Inter"}
                        onValueChange={(value) => updateCard({ descriptionFont: value }, true)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={card.descriptionWeight || "400"}
                        onValueChange={(value) => updateCard({ descriptionWeight: value }, true)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light</SelectItem>
                          <SelectItem value="400">Normal</SelectItem>
                          <SelectItem value="500">Medium</SelectItem>
                          <SelectItem value="600">Semibold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <LabeledSlider
                      label="Size"
                      value={card.descriptionSize || 14}
                      onValueChange={(val) => updateCard({ descriptionSize: val })}
                      min={8}
                      max={40}
                      unit="px"
                    />
                  </div>
                </div>
              )}

              {activeTool === "effects" && (
                <div className="space-y-6">
                  <SectionHeader icon={RotateCcw} title="Transform" />
                  <div className="space-y-4">
                    <LabeledSlider
                      label="Rotation"
                      value={card.rotation || 0}
                      onValueChange={(val) => updateCard({ rotation: val })}
                      min={-180}
                      max={180}
                      unit="°"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <LabeledSlider
                        label="Scale X"
                        value={(card.scaleX || 1) * 100}
                        onValueChange={(val) => updateCard({ scaleX: val / 100 })}
                        min={25}
                        max={200}
                        unit="%"
                      />
                      <LabeledSlider
                        label="Scale Y"
                        value={(card.scaleY || 1) * 100}
                        onValueChange={(val) => updateCard({ scaleY: val / 100 })}
                        min={25}
                        max={200}
                        unit="%"
                      />
                    </div>
                  </div>

                  <SectionHeader icon={Sliders} title="Filters" />
                  <div className="space-y-4">
                    <LabeledSlider
                      label="Blur"
                      value={card.blur || 0}
                      onValueChange={(val) => updateCard({ blur: val })}
                      max={30}
                      step={0.1}
                      unit="px"
                    />
                    <LabeledSlider
                      label="Brightness"
                      value={card.brightness || 100}
                      onValueChange={(val) => updateCard({ brightness: val })}
                      min={0}
                      max={200}
                      unit="%"
                    />
                    <LabeledSlider
                      label="Contrast"
                      value={card.contrast || 100}
                      onValueChange={(val) => updateCard({ contrast: val })}
                      min={0}
                      max={200}
                      unit="%"
                    />
                    <LabeledSlider
                      label="Saturation"
                      value={card.saturation || 100}
                      onValueChange={(val) => updateCard({ saturation: val })}
                      min={0}
                      max={200}
                      unit="%"
                    />
                  </div>

                  <Button
                    onClick={resetEffects}
                    variant="destructive"
                    className="w-full"
                  >
                    Reset All Effects
                  </Button>
                </div>
              )}

              {activeTool === "presets" && (
                <div className="space-y-6">
                  <SectionHeader icon={Settings} title="Smart Presets" />
                  
                  <div className="space-y-3">
                    {[
                      {
                        name: "Glassmorphism",
                        description: "Modern frosted glass effect",
                        config: {
                          bgGradientFrom: "rgba(255,255,255,0.15)",
                          bgGradientTo: "rgba(255,255,255,0.05)",
                          cardBorderRadius: "20px",
                          enableHoverEffects: true,
                          cardOpacity: 85,
                          shadowColor: "#000000",
                          shadowOpacity: 0.1,
                          shadowX: 0,
                          shadowY: 8,
                          shadowBlur: 32,
                        },
                      },
                      {
                        name: "Neon Glow",
                        description: "Vibrant and energetic",
                        config: {
                          bgGradientFrom: "#8b5cf6",
                          bgGradientTo: "#3b82f6",
                          cardOpacity: 100,
                          shadowColor: "#8b5cf6",
                          shadowOpacity: 0.4,
                          shadowX: 0,
                          shadowY: 0,
                          shadowBlur: 25,
                          shadowSpread: 2,
                        },
                      },
                      {
                        name: "Minimal Clean",
                        description: "Simple and elegant",
                        config: {
                          bgGradientFrom: "#f3f4f6",
                          bgGradientTo: "#e5e7eb",
                          cardOpacity: 100,
                          cardBorderRadius: "8px",
                          shadowColor: "#000000",
                          shadowOpacity: 0.08,
                          shadowX: 0,
                          shadowY: 4,
                          shadowBlur: 6,
                        },
                      },
                      {
                        name: "Gradient Dream",
                        description: "Smooth color transitions",
                        config: {
                          bgGradientFrom: "#ec4899",
                          bgGradientTo: "#8b5cf6",
                          cardOpacity: 100,
                          cardBorderRadius: "16px",
                          gradientAngle: 45,
                          shadowColor: "#000000",
                          shadowOpacity: 0.15,
                          shadowX: 0,
                          shadowY: 6,
                          shadowBlur: 12,
                        },
                      },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset.config)}
                        className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-left hover:border-blue-500 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">{preset.name}</p>
                            <p className="text-gray-400 text-sm">{preset.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd"];
                      const randomFrom = colors[Math.floor(Math.random() * colors.length)];
                      const randomTo = colors[Math.floor(Math.random() * colors.length)];
                      applyPreset({
                        bgGradientFrom: randomFrom,
                        bgGradientTo: randomTo,
                        gradientAngle: Math.floor(Math.random() * 360),
                        rotation: Math.floor(Math.random() * 20 - 10),
                        cardBorderRadius: `${Math.floor(Math.random() * 30 + 10)}px`,
                      });
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Randomize Style
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
