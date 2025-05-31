
import React, { useState, useCallback, useMemo, useEffect, ChangeEvent, ReactNode } from "react";
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
  ArrowLeft,
  Save,
  Share,
  Play,
  Download,
  MoreVertical,
  Undo,
  Redo,
  Layout,
  ChevronLeft,
  ChevronRight,
  ZoomOut,
  ZoomIn,
  Maximize,
  Shuffle,
  Eye,
  Search,
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered
} from "lucide-react";

// --- UI Components ---
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
  }
>(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

const Slider = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    value: number[];
    onValueChange: (value: number[]) => void;
    min?: number;
    max: number;
    step?: number;
  }
>(({ value, onValueChange, min = 0, max, step = 1, className = "", ...props }, ref) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Slider.displayName = "Slider";

const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }
>(({ checked, onCheckedChange, className = "", ...props }, ref) => {
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
        ref={ref}
        {...props}
      />
      <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
      </div>
    </label>
  );
});
Switch.displayName = "Switch";

const Select = ({ children, value, onValueChange }: {
  children: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, className = "", value, onValueChange }: {
  children: ReactNode;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground shadow-md rounded-md border">
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === SelectContent) {
              return React.cloneElement(child, { onValueChange, setIsOpen });
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

const SelectContent = ({ children, onValueChange, setIsOpen }: {
  children: ReactNode;
  onValueChange?: (value: string) => void;
  setIsOpen?: (open: boolean) => void;
}) => {
  return (
    <div className="p-1">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { onValueChange, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ children, value, onValueChange, setIsOpen }: {
  children: ReactNode;
  value: string;
  onValueChange?: (value: string) => void;
  setIsOpen?: (open: boolean) => void;
}) => {
  return (
    <div
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
      onClick={() => {
        onValueChange?.(value);
        setIsOpen?.(false);
      }}
    >
      {children}
    </div>
  );
};

const SelectValue = () => null;

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// --- Debounce Function ---
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

// --- Type Definitions ---
interface CardBorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  unit: "px" | "%" | "em" | "rem";
}

interface ShadowSettings {
  x: number;
  y: number;
  blur: number;
  spread: number;
}

interface CardSettings {
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
  titleFont: string;
  titleWeight: string;
  titleSize: number;
  titleAlign: "left" | "center" | "right" | "justify";
  descriptionFont: string;
  descriptionWeight: string;
  descriptionSize: number;
  descriptionAlign: "left" | "center" | "right" | "justify";
  rotation: number;
  scaleX: number;
  scaleY: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  enableAnimations: boolean;
  cardPadding: number;
}

// --- Default Settings ---
const DEFAULT_CARD_SETTINGS: CardSettings = {
  id: "1",
  title: "Modern Card",
  description: "Live preview with real-time updates",
  bgGradientFrom: "#523091",
  bgGradientTo: "#1a0b33",
  cardOpacity: 100,
  cardBorderRadius: { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, unit: "px" },
  enableHoverEffects: true,
  cardWidth: 320,
  cardHeight: 200,
  bgOpacityFrom: 70,
  bgOpacityTo: 14,
  gradientAngle: 135,
  shadowSettings: { x: 0, y: 30, blur: 50, spread: 0 },
  shadowColor: "#7c3aed",
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
};

// --- UI Helper Components ---
interface LabeledSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
}

const LabeledSlider = React.memo(({
  label,
  value,
  onValueChange,
  min = 0,
  max,
  step = 1,
  unit = "",
  className = "",
}: LabeledSliderProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-gray-400 text-sm">{label}</label>
        <span className="text-purple-400 font-medium text-sm min-w-[40px] text-right">
          {value}{unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([val]) => onValueChange(val)}
        min={min}
        max={max}
        step={step}
        className="my-1"
      />
    </div>
  );
});
LabeledSlider.displayName = "LabeledSlider";

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ColorInput = React.memo(({ label, value, onChange, className = "" }: ColorInputProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-white font-medium text-sm block">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border-2 border-purple-500/50 cursor-pointer bg-transparent p-0.5"
      />
    </div>
  );
});
ColorInput.displayName = "ColorInput";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  iconColorClass?: string;
}

const SectionHeader = React.memo(({ icon: Icon, title, iconColorClass = "text-purple-400" }: SectionHeaderProps) => (
  <div className="flex items-center gap-2 mb-3 pt-2 border-t border-white/10 first:border-t-0 first:pt-0">
    <Icon className={`w-4 h-4 ${iconColorClass}`} />
    <h4 className="text-white font-medium">{title}</h4>
  </div>
));
SectionHeader.displayName = "SectionHeader";

