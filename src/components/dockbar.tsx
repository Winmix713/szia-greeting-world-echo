// Filename: Dockbar.tsx (korábban pit.txt)

import React, { useState, ChangeEvent, ReactNode, useCallback, useMemo } from "react";
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

// --- Debounce segédfüggvény ---
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Parameters<F>) => void;
}

import { CardData } from '@/types/card';

interface DockbarProps {
  activeCard?: Partial<CardData>;
  updateCard: (updates: Partial<CardData>) => void;
}

// --- Belső UI Komponensek (MÓDOSÍTVA: React.memo, A11y) ---
interface LabeledSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
  ['aria-describedby']?: string;
}

const LabeledSlider = React.memo(
  ({
    label,
    value,
    onValueChange,
    min = 0,
    max,
    step = 1,
    unit = "",
    className = "",
    "aria-describedby": ariaDescribedby,
  }: LabeledSliderProps) => {
    const sliderId = useMemo(() => `slider-${label.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).substring(7)}`, [label]);
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor={sliderId} className="text-gray-400 text-sm">
            {label}
          </label>
          <span className="text-purple-400 font-medium text-sm min-w-[40px] text-right">
            {value}
            {unit}
          </span>
        </div>
        <Slider
          id={sliderId}
          value={[value]}
          onValueChange={([val]) => onValueChange(val)}
          min={min}
          max={max}
          step={step}
          className="my-1"
          aria-label={label}
          aria-describedby={ariaDescribedby}
        />
      </div>
    );
  }
);
LabeledSlider.displayName = "LabeledSlider";

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
const ColorInput = React.memo(
  ({ label, value, onChange, className = "" }: ColorInputProps) => {
    const inputId = useMemo(() => `color-${label.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).substring(7)}`, [label]);
    return (
      <div className={`space-y-1 ${className}`}>
        <label htmlFor={inputId} className="text-white font-medium text-sm block">
          {label}
        </label>
        <input
          id={inputId}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded-lg border-2 border-purple-500/50 cursor-pointer bg-transparent p-0.5"
          aria-label={`${label} color picker`}
        />
      </div>
    );
  }
);
ColorInput.displayName = "ColorInput";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  iconColorClass?: string;
}
const SectionHeader = React.memo(
  ({ icon: Icon, title, iconColorClass = "text-purple-400" }: SectionHeaderProps) => (
    <div className="flex items-center gap-2 mb-3 pt-2 border-t border-white/10 first:border-t-0 first:pt-0">
      <Icon className={`w-4 h-4 ${iconColorClass}`} aria-hidden="true" />
      <h4 className="text-white font-medium">{title}</h4>
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

const DOCK_TOOLS = [
  { id: "style", icon: Palette, label: "Style Controls" },
  { id: "gradient", icon: Layers, label: "Gradient Builder" },
  { id: "shadow", icon: Box, label: "Shadow & Depth" },
  { id: "text", icon: Type, label: "Typography" },
  { id: "effects", icon: Sparkles, label: "Advanced Effects" },
  { id: "presets", icon: Settings, label: "Smart Presets" },
];

const DEFAULT_CARD_SETTINGS: Partial<CardData> = {
  bgGradientFrom: "#3b82f6",
  bgGradientTo: "#8b5cf6",
  cardOpacity: 100,
  cardBorderRadius: "12px",
  enableHoverEffects: false,
  cardWidth: 300,
  cardHeight: 200,
  bgOpacityFrom: 100,
  bgOpacityTo: 100,
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

export default function Dockbar({ activeCard, updateCard: rawUpdateCard }: DockbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState("style");

  const debouncedRawUpdateCard = useMemo(() => debounce(rawUpdateCard, 300), [rawUpdateCard]);

  const updateCard = useCallback(
    (updates: Partial<CardData>, immediate = false) => {
      if (immediate) {
        rawUpdateCard(updates);
      } else {
        debouncedRawUpdateCard(updates);
      }
    },
    [rawUpdateCard, debouncedRawUpdateCard]
  );

  const card = useMemo(() => ({ ...DEFAULT_CARD_SETTINGS, ...activeCard }), [activeCard]);

  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  const selectTool = useCallback(
    (toolId: string) => {
      setActiveTool(toolId);
      if (!isExpanded && DOCK_TOOLS.find((t) => t.id === toolId)) {
        setIsExpanded(true);
      }
    },
    [isExpanded]
  );

  const dockStyle: React.CSSProperties = useMemo(() => ({
    position: "fixed", bottom: "24px", left: "50%", zIndex: 50, display: "flex", gap: "8px",
    alignItems: "flex-end", justifyContent: "center", padding: "8px",
    background: "linear-gradient(181deg, rgba(0, 0, 0, 0.1) 4.5%, rgba(255, 255, 255, 0.03) 99.51%)",
    backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "20px",
    boxShadow: `0 0 1px 0 rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.17), 0 4px 3px 0 rgba(0,0,0,0.1), 0 7px 3px 0 rgba(0,0,0,0.03), 0 12px 3px 0 transparent, 0 4px 4px 0 rgba(0,0,0,0.25), inset 0 1px 0 0 rgba(255,255,255,0.1)`,
    transform: "translate3d(-50%, 0, 0)", userSelect: "none",
  }), []);

  const getToolButtonStyle = useCallback((isActive: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px",
    borderRadius: "12px", border: "none", cursor: "pointer", transition: "all 0.2s ease",
    background: isActive ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))" : "transparent",
    backdropFilter: isActive ? "blur(10px)" : "none", color: "#ffffff", fontSize: "0", outline: "none",
    transform: isActive ? "scale(1.05)" : "scale(1)",
    boxShadow: isActive ? "inset 0 1px 0 0 rgba(255,255,255,0.2), 0 2px 8px 0 rgba(0,0,0,0.3)" : "none",
  }), []);

  const expandButtonStyle: React.CSSProperties = useMemo(() => ({
    display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px",
    borderRadius: "8px", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.1)",
    color: "#ffffff", transition: "all 0.2s ease", outline: "none",
  }), []);

  const panelStyle: React.CSSProperties = useMemo(() => ({
    position: "absolute", bottom: "100%", left: "0", right: "0", marginBottom: "12px",
    background: "linear-gradient(181deg, rgba(0,0,0,0.2) 4.5%, rgba(255,255,255,0.07) 99.51%)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", color: "#ffffff",
    minWidth: "420px", maxHeight: "calc(100vh - 150px)", overflowY: "auto",
    boxShadow: `0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.1)`,
  }), []);

  const getColorForToolHeader = useCallback((toolId: string): string => {
    const colorMap: { [key: string]: string } = {
      style: "from-blue-500/70 to-purple-600/70", gradient: "from-pink-500/70 to-orange-500/70",
      shadow: "from-green-500/70 to-teal-500/70", text: "from-teal-500/70 to-cyan-500/70",
      effects: "from-pink-600/70 to-red-500/70", presets: "from-purple-500/70 to-blue-600/70",
    };
    return colorMap[toolId] || "from-gray-500/70 to-gray-600/70";
  }, []);

  const currentToolData = useMemo(() => DOCK_TOOLS.find((t) => t.id === activeTool), [activeTool]);
  const ToolIcon = currentToolData?.icon;

  const getUniformBorderRadius = useCallback((): number => {
    const radius = card.cardBorderRadius || "12px";
    return parseInt(radius.toString().replace(/[^\d]/g, ''), 10) || 12;
  }, [card.cardBorderRadius]);

  const updateUniformBorderRadius = useCallback((value: number) => {
    const numValue = Math.max(0, value);
    updateCard({
      cardBorderRadius: `${numValue}px`,
    });
  }, [updateCard]);

  const handleGradientAngleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newAngle = parseInt(e.target.value, 10);
    if (isNaN(newAngle)) newAngle = card.gradientAngle;
    newAngle = Math.max(0, Math.min(359, newAngle));
    updateCard({ gradientAngle: newAngle }, true);
  }, [updateCard, card.gradientAngle]);

  const rotateGradientAngle = useCallback(() => {
    const newAngle = (card.gradientAngle + 45) % 360;
    updateCard({ gradientAngle: newAngle }, true);
  }, [updateCard, card.gradientAngle]);

  const panelId = "dockbar-panel-content";
  const panelTitleId = "dockbar-panel-title";
  const panelDescriptionId = "dockbar-panel-description";

  return (
    <div style={dockStyle} role="toolbar" aria-label="Card editor dockbar">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {DOCK_TOOLS.map((tool) => (
          <button
            key={tool.id}
            style={getToolButtonStyle(activeTool === tool.id)}
            onClick={() => selectTool(tool.id)}
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={activeTool === tool.id}
            aria-controls={isExpanded && activeTool === tool.id ? panelId : undefined}
            onMouseEnter={(e) => { if (activeTool !== tool.id) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "scale(1.02)"; }}}
            onMouseLeave={(e) => { if (activeTool !== tool.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}}
          >
            <tool.icon size={20} aria-hidden="true" />
          </button>
        ))}
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
        <button
          style={expandButtonStyle}
          onClick={toggleExpanded}
          title={isExpanded ? "Collapse panel" : "Expand panel"}
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          {isExpanded ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronUp size={16} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && currentToolData && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350, duration: 0.3 }}
            style={panelStyle}
            role="dialog"
            aria-labelledby={panelTitleId}
            aria-describedby={panelDescriptionId}
            aria-modal="false"
          >
            <div className={`bg-gradient-to-r ${getColorForToolHeader(activeTool)} p-5 sticky top-0 z-10`}>
              <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {ToolIcon && <ToolIcon className="w-5 h-5 text-white" aria-hidden="true" />}
                  </div>
                  <div>
                    <h3 id={panelTitleId} className="text-md font-semibold text-white">
                      {currentToolData.label}
                    </h3>
                    <p id={panelDescriptionId} className="text-white/70 text-xs">Customize your card</p>
                  </div>
                </div>
                <Button
                  variant="ghost" size="icon" onClick={() => setIsExpanded(false)}
                  className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* --- STYLE PANEL --- */}
              {activeTool === "style" && (
                <div className="space-y-5">
                  <SectionHeader icon={Palette} title="Background" />
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant={!card.bgGradientTo ? "secondary" : "outline"} onClick={() => updateCard({ bgGradientTo: undefined }, true)} className="p-3 h-auto bg-purple-600/20 border-purple-500/50 text-white hover:bg-purple-600/30 flex flex-col items-center text-center" aria-pressed={!card.bgGradientTo}>
                      <Circle className="w-5 h-5 mb-1.5 text-purple-400" /><span className="text-xs font-medium">Solid Color</span><span className="text-gray-400 text-[10px]">Single color</span>
                    </Button>
                    <Button variant={card.bgGradientTo ? "secondary" : "outline"} onClick={() => { selectTool("gradient"); updateCard({ bgGradientTo: card.bgGradientTo || DEFAULT_CARD_SETTINGS.bgGradientTo }, true); }} className="p-3 h-auto bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-700/80 flex flex-col items-center text-center" aria-pressed={!!card.bgGradientTo}>
                      <Square className="w-5 h-5 mb-1.5 text-gray-400" /><span className="text-xs font-medium">Gradient</span><span className="text-gray-400 text-[10px]">Color blend</span>
                    </Button>
                  </div>
                  <div className="flex items-start gap-3">
                    <ColorInput label="Color" value={card.bgGradientFrom} onChange={(val) => updateCard({ bgGradientFrom: val }, true)} className="w-16" />
                    <LabeledSlider label="Opacity" value={card.cardOpacity} onValueChange={(val) => updateCard({ cardOpacity: val })} max={100} unit="%" className="flex-1" />
                  </div>
                  <SectionHeader icon={Layers} title="Appearance" />
                  <LabeledSlider label="Border Radius" value={getUniformBorderRadius()} onValueChange={updateUniformBorderRadius} max={60} unit="px" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-white font-medium text-sm">Glassmorphism</div>
                          <div id="glassmorphism-desc" className="text-gray-400 text-xs">Frosted glass effect</div>
                        </div>
                      </div>
                      <Switch checked={card.enableHoverEffects} onCheckedChange={(checked) => updateCard({ enableHoverEffects: checked }, true)} aria-label="Toggle Glassmorphism effect" aria-describedby="glassmorphism-desc" />
                    </div>
                  </div>
                  <SectionHeader icon={Box} title="Dimensions" />
                  <div className="grid grid-cols-2 gap-3">
                    <LabeledSlider label="Width" value={card.cardWidth} onValueChange={(val) => updateCard({ cardWidth: Math.max(50, val) })} min={150} max={800} unit="px" />
                    <LabeledSlider label="Height" value={card.cardHeight} onValueChange={(val) => updateCard({ cardHeight: Math.max(50, val) })} min={100} max={600} unit="px" />
                  </div>
                </div>
              )}

              {/* --- GRADIENT PANEL --- */}
              {activeTool === "gradient" && (
                <div className="space-y-5">
                  <SectionHeader icon={Layers} title="Gradient Setup" iconColorClass="text-orange-400" />
                  <div className="w-full h-20 rounded-xl border border-gray-600/50" style={{ background: `linear-gradient(${card.gradientAngle}deg, ${card.bgGradientFrom}${Math.round(card.bgOpacityFrom * 2.55).toString(16).padStart(2, "0")}, ${card.bgGradientTo || DEFAULT_CARD_SETTINGS.bgGradientTo}${Math.round(card.bgOpacityTo * 2.55).toString(16).padStart(2, "0")})` }} aria-label="Gradient preview"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <ColorInput label="Start Color" value={card.bgGradientFrom} onChange={(val) => updateCard({ bgGradientFrom: val }, true)} />
                      <LabeledSlider label="Start Opacity" value={card.bgOpacityFrom} onValueChange={(val) => updateCard({ bgOpacityFrom: val })} max={100} unit="%" className="mt-2" />
                    </div>
                    <div>
                      <ColorInput label="End Color" value={card.bgGradientTo || DEFAULT_CARD_SETTINGS.bgGradientTo!} onChange={(val) => updateCard({ bgGradientTo: val }, true)} />
                      <LabeledSlider label="End Opacity" value={card.bgOpacityTo} onValueChange={(val) => updateCard({ bgOpacityTo: val })} max={100} unit="%" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <label id="gradient-direction-label" className="text-white font-medium text-sm block mb-2">Gradient Direction</label>
                    <div className="flex items-center gap-3" role="group" aria-labelledby="gradient-direction-label">
                      <div className="relative w-20 h-20 bg-gray-800/70 rounded-full border border-gray-600/50 flex-shrink-0">
                        <button className="absolute top-1/2 left-1/2 w-10 h-0.5 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 origin-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800" style={{ transform: `translate(-50%, -50%) rotate(${card.gradientAngle}deg)` }} onClick={rotateGradientAngle} aria-label={`Rotate gradient. Angle: ${card.gradientAngle}°`} title={`Angle: ${card.gradientAngle}° (Click to rotate 45°)`}>
                          <div className="absolute right-0 top-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform"></div>
                        </button>
                      </div>
                      <div className="flex-1">
                        <LabeledSlider label="Angle" value={card.gradientAngle} onValueChange={(val) => updateCard({ gradientAngle: val })} max={359} unit="°" />
                        <Input type="number" value={card.gradientAngle} onChange={handleGradientAngleChange} min="0" max="359" className="bg-gray-700 border-gray-600 text-white mt-2 w-full h-9 text-sm" aria-label="Gradient angle input" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm block mb-2">Preset Gradients</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[ {from:"#667eea",to:"#764ba2",name:"Royal Blue to Purple"},{from:"#f093fb",to:"#f5576c",name:"Pink to Red"},{from:"#4facfe",to:"#00f2fe",name:"Sky Blue to Cyan"},{from:"#43e97b",to:"#38f9d7",name:"Green to Mint"},{from:"#fa709a",to:"#fee140",name:"Rose to Gold"},{from:"#a8edea",to:"#fed6e3",name:"Aqua to Light Pink"}, ].map((preset) => (
                        <button key={preset.name} onClick={() => updateCard({ bgGradientFrom:preset.from, bgGradientTo:preset.to }, true)} className="h-10 rounded-md border border-gray-600/50 hover:border-purple-500/70 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-gray-800" style={{background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`}} aria-label={`Apply preset: ${preset.name}`} title={preset.name} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SHADOW PANEL --- */}
              {activeTool === "shadow" && (
                <div className="space-y-5">
                  <SectionHeader icon={Box} title="Shadow Properties" iconColorClass="text-green-400" />
                  <div className="grid grid-cols-2 gap-3">
                    <LabeledSlider label="Offset X" value={card.shadowX ?? 0} onValueChange={(val) => updateCard({ shadowX: val })} min={-50} max={50} unit="px" />
                    <LabeledSlider label="Offset Y" value={card.shadowY ?? 0} onValueChange={(val) => updateCard({ shadowY: val })} min={-50} max={50} unit="px" />
                    <LabeledSlider label="Blur" value={card.shadowBlur ?? 0} onValueChange={(val) => updateCard({ shadowBlur: Math.max(0,val) })} max={100} unit="px" />
                    <LabeledSlider label="Spread" value={card.shadowSpread ?? 0} onValueChange={(val) => updateCard({ shadowSpread: val })} min={-50} max={50} unit="px" />
                  </div>
                  <div className="flex items-end gap-3">
                    <ColorInput label="Color" value={card.shadowColor} onChange={(val) => updateCard({ shadowColor: val }, true)} className="w-16" />
                    <LabeledSlider label="Opacity" value={Math.round(card.shadowOpacity * 100)} onValueChange={(val) => updateCard({ shadowOpacity: val / 100 })} max={100} unit="%" className="flex-1" />
                  </div>
                </div>
              )}

              {/* --- TEXT PANEL --- */}
              {activeTool === "text" && (
                <div className="space-y-5">
                  {/* Title Text Settings */}
                  <SectionHeader icon={Type} title="Title" iconColorClass="text-teal-400" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label id="title-font-label" className="text-gray-400 text-xs block mb-0.5">Font Family</label>
                        <Select value={card.titleFont} onValueChange={(value) => updateCard({ titleFont: value }, true)} aria-labelledby="title-font-label">
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="Inter">Inter</SelectItem><SelectItem value="Arial">Arial</SelectItem><SelectItem value="Helvetica">Helvetica</SelectItem><SelectItem value="Georgia">Georgia</SelectItem><SelectItem value="Verdana">Verdana</SelectItem><SelectItem value="Times New Roman">Times New Roman</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label id="title-weight-label" className="text-gray-400 text-xs block mb-0.5">Font Weight</label>
                        <Select value={card.titleWeight} onValueChange={(value) => updateCard({ titleWeight: value }, true)} aria-labelledby="title-weight-label">
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="300">Light</SelectItem><SelectItem value="400">Normal</SelectItem><SelectItem value="500">Medium</SelectItem><SelectItem value="600">Semibold</SelectItem><SelectItem value="700">Bold</SelectItem><SelectItem value="800">ExtraBold</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <LabeledSlider label="Font Size" value={card.titleSize} onValueChange={(val) => updateCard({ titleSize: Math.max(1, val) })} min={10} max={60} unit="px" />
                    <div>
                      <label id="title-align-label" className="text-gray-400 text-xs block mb-1">Alignment</label>
                      <div className="flex gap-1" role="group" aria-labelledby="title-align-label">
                        {[{icon:AlignLeft,value:"left",label:"Align left"},{icon:AlignCenter,value:"center",label:"Align center"},{icon:AlignRight,value:"right",label:"Align right"},{icon:AlignJustify,value:"justify",label:"Justify text"}].map(({icon:Icon,value,label}) => (
                          <Button key={value} onClick={() => updateCard({titleAlign: value as "left" | "center" | "right" | "justify"},true)} variant={card.titleAlign===value?"secondary":"outline"} size="icon" className={`h-8 w-8 ${card.titleAlign===value?"bg-purple-600/80 border-purple-500/70":"bg-gray-700/70 border-gray-600/60 hover:bg-gray-600/80"}`} aria-label={label} aria-pressed={card.titleAlign===value}><Icon className="w-3.5 h-3.5 text-white"/></Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Description Text Settings */}
                  <SectionHeader icon={Type} title="Description" iconColorClass="text-teal-400" />
                   <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label id="desc-font-label" className="text-gray-400 text-xs block mb-0.5">Font Family</label>
                        <Select value={card.descriptionFont} onValueChange={(value) => updateCard({ descriptionFont: value }, true)} aria-labelledby="desc-font-label">
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="Inter">Inter</SelectItem><SelectItem value="Arial">Arial</SelectItem><SelectItem value="Helvetica">Helvetica</SelectItem><SelectItem value="Georgia">Georgia</SelectItem><SelectItem value="Verdana">Verdana</SelectItem><SelectItem value="Times New Roman">Times New Roman</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label id="desc-weight-label" className="text-gray-400 text-xs block mb-0.5">Font Weight</label>
                        <Select value={card.descriptionWeight} onValueChange={(value) => updateCard({ descriptionWeight: value }, true)} aria-labelledby="desc-weight-label">
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="300">Light</SelectItem><SelectItem value="400">Normal</SelectItem><SelectItem value="500">Medium</SelectItem><SelectItem value="600">Semibold</SelectItem><SelectItem value="700">Bold</SelectItem><SelectItem value="800">ExtraBold</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <LabeledSlider label="Font Size" value={card.descriptionSize} onValueChange={(val) => updateCard({ descriptionSize: Math.max(1, val) })} min={8} max={40} unit="px" />
                    <div>
                      <label id="desc-align-label" className="text-gray-400 text-xs block mb-1">Alignment</label>
                       <div className="flex gap-1" role="group" aria-labelledby="desc-align-label">
                        {[{icon:AlignLeft,value:"left",label:"Align left"},{icon:AlignCenter,value:"center",label:"Align center"},{icon:AlignRight,value:"right",label:"Align right"},{icon:AlignJustify,value:"justify",label:"Justify text"}].map(({icon:Icon,value,label}) => (
                          <Button key={value} onClick={() => updateCard({descriptionAlign: value as "left" | "center" | "right" | "justify"},true)} variant={card.descriptionAlign===value?"secondary":"outline"} size="icon" className={`h-8 w-8 ${card.descriptionAlign===value?"bg-purple-600/80 border-purple-500/70":"bg-gray-700/70 border-gray-600/60 hover:bg-gray-600/80"}`} aria-label={label} aria-pressed={card.descriptionAlign===value}><Icon className="w-3.5 h-3.5 text-white"/></Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- EFFECTS PANEL --- */}
              {activeTool === "effects" && (
                <div className="space-y-5">
                  <SectionHeader icon={RotateCcw} title="Transform" iconColorClass="text-pink-400" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <LabeledSlider label="Rotation" value={card.rotation} onValueChange={(val) => updateCard({ rotation: val })} min={-180} max={180} unit="°" />
                    <LabeledSlider label="Scale X" value={card.scaleX * 100} onValueChange={(val) => updateCard({ scaleX: val / 100 })} min={25} max={250} unit="%" />
                    <LabeledSlider label="Scale Y" value={card.scaleY * 100} onValueChange={(val) => updateCard({ scaleY: val / 100 })} min={25} max={250} unit="%" />
                  </div>
                  <SectionHeader icon={Circle} title="Filters" iconColorClass="text-pink-400" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <LabeledSlider label="Blur" value={card.blur} onValueChange={(val) => updateCard({ blur: Math.max(0, val) })} max={30} step={0.1} unit="px" />
                    <LabeledSlider label="Brightness" value={card.brightness} onValueChange={(val) => updateCard({ brightness: val })} min={0} max={200} unit="%" />
                    <LabeledSlider label="Contrast" value={card.contrast} onValueChange={(val) => updateCard({ contrast: val })} min={0} max={200} unit="%" />
                    <LabeledSlider label="Saturation" value={card.saturation} onValueChange={(val) => updateCard({ saturation: val })} min={0} max={200} unit="%" />
                  </div>
                  <Button onClick={() => updateCard({rotation:0,scaleX:1,scaleY:1,blur:0,brightness:100,contrast:100,saturation:100},true)} variant="destructive" className="w-full bg-gradient-to-r from-red-600/80 to-orange-500/80 hover:from-red-700/90 hover:to-orange-600/90 text-white font-medium py-2.5 rounded-lg text-sm">Reset All Effects</Button>
                </div>
              )}

              {/* --- PRESETS PANEL --- */}
              {activeTool === "presets" && (
                <div className="space-y-5">
                  <SectionHeader icon={Settings} title="Smart Presets" iconColorClass="text-purple-300" />
                  <div className="space-y-3">
                    {[
                      { name: "Glassmorphism", description: "Modern frosted glass", gradient: "from-white/10 to-white/5", config: { bgGradientFrom:"rgba(255,255,255,0.15)", bgGradientTo:"rgba(255,255,255,0.05)", cardBorderRadius:"20px", enableHoverEffects:true, cardOpacity:85, shadowColor:"#000000", shadowOpacity:0.1, shadowX:0, shadowY:8, shadowBlur:32, shadowSpread:0 }},
                      { name: "Neon Glow", description: "Vibrant and energetic", gradient: "from-purple-600 to-blue-600", config: { bgGradientFrom:"#8b5cf6", bgGradientTo:"#3b82f6", cardOpacity:100, shadowColor:"#8b5cf6", shadowOpacity:0.4, shadowX:0, shadowY:0, shadowBlur:25, shadowSpread:2, enableAnimations:true, titleFont:"Georgia", titleWeight:"700", cardBorderRadius:"16px" }},
                      { name: "Gradient Dream", description: "Smooth color transitions", gradient: "from-pink-500 to-violet-600", config: { bgGradientFrom:"#ec4899", bgGradientTo:"#8b5cf6", cardOpacity:100, cardBorderRadius:"16px", gradientAngle:45, shadowColor:"#000000", shadowOpacity:0.15, shadowX:0, shadowY:6, shadowBlur:12, shadowSpread:0 }},
                      { name: "Minimal Clean", description: "Simple and elegant", gradient: "from-gray-100 to-gray-200", config: { bgGradientFrom:"#f3f4f6", bgGradientTo:"#e5e7eb", cardOpacity:100, cardBorderRadius:"8px", shadowColor:"#000000", shadowOpacity:0.08, shadowX:0, shadowY:4, shadowBlur:6, shadowSpread:-1 }},
                    ].map((preset) => (
                      <button key={preset.name} onClick={() => updateCard(preset.config as Partial<CardData>, true)} className="w-full p-3.5 bg-gray-800/60 border border-gray-600/50 rounded-xl text-left hover:border-purple-500/70 transition-colors group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-gray-800" title={`Apply preset: ${preset.name}`} aria-label={`Apply preset: ${preset.name}`}>
                        <div className="flex items-center gap-2.5"><Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" /><div className="flex-1"><div className="text-white font-medium text-sm">{preset.name}</div><div className="text-gray-400 text-xs">{preset.description}</div></div></div>
                        <div className={`w-full h-6 rounded-md mt-2.5 bg-gradient-to-r ${preset.gradient}`} aria-hidden="true"></div>
                      </button>
                    ))}
                  </div>
                  <SectionHeader icon={Sparkles} title="Quick Actions" iconColorClass="text-purple-300" />
                  <Button onClick={() => {
                      const colors=["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#ffeaa7","#dda0dd","#98d8c8","#f8a5c2","#6a89cc","#f5cd79","#f78fb3","#ff7f50","#ffdab9","#b2f7ef"];
                      const randomFrom = colors[Math.floor(Math.random()*colors.length)]; let randomTo = colors[Math.floor(Math.random()*colors.length)]; while(randomTo===randomFrom){randomTo=colors[Math.floor(Math.random()*colors.length)];}
                      const randomRadius = Math.floor(Math.random()*45)+5;
                      updateCard({bgGradientFrom:randomFrom,bgGradientTo:randomTo,gradientAngle:Math.floor(Math.random()*360),rotation:Math.floor(Math.random()*20-10),cardBorderRadius:`${randomRadius}px`,cardOpacity:Math.floor(Math.random()*20)+80},true);
                    }} className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-700/90 hover:to-pink-700/90 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />Randomize Style
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
