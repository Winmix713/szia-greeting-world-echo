import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ZoomOut,
  ZoomIn,
  Maximize,
  Grid,
  Ruler,
  MousePointer,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Konstansok
const SLIDE_DIMENSIONS = {
  width: 720,
  height: 540,
  aspectRatio: "16:9",
} as const;

const ZOOM_LIMITS = {
  min: 25,
  max: 200,
  step: 25,
} as const;

const ZOOM_OPTIONS = [25, 50, 75, 100, 125, 150, 200];

// Típusok
interface Slide {
  id: string;
  title: string;
  content?: string;
}

interface EditorCanvasProps {
  currentSlide?: Slide | null;
  currentSlideIndex: number;
  totalSlides: number;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onSlideChange: (direction: "prev" | "next") => void;
  isLoading?: boolean;
}

// Segédfüggvények
const generateRulerMarks = (
  zoomLevel: number,
  isHorizontal: boolean = true,
) => {
  const step = zoomLevel < 50 ? 100 : zoomLevel < 100 ? 50 : 25;
  const count = isHorizontal ? 20 : 15;

  return Array.from({ length: count }, (_, i) => ({
    position: i * (100 / count),
    value: i * step,
  }));
};

export default function EditorCanvas({
  currentSlide,
  currentSlideIndex,
  totalSlides,
  zoomLevel,
  onZoomChange,
  onSlideChange,
  isLoading = false,
}: EditorCanvasProps) {
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive ellenőrzés
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Zoom handlers - optimalizálva useCallback-kel
  const handleZoomIn = useCallback(() => {
    if (zoomLevel < ZOOM_LIMITS.max) {
      onZoomChange(Math.min(ZOOM_LIMITS.max, zoomLevel + ZOOM_LIMITS.step));
    }
  }, [zoomLevel, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel > ZOOM_LIMITS.min) {
      onZoomChange(Math.max(ZOOM_LIMITS.min, zoomLevel - ZOOM_LIMITS.step));
    }
  }, [zoomLevel, onZoomChange]);

  const handleZoomSelect = useCallback(
    (value: string) => {
      onZoomChange(parseInt(value));
    },
    [onZoomChange],
  );

  const handleFitToScreen = useCallback(() => {
    onZoomChange(100);
  }, [onZoomChange]);

  // Slide navigáció handlers
  const handlePrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      onSlideChange("prev");
    }
  }, [currentSlideIndex, onSlideChange]);

  const handleNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      onSlideChange("next");
    }
  }, [currentSlideIndex, totalSlides, onSlideChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            handleZoomIn();
            break;
          case "-":
            e.preventDefault();
            handleZoomOut();
            break;
          case "0":
            e.preventDefault();
            handleFitToScreen();
            break;
        }
      }

      // Arrow navigáció
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            handlePrevSlide();
            break;
          case "ArrowRight":
            e.preventDefault();
            handleNextSlide();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleZoomIn,
    handleZoomOut,
    handleFitToScreen,
    handlePrevSlide,
    handleNextSlide,
  ]);

  // Memorizált ruler jelölések
  const horizontalRulerMarks = useMemo(
    () => generateRulerMarks(zoomLevel, true),
    [zoomLevel],
  );
  const verticalRulerMarks = useMemo(
    () => generateRulerMarks(zoomLevel, false),
    [zoomLevel],
  );

  // Loading állapot
  if (isLoading) {
    return (
      <main className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading presentation...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex-1 bg-gray-100 flex flex-col relative"
      role="application"
      aria-label="Slide editor canvas"
    >
      {/* Canvas Header */}
      <div className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        {/* Left: Slide Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className="h-7 w-7 p-0 hover:bg-gray-100 disabled:opacity-50"
            title="Previous Slide (← Arrow)"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </Button>

          <span
            className="text-sm text-gray-600 font-medium min-w-[80px] text-center"
            aria-live="polite"
          >
            {totalSlides > 0
              ? `${currentSlideIndex + 1} / ${totalSlides}`
              : "0 / 0"}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextSlide}
            disabled={currentSlideIndex >= totalSlides - 1}
            className="h-7 w-7 p-0 hover:bg-gray-100 disabled:opacity-50"
            title="Next Slide (→ Arrow)"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Center: View Tools */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="h-7 px-2 text-xs"
              title="Toggle Grid"
              aria-pressed={showGrid}
            >
              <Grid className="h-3 w-3 mr-1" />
              Grid
            </Button>

            <Button
              variant={showRulers ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowRulers(!showRulers)}
              className="h-7 px-2 text-xs"
              title="Toggle Rulers"
              aria-pressed={showRulers}
            >
              <Ruler className="h-3 w-3 mr-1" />
              Rulers
            </Button>
          </div>
        )}

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= ZOOM_LIMITS.min}
            className="h-7 w-7 p-0 hover:bg-gray-100 disabled:opacity-50"
            title="Zoom Out (Ctrl + -)"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-3 w-3 text-gray-600" />
          </Button>

          <Select value={zoomLevel.toString()} onValueChange={handleZoomSelect}>
            <SelectTrigger
              className="w-20 h-7 text-xs bg-white border-gray-200 focus:border-blue-500"
              aria-label="Zoom level"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ZOOM_OPTIONS.map((zoom) => (
                <SelectItem key={zoom} value={zoom.toString()}>
                  {zoom}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= ZOOM_LIMITS.max}
            className="h-7 w-7 p-0 hover:bg-gray-100 disabled:opacity-50"
            title="Zoom In (Ctrl + +)"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-3 w-3 text-gray-600" />
          </Button>

          <Separator orientation="vertical" className="h-4 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitToScreen}
            className="h-7 w-7 p-0 hover:bg-gray-100"
            title="Fit to Screen (Ctrl + 0)"
            aria-label="Fit to screen"
          >
            <Maximize className="h-3 w-3 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Rulers */}
        {showRulers && !isMobile && (
          <>
            {/* Horizontal Ruler */}
            <div className="absolute top-0 left-8 right-0 h-8 bg-white border-b border-gray-200 z-10">
              <div className="h-full relative">
                {horizontalRulerMarks.map((mark, i) => (
                  <div
                    key={i}
                    className="absolute top-0 w-px h-full bg-gray-300"
                    style={{ left: `${mark.position}%` }}
                  >
                    <span className="absolute top-1 left-1 text-xs text-gray-500">
                      {mark.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Ruler */}
            <div className="absolute top-8 left-0 bottom-0 w-8 bg-white border-r border-gray-200 z-10">
              <div className="w-full relative h-full">
                {verticalRulerMarks.map((mark, i) => (
                  <div
                    key={i}
                    className="absolute left-0 w-full h-px bg-gray-300"
                    style={{ top: `${mark.position}%` }}
                  >
                    <span className="absolute left-1 top-1 text-xs text-gray-500 rotate-90 origin-top-left">
                      {mark.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corner */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-white border-r border-b border-gray-200 z-20" />
          </>
        )}

        {/* Main Canvas */}
        <div
          className={`w-full h-full flex items-center justify-center p-4 md:p-8 ${
            showRulers && !isMobile ? "pl-16 pt-16" : ""
          }`}
          style={{
            backgroundImage: showGrid
              ? "radial-gradient(circle, #e5e5e5 1px, transparent 1px)"
              : "none",
            backgroundSize: showGrid ? "20px 20px" : "auto",
          }}
        >
          {/* Slide Container */}
          <div
            className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 transition-transform duration-200"
            style={{
              width: `${SLIDE_DIMENSIONS.width}px`,
              height: `${SLIDE_DIMENSIONS.height}px`,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center",
              maxWidth: isMobile ? "90vw" : "none",
              maxHeight: isMobile ? "60vh" : "none",
            }}
          >
            {currentSlide ? (
              <div className="w-full h-full flex flex-col">
                {/* Slide Content */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    {currentSlide.title}
                  </h1>
                  <div className="text-lg text-gray-600 leading-relaxed">
                    {currentSlide.content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentSlide.content,
                        }}
                      />
                    ) : (
                      <>
                        <p>
                          This is slide content. You can add text, images, and
                          other elements here.
                        </p>
                        <p className="mt-4">
                          Use the toolbar above to add and format content.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MousePointer className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">
                    Select a slide to start editing
                  </p>
                  <p className="text-sm">Or create a new slide to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-white border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Ready</span>
          <span>•</span>
          <span>Auto-save: On</span>
          {isMobile && (
            <>
              <span>•</span>
              <span>Mobile View</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{SLIDE_DIMENSIONS.aspectRatio} Aspect Ratio</span>
          <span>•</span>
          <span>{zoomLevel}% Zoom</span>
          {!isMobile && (
            <>
              <span>•</span>
              <span>1920 × 1080</span>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