// --- Dockbar Tools ---
const DOCK_TOOLS = [
  { id: "style", icon: Palette, label: "Style Controls" },
  { id: "gradient", icon: Layers, label: "Gradient Builder" },
  { id: "shadow", icon: Box, label: "Shadow & Depth" },
  { id: "text", icon: Type, label: "Typography" },
  { id: "effects", icon: Sparkles, label: "Advanced Effects" },
  { id: "presets", icon: Settings, label: "Smart Presets" },
];

// --- Dockbar Component ---
interface DockbarProps {
  activeCard: CardSettings;
  updateCard: (updates: Partial<CardSettings>, immediate?: boolean) => void;
}

const Dockbar: React.FC<DockbarProps> = ({ activeCard, updateCard: rawUpdateCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState("style");

  const debouncedRawUpdateCard = useMemo(() => debounce(rawUpdateCard, 300), [rawUpdateCard]);

  const updateCard = useCallback(
    (updates: Partial<CardSettings>, immediate = false) => {
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

  const selectTool = useCallback((toolId: string) => {
    setActiveTool(toolId);
    if (!isExpanded && DOCK_TOOLS.find((t) => t.id === toolId)) {
      setIsExpanded(true);
    }
  }, [isExpanded]);

  const dockStyle: React.CSSProperties = useMemo(() => ({
    position: "fixed",
    bottom: "32px",
    left: "50%",
    zIndex: 50,
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: "12px 16px",
    background: "linear-gradient(181deg, rgba(0, 0, 0, 0.2) 4.5%, rgba(255, 255, 255, 0.05) 99.51%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    boxShadow: `0 0 1px 0 rgba(0,0,0,0.3), 0 4px 6px 0 rgba(0,0,0,0.2), 0 8px 15px 0 rgba(0,0,0,0.15), 0 16px 25px 0 rgba(0,0,0,0.1), inset 0 1px 0 0 rgba(255,255,255,0.15)`,
    transform: "translate3d(-50%, 0, 0)",
    userSelect: "none",
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
    position: "absolute", 
    bottom: "100%", 
    left: "50%",
    transform: "translateX(-50%)",
    marginBottom: "20px",
    background: "linear-gradient(181deg, rgba(0,0,0,0.25) 4.5%, rgba(255,255,255,0.08) 99.51%)",
    backdropFilter: "blur(24px)", 
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.1)", 
    borderRadius: "20px", 
    color: "#ffffff",
    minWidth: "480px", 
    maxWidth: "90vw",
    maxHeight: "calc(100vh - 200px)", 
    overflowY: "auto",
    boxShadow: `0 12px 40px 0 rgba(0,0,0,0.5), 0 4px 16px 0 rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.12)`,
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

  const getUniformBorderRadius = useCallback((): number => card.cardBorderRadius.topLeft, [card.cardBorderRadius.topLeft]);

  const updateUniformBorderRadius = useCallback((value: number) => {
    const numValue = Math.max(0, value);
    updateCard({
      cardBorderRadius: {
        topLeft: numValue, topRight: numValue, bottomLeft: numValue, bottomRight: numValue,
        unit: card.cardBorderRadius.unit,
      },
    });
  }, [updateCard, card.cardBorderRadius.unit]);

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

  return (
    <div style={dockStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {DOCK_TOOLS.map((tool) => (
          <button
            key={tool.id}
            style={getToolButtonStyle(activeTool === tool.id)}
            onClick={() => selectTool(tool.id)}
            title={tool.label}
            onMouseEnter={(e) => { 
              if (activeTool !== tool.id) { 
                e.currentTarget.style.background = "rgba(255,255,255,0.08)"; 
                e.currentTarget.style.transform = "scale(1.02)"; 
              }
            }}
            onMouseLeave={(e) => { 
              if (activeTool !== tool.id) { 
                e.currentTarget.style.background = "transparent"; 
                e.currentTarget.style.transform = "scale(1)"; 
              }
            }}
          >
            <tool.icon size={20} />
          </button>
        ))}
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
        <button
          style={expandButtonStyle}
          onClick={toggleExpanded}
          title={isExpanded ? "Collapse panel" : "Expand panel"}
          onMouseEnter={(e) => { 
            e.currentTarget.style.background = "rgba(255,255,255,0.15)"; 
            e.currentTarget.style.transform = "scale(1.05)"; 
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.background = "rgba(255,255,255,0.1)"; 
            e.currentTarget.style.transform = "scale(1)"; 
          }}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && currentToolData && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350, duration: 0.3 }}
            style={panelStyle}
          >
            <div className={`bg-gradient-to-r ${getColorForToolHeader(activeTool)} p-5 sticky top-0 z-10`}>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {ToolIcon && <ToolIcon className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-white">{currentToolData.label}</h3>
                    <p className="text-white/70 text-xs">Customize your card</p>
                  </div>
                </div>
                <Button
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsExpanded(false)}
                  className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Style Panel */}
              {activeTool === "style" && (
                <div className="space-y-5">
                  <SectionHeader icon={Palette} title="Background" />
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant={!card.bgGradientTo ? "secondary" : "outline"} 
                      onClick={() => updateCard({ bgGradientTo: undefined }, true)} 
                      className="p-3 h-auto bg-purple-600/20 border-purple-500/50 text-white hover:bg-purple-600/30 flex flex-col items-center text-center"
                    >
                      <Circle className="w-5 h-5 mb-1.5 text-purple-400" />
                      <span className="text-xs font-medium">Solid Color</span>
                      <span className="text-gray-400 text-[10px]">Single color</span>
                    </Button>
                    <Button 
                      variant={card.bgGradientTo ? "secondary" : "outline"} 
                      onClick={() => { 
                        selectTool("gradient"); 
                        updateCard({ bgGradientTo: card.bgGradientTo || DEFAULT_CARD_SETTINGS.bgGradientTo }, true); 
                      }} 
                      className="p-3 h-auto bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-700/80 flex flex-col items-center text-center"
                    >
                      <Square className="w-5 h-5 mb-1.5 text-gray-400" />
                      <span className="text-xs font-medium">Gradient</span>
                      <span className="text-gray-400 text-[10px]">Color blend</span>
                    </Button>
                  </div>
                  <div className="flex items-start gap-3">
                    <ColorInput 
                      label="Color" 
                      value={card.bgGradientFrom} 
                      onChange={(val) => updateCard({ bgGradientFrom: val }, true)} 
                      className="w-16" 
                    />
                    <LabeledSlider 
                      label="Opacity" 
                      value={card.cardOpacity} 
                      onValueChange={(val) => updateCard({ cardOpacity: val })} 
                      max={100} 
                      unit="%" 
                      className="flex-1" 
                    />
                  </div>
                  <SectionHeader icon={Layers} title="Appearance" />
                  <LabeledSlider 
                    label="Border Radius" 
                    value={getUniformBorderRadius()} 
                    onValueChange={updateUniformBorderRadius} 
                    max={60} 
                    unit={card.cardBorderRadius.unit} 
                  />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-white font-medium text-sm">Glassmorphism</div>
                          <div className="text-gray-400 text-xs">Frosted glass effect</div>
                        </div>
                      </div>
                      <Switch 
                        checked={card.enableHoverEffects} 
                        onCheckedChange={(checked) => updateCard({ enableHoverEffects: checked }, true)} 
                      />
                    </div>
                  </div>
                  <SectionHeader icon={Box} title="Dimensions" />
                  <div className="grid grid-cols-2 gap-3">
                    <LabeledSlider 
                      label="Width" 
                      value={card.cardWidth} 
                      onValueChange={(val) => updateCard({ cardWidth: Math.max(50, val) })} 
                      min={150} 
                      max={800} 
                      unit="px" 
                    />
                    <LabeledSlider 
                      label="Height" 
                      value={card.cardHeight} 
                      onValueChange={(val) => updateCard({ cardHeight: Math.max(50, val) })} 
                      min={100} 
                      max={600} 
                      unit="px" 
                    />
                  </div>
                </div>
              )}

              {/* Gradient Panel */}
              {activeTool === "gradient" && (
                <div className="space-y-5">
                  <SectionHeader icon={Layers} title="Gradient Setup" iconColorClass="text-orange-400" />
                  <div 
                    className="w-full h-20 rounded-xl border border-gray-600/50" 
                    style={{ 
                      background: `linear-gradient(${card.gradientAngle}deg, ${card.bgGradientFrom}${Math.round(card.bgOpacityFrom * 2.55).toString(16).padStart(2, "0")}, ${card.bgGradientTo || DEFAULT_CARD_SETTINGS.bgGradientTo}${Math.round(card.bgOpacityTo * 2.55).toString(16).padStart(2, "0")})` 
                    }}
                  ></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <ColorInput 
                        label="Start Color" 
                        value={card.bgGradientFrom} 
                        onChange={(val) => updateCard({ bgGradientFrom: val }, true)} 
                      />
                      <LabeledSlider 
                        label="Start Opacity" 
                        value={card.bgOpacityFrom} 
                        onValueChange={(val) => updateCard({ bgOpacityFrom: val })} 
                        max={100} 
                        unit="%" 
                        className="mt-2" 
                      />
                    </div>
                    <div>
                      <ColorInput 
                        label="End Color" 
                        value={card.bgGradientTo || DEFAULT_CARD_SETTINGS.bgGradientTo!} 
                        onChange={(val) => updateCard({ bgGradientTo: val }, true)} 
                      />
                      <LabeledSlider 
                        label="End Opacity" 
                        value={card.bgOpacityTo} 
                        onValueChange={(val) => updateCard({ bgOpacityTo: val })} 
                        max={100} 
                        unit="%" 
                        className="mt-2" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white font-medium text-sm block mb-2">Gradient Direction</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-20 bg-gray-800/70 rounded-full border border-gray-600/50 flex-shrink-0">
                        <button 
                          className="absolute top-1/2 left-1/2 w-10 h-0.5 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 origin-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800" 
                          style={{ transform: `translate(-50%, -50%) rotate(${card.gradientAngle}deg)` }} 
                          onClick={rotateGradientAngle}
                          title={`Angle: ${card.gradientAngle}° (Click to rotate 45°)`}
                        >
                          <div className="absolute right-0 top-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform"></div>
                        </button>
                      </div>
                      <div className="flex-1">
                        <LabeledSlider 
                          label="Angle" 
                          value={card.gradientAngle} 
                          onValueChange={(val) => updateCard({ gradientAngle: val })} 
                          max={359} 
                          unit="°" 
                        />
                        <Input 
                          type="number" 
                          value={card.gradientAngle} 
                          onChange={handleGradientAngleChange} 
                          min="0" 
                          max="359" 
                          className="bg-gray-700 border-gray-600 text-white mt-2 w-full h-9 text-sm" 
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm block mb-2">Preset Gradients</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {from:"#667eea",to:"#764ba2",name:"Royal Blue to Purple"},
                        {from:"#f093fb",to:"#f5576c",name:"Pink to Red"},
                        {from:"#4facfe",to:"#00f2fe",name:"Sky Blue to Cyan"},
                        {from:"#43e97b",to:"#38f9d7",name:"Green to Mint"},
                        {from:"#fa709a",to:"#fee140",name:"Rose to Gold"},
                        {from:"#a8edea",to:"#fed6e3",name:"Aqua to Light Pink"},
                      ].map((preset) => (
                        <button 
                          key={preset.name} 
                          onClick={() => updateCard({ bgGradientFrom:preset.from, bgGradientTo:preset.to }, true)} 
                          className="h-10 rounded-md border border-gray-600/50 hover:border-purple-500/70 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-gray-800" 
                          style={{background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`}} 
                          title={preset.name} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shadow Panel */}
              {activeTool === "shadow" && (
                <div className="space-y-5">
                  <SectionHeader icon={Box} title="Shadow Properties" iconColorClass="text-green-400" />
                  <div className="grid grid-cols-2 gap-3">
                    <LabeledSlider 
                      label="Offset X" 
                      value={card.shadowSettings?.x ?? 0} 
                      onValueChange={(val) => updateCard({ shadowSettings: { ...(card.shadowSettings ?? DEFAULT_CARD_SETTINGS.shadowSettings!), x: val }})} 
                      min={-50} 
                      max={50} 
                      unit="px" 
                    />
                    <LabeledSlider 
                      label="Offset Y" 
                      value={card.shadowSettings?.y ?? 0} 
                      onValueChange={(val) => updateCard({ shadowSettings: { ...(card.shadowSettings ?? DEFAULT_CARD_SETTINGS.shadowSettings!), y: val }})} 
                      min={-50} 
                      max={50} 
                      unit="px" 
                    />
                    <LabeledSlider 
                      label="Blur" 
                      value={card.shadowSettings?.blur ?? 0} 
                      onValueChange={(val) => updateCard({ shadowSettings: { ...(card.shadowSettings ?? DEFAULT_CARD_SETTINGS.shadowSettings!), blur: Math.max(0,val) }})} 
                      max={100} 
                      unit="px" 
                    />
                    <LabeledSlider 
                      label="Spread" 
                      value={card.shadowSettings?.spread ?? 0} 
                      onValueChange={(val) => updateCard({ shadowSettings: { ...(card.shadowSettings ?? DEFAULT_CARD_SETTINGS.shadowSettings!), spread: val }})} 
                      min={-50} 
                      max={50} 
                      unit="px" 
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <ColorInput 
                      label="Color" 
                      value={card.shadowColor} 
                      onChange={(val) => updateCard({ shadowColor: val }, true)} 
                      className="w-16" 
                    />
                    <LabeledSlider 
                      label="Opacity" 
                      value={Math.round(card.shadowOpacity * 100)} 
                      onValueChange={(val) => updateCard({ shadowOpacity: val / 100 })} 
                      max={100} 
                      unit="%" 
                      className="flex-1" 
                    />
                  </div>
                </div>
              )}

              {/* Typography Panel */}
              {activeTool === "text" && (
                <div className="space-y-5">
                  <SectionHeader icon={Type} title="Title" iconColorClass="text-teal-400" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-gray-400 text-xs block mb-0.5">Font Family</label>
                        <Select value={card.titleFont} onValueChange={(value) => updateCard({ titleFont: value }, true)}>
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs block mb-0.5">Font Weight</label>
                        <Select value={card.titleWeight} onValueChange={(value) => updateCard({ titleWeight: value }, true)}>
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300">Light</SelectItem>
                            <SelectItem value="400">Normal</SelectItem>
                            <SelectItem value="500">Medium</SelectItem>
                            <SelectItem value="600">Semibold</SelectItem>
                            <SelectItem value="700">Bold</SelectItem>
                            <SelectItem value="800">ExtraBold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <LabeledSlider 
                      label="Font Size" 
                      value={card.titleSize} 
                      onValueChange={(val) => updateCard({ titleSize: Math.max(1, val) })} 
                      min={10} 
                      max={60} 
                      unit="px" 
                    />
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Alignment</label>
                      <div className="flex gap-1">
                        {[
                          {icon:AlignLeft,value:"left",label:"Align left"},
                          {icon:AlignCenter,value:"center",label:"Align center"},
                          {icon:AlignRight,value:"right",label:"Align right"},
                          {icon:AlignJustify,value:"justify",label:"Justify text"}
                        ].map(({icon:Icon,value,label}) => (
                          <Button 
                            key={value} 
                            onClick={() => updateCard({titleAlign: value as CardSettings["titleAlign"]},true)} 
                            variant={card.titleAlign===value?"secondary":"outline"} 
                            size="icon" 
                            className={`h-8 w-8 ${card.titleAlign===value?"bg-purple-600/80 border-purple-500/70":"bg-gray-700/70 border-gray-600/60 hover:bg-gray-600/80"}`}
                            title={label}
                          >
                            <Icon className="w-3.5 h-3.5 text-white"/>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <SectionHeader icon={Type} title="Description" iconColorClass="text-teal-400" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-gray-400 text-xs block mb-0.5">Font Family</label>
                        <Select value={card.descriptionFont} onValueChange={(value) => updateCard({ descriptionFont: value }, true)}>
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs block mb-0.5">Font Weight</label>
                        <Select value={card.descriptionWeight} onValueChange={(value) => updateCard({ descriptionWeight: value }, true)}>
                          <SelectTrigger className="bg-gray-700/80 border-gray-600/70 text-white h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300">Light</SelectItem>
                            <SelectItem value="400">Normal</SelectItem>
                            <SelectItem value="500">Medium</SelectItem>
                            <SelectItem value="600">Semibold</SelectItem>
                            <SelectItem value="700">Bold</SelectItem>
                            <SelectItem value="800">ExtraBold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <LabeledSlider 
                      label="Font Size" 
                      value={card.descriptionSize} 
                      onValueChange={(val) => updateCard({ descriptionSize: Math.max(1, val) })} 
                      min={8} 
                      max={40} 
                      unit="px" 
                    />
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Alignment</label>
                      <div className="flex gap-1">
                        {[
                          {icon:AlignLeft,value:"left",label:"Align left"},
                          {icon:AlignCenter,value:"center",label:"Align center"},
                          {icon:AlignRight,value:"right",label:"Align right"},
                          {icon:AlignJustify,value:"justify",label:"Justify text"}
                        ].map(({icon:Icon,value,label}) => (
                          <Button 
                            key={value} 
                            onClick={() => updateCard({descriptionAlign: value as CardSettings["descriptionAlign"]},true)} 
                            variant={card.descriptionAlign===value?"secondary":"outline"} 
                            size="icon" 
                            className={`h-8 w-8 ${card.descriptionAlign===value?"bg-purple-600/80 border-purple-500/70":"bg-gray-700/70 border-gray-600/60 hover:bg-gray-600/80"}`}
                            title={label}
                          >
                            <Icon className="w-3.5 h-3.5 text-white"/>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Effects Panel */}
              {activeTool === "effects" && (
                <div className="space-y-5">
                  <SectionHeader icon={RotateCcw} title="Transform" iconColorClass="text-pink-400" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <LabeledSlider 
                      label="Rotation" 
                      value={card.rotation} 
                      onValueChange={(val) => updateCard({ rotation: val })} 
                      min={-180} 
                      max={180} 
                      unit="°" 
                    />
                    <LabeledSlider 
                      label="Scale X" 
                      value={card.scaleX * 100} 
                      onValueChange={(val) => updateCard({ scaleX: val / 100 })} 
                      min={25} 
                      max={250} 
                      unit="%" 
                    />
                    <LabeledSlider 
                      label="Scale Y" 
                      value={card.scaleY * 100} 
                      onValueChange={(val) => updateCard({ scaleY: val / 100 })} 
                      min={25} 
                      max={250} 
                      unit="%" 
                    />
                  </div>
                  <SectionHeader icon={Circle} title="Filters" iconColorClass="text-pink-400" />
                  <div className="bg-gray-800/50 p-3.5 rounded-xl space-y-3">
                    <LabeledSlider 
                      label="Blur" 
                      value={card.blur} 
                      onValueChange={(val) => updateCard({ blur: Math.max(0, val) })} 
                      max={30} 
                      step={0.1} 
                      unit="px" 
                    />
                    <LabeledSlider 
                      label="Brightness" 
                      value={card.brightness} 
                      onValueChange={(val) => updateCard({ brightness: val })} 
                      min={0} 
                      max={200} 
                      unit="%" 
                    />
                    <LabeledSlider 
                      label="Contrast" 
                      value={card.contrast} 
                      onValueChange={(val) => updateCard({ contrast: val })} 
                      min={0} 
                      max={200} 
                      unit="%" 
                    />
                    <LabeledSlider 
                      label="Saturation" 
                      value={card.saturation} 
                      onValueChange={(val) => updateCard({ saturation: val })} 
                      min={0} 
                      max={200} 
                      unit="%" 
                    />
                  </div>
                  <Button 
                    onClick={() => updateCard({rotation:0,scaleX:1,scaleY:1,blur:0,brightness:100,contrast:100,saturation:100},true)} 
                    variant="destructive" 
                    className="w-full bg-gradient-to-r from-red-600/80 to-orange-500/80 hover:from-red-700/90 hover:to-orange-600/90 text-white font-medium py-2.5 rounded-lg text-sm"
                  >
                    Reset All Effects
                  </Button>
                </div>
              )}

              {/* Presets Panel */}
              {activeTool === "presets" && (
                <div className="space-y-5">
                  <SectionHeader icon={Settings} title="Smart Presets" iconColorClass="text-purple-300" />
                  <div className="space-y-3">
                    {[
                      { 
                        name: "Glassmorphism", 
                        description: "Modern frosted glass", 
                        gradient: "from-white/10 to-white/5", 
                        config: { 
                          bgGradientFrom:"rgba(255,255,255,0.15)", 
                          bgGradientTo:"rgba(255,255,255,0.05)", 
                          cardBorderRadius:{topLeft:20,topRight:20,bottomLeft:20,bottomRight:20,unit:"px"}, 
                          enableHoverEffects:true, 
                          cardOpacity:85, 
                          shadowColor:"#000000", 
                          shadowOpacity:0.1, 
                          shadowSettings:{x:0,y:8,blur:32,spread:0} 
                        }
                      },
                      { 
                        name: "Neon Glow", 
                        description: "Vibrant and energetic", 
                        gradient: "from-purple-600 to-blue-600", 
                        config: { 
                          bgGradientFrom:"#8b5cf6", 
                          bgGradientTo:"#3b82f6", 
                          cardOpacity:100, 
                          shadowColor:"#8b5cf6", 
                          shadowOpacity:0.4, 
                          shadowSettings:{x:0,y:0,blur:25,spread:2}, 
                          enableAnimations:true, 
                          titleFont:"Georgia", 
                          titleWeight:"700", 
                          cardBorderRadius:{topLeft:16,topRight:16,bottomLeft:16,bottomRight:16,unit:"px"} 
                        }
                      },
                      { 
                        name: "Gradient Dream", 
                        description: "Smooth color transitions", 
                        gradient: "from-pink-500 to-violet-600", 
                        config: { 
                          bgGradientFrom:"#ec4899", 
                          bgGradientTo:"#8b5cf6", 
                          cardOpacity:100, 
                          cardBorderRadius:{topLeft:16,topRight:16,bottomLeft:16,bottomRight:16,unit:"px"}, 
                          gradientAngle:45, 
                          shadowColor:"#000000", 
                          shadowOpacity:0.15, 
                          shadowSettings:{x:0,y:6,blur:12,spread:0} 
                        }
                      },
                      { 
                        name: "Minimal Clean", 
                        description: "Simple and elegant", 
                        gradient: "from-gray-100 to-gray-200", 
                        config: { 
                          bgGradientFrom:"#f3f4f6", 
                          bgGradientTo:"#e5e7eb", 
                          cardOpacity:100, 
                          cardBorderRadius:{topLeft:8,topRight:8,bottomLeft:8,bottomRight:8,unit:"px"}, 
                          shadowColor:"#000000", 
                          shadowOpacity:0.08, 
                          shadowSettings:{x:0,y:4,blur:6,spread:-1} 
                        }
                      },
                    ].map((preset) => (
                      <button 
                        key={preset.name} 
                        onClick={() => updateCard(preset.config as Partial<CardSettings>, true)} 
                        className="w-full p-3.5 bg-gray-800/60 border border-gray-600/50 rounded-xl text-left hover:border-purple-500/70 transition-colors group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-gray-800"
                        title={`Apply preset: ${preset.name}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{preset.name}</div>
                            <div className="text-gray-400 text-xs">{preset.description}</div>
                          </div>
                        </div>
                        <div className={`w-full h-6 rounded-md mt-2.5 bg-gradient-to-r ${preset.gradient}`}></div>
                      </button>
                    ))}
                  </div>
                  <SectionHeader icon={Sparkles} title="Quick Actions" iconColorClass="text-purple-300" />
                  <Button 
                    onClick={() => {
                      const colors=["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#ffeaa7","#dda0dd","#98d8c8","#f8a5c2","#6a89cc","#f5cd79","#f78fb3","#ff7f50","#ffdab9","#b2f7ef"];
                      const randomFrom = colors[Math.floor(Math.random()*colors.length)]; 
                      let randomTo = colors[Math.floor(Math.random()*colors.length)]; 
                      while(randomTo===randomFrom){randomTo=colors[Math.floor(Math.random()*colors.length)];}
                      const randomRadius = Math.floor(Math.random()*45)+5;
                      updateCard({
                        bgGradientFrom:randomFrom,
                        bgGradientTo:randomTo,
                        gradientAngle:Math.floor(Math.random()*360),
                        rotation:Math.floor(Math.random()*20-10),
                        cardBorderRadius:{topLeft:randomRadius,topRight:randomRadius,bottomLeft:randomRadius,bottomRight:randomRadius,unit:"px"},
                        cardOpacity:Math.floor(Math.random()*20)+80
                      },true);
                    }} 
                    className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-700/90 hover:to-pink-700/90 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
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
};

// --- Main App Component ---
const App: React.FC = () => {
  const [activeCard, setActiveCard] = useState<CardSettings>(DEFAULT_CARD_SETTINGS);
  const [history, setHistory] = useState<CardSettings[]>([DEFAULT_CARD_SETTINGS]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [totalCards, setTotalCards] = useState(3);

  const updateCard = useCallback((updates: Partial<CardSettings>, immediate = false) => {
    const newCard = { ...activeCard, ...updates };
    setActiveCard(newCard);

    if (immediate) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newCard);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [activeCard, history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      setActiveCard(history[historyIndex - 1]);
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      setActiveCard(history[historyIndex + 1]);
    }
  }, [canRedo, historyIndex, history]);

  const generateRandomCard = useCallback(() => {
    const titles = ["Creative Card", "Modern Design", "Elegant Style", "Dynamic Card", "Innovative UI"];
    const descriptions = [
      "Beautiful and responsive design",
      "Crafted with precision and care", 
      "Designed for maximum impact",
      "Built for the future of web",
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

    updateCard({
      title: randomTitle,
      description: randomDescription,
      bgGradientFrom: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      bgGradientTo: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
    }, true);
  }, [updateCard]);

  const exportCard = useCallback(() => {
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

    console.log("Card exported successfully");
  }, [activeCard]);

  const cardStyle = useMemo(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 82, g: 48, b: 145 };
    };

    const bgFromRgb = hexToRgb(activeCard.bgGradientFrom || "#523091");
    const bgToRgb = hexToRgb(activeCard.bgGradientTo || "#1a0b33");
    const shadowRgb = hexToRgb(activeCard.shadowColor || "#7c3aed");

    const shadow = `${activeCard.shadowSettings?.x || "0"}px ${
      activeCard.shadowSettings?.y || "30"
    }px ${activeCard.shadowSettings?.blur || "50"}px ${activeCard.shadowSettings?.spread || "0"}px rgba(${
      shadowRgb.r
    }, ${shadowRgb.g}, ${shadowRgb.b}, ${activeCard.shadowOpacity || "0.3"})`;

    const transform = `rotate(${activeCard.rotation || 0}deg) scaleX(${activeCard.scaleX || 1}) scaleY(${activeCard.scaleY || 1})`;

    const background = activeCard.bgGradientTo 
      ? `linear-gradient(${activeCard.gradientAngle || 135}deg, rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${(activeCard.bgOpacityFrom || 70) / 100}), rgba(${bgToRgb.r}, ${bgToRgb.g}, ${bgToRgb.b}, ${(activeCard.bgOpacityTo || 14) / 100}))`
      : `rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${(activeCard.cardOpacity || 100) / 100})`;

    return {
      width: parseInt(activeCard.cardWidth?.toString() || "320"),
      height: parseInt(activeCard.cardHeight?.toString() || "200"),
      background,
      borderRadius: parseInt(activeCard.cardBorderRadius?.topLeft?.toString() || "16"),
      boxShadow: shadow,
      padding: parseInt(activeCard.cardPadding?.toString() || "24"),
      opacity: (activeCard.cardOpacity || 100) / 100,
      color: "white",
      transform: `${transform} scale(${zoomLevel})`,
      filter: `blur(${activeCard.blur || 0}px) brightness(${activeCard.brightness || 100}%) contrast(${activeCard.contrast || 100}%) saturate(${activeCard.saturation || 100}%)`,
    };
  }, [activeCard, zoomLevel]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Custom CSS */}
      <style>{`
        .slider {
          background: #1f2937;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700 bg-gray-900 text-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-medium cursor-pointer">Card Editor Pro</h1>
            <span className="text-xs text-gray-400">All changes saved</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCard}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button 
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <Share className="w-3.5 h-3.5" />
            Share
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Play className="w-3.5 h-3.5 fill-current" />
            Present
          </button>
          <div className="w-px h-5 bg-gray-700 mx-1"></div>
          <button 
            onClick={exportCard}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="More options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex items-center justify-center px-3 py-1 border-b border-gray-700 bg-gray-900 flex-shrink-0 gap-1">
        <div className="flex items-center gap-0.5">
          <button 
            onClick={undo} 
            disabled={!canUndo} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Layout Options"
          >
            <Layout className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Theme"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center min-w-15 px-2 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors text-sm" 
            title="Font"
          >
            {activeCard.titleFont || 'Inter'}
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
          <button 
            className="flex items-center min-w-10 px-2 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors text-sm" 
            title="Font Size"
          >
            {activeCard.titleSize || 18}
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => updateCard({titleAlign: 'left'}, true)} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateCard({titleAlign: 'center'}, true)} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateCard({titleAlign: 'right'}, true)} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
        <div className="w-px h-4 bg-gray-700 mx-2" />
        <div className="flex items-center gap-0.5">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Effects"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            onClick={generateRandomCard} 
            className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
            title="Random Card"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-gray-900 border-r border-gray-700 flex flex-col pt-3 flex-shrink-0">
          <div className="px-3 pb-3">
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input 
                type="search" 
                className="w-full pl-8 pr-2 py-1.5 bg-gray-800 text-gray-200 border border-transparent rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-blue-600"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={generateRandomCard}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Card
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              <div 
                className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => updateCard({
                  title: "Business Card",
                  description: "Professional design",
                  bgGradientFrom: "#667eea",
                  bgGradientTo: "#764ba2"
                }, true)}
              >
                <div className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                <p className="text-xs text-gray-300">Business Card</p>
              </div>
              <div 
                className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => updateCard({
                  title: "Social Media",
                  description: "Vibrant and engaging",
                  bgGradientFrom: "#ff6b6b",
                  bgGradientTo: "#feca57"
                }, true)}
              >
                <div className="w-full h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded mb-2"></div>
                <p className="text-xs text-gray-300">Social Media</p>
              </div>
              <div 
                className="p-2 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => updateCard({
                  title: "Minimal Design",
                  description: "Clean and simple",
                  bgGradientFrom: "#ffffff",
                  bgGradientTo: "#f8f9fa"
                }, true)}
              >
                <div className="w-full h-12 bg-gradient-to-r from-white to-gray-100 rounded mb-2"></div>
                <p className="text-xs text-gray-300">Minimal</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
          {/* Preview Section */}
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

          {/* Dockbar */}
          <Dockbar activeCard={activeCard} updateCard={updateCard} />

          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <button 
                disabled={currentCardIndex <= 0}
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Previous card"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-400 w-16 text-center">
                Card {currentCardIndex + 1} / {totalCards}
              </span>
              <button 
                disabled={currentCardIndex >= totalCards - 1}
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Next card"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))} 
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <select 
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="bg-gray-800 border border-gray-700 text-gray-200 px-1 py-0.5 rounded text-xs w-20 text-center"
              >
                <option value="0.5">50%</option>
                <option value="0.75">75%</option>
                <option value="1.0">100%</option>
                <option value="1.5">150%</option>
                <option value="2.0">200%</option>
              </select>
              <button 
                onClick={() => setZoomLevel(Math.min(3.0, zoomLevel + 0.25))} 
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-gray-700 mx-1"></div>
              <button 
                className="flex items-center justify-center w-8 h-8 rounded bg-transparent text-gray-200 hover:bg-gray-800 transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
