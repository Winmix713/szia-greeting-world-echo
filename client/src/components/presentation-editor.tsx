
import { useState, useEffect } from "react";
import { usePresentation, useSlides, useCreatePresentation } from "@/hooks/use-presentation";
import EditorHeader from "./editor-header";
import EditorToolbar from "./editor-toolbar";
import EditorSidebar from "./editor-sidebar";
import EditorCanvas from "./editor-canvas";
import { useToast } from "@/hooks/use-toast";
import type { Slide } from "@shared/schema";

interface PresentationEditorProps {
  presentationId?: number;
}

// Type conversion function to ensure compatibility
const convertSlideData = (rawSlides: any[]): Slide[] => {
  return rawSlides.map(slide => ({
    ...slide,
    isVisible: slide.isVisible ?? true, // Convert null to true
    id: Number(slide.id), // Ensure id is number
  }));
};

export default function PresentationEditor({ presentationId }: PresentationEditorProps) {
  const [currentSlideId, setCurrentSlideId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: presentation, isLoading: presentationLoading } = usePresentation(presentationId);
  const { data: rawSlides = [], isLoading: slidesLoading } = useSlides(presentationId);
  const createPresentation = useCreatePresentation();

  // Convert and type-safe slides
  const slides = convertSlideData(rawSlides);

  // Create default presentation if none exists
  useEffect(() => {
    if (!presentationId && !presentationLoading && !createPresentation.isPending) {
      createPresentation.mutate(
        { title: "Untitled Presentation" },
        {
          onSuccess: (newPresentation) => {
            window.history.replaceState({}, "", `/editor/${newPresentation.id}`);
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to create presentation",
              variant: "destructive",
            });
          },
        }
      );
    }
  }, [presentationId, presentationLoading, createPresentation, toast]);

  // Set current slide to first slide when slides load
  useEffect(() => {
    if (slides.length > 0 && !currentSlideId) {
      setCurrentSlideId(slides[0].id);
    }
  }, [slides, currentSlideId]);

  // Filter slides with proper type handling
  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSlide = slides.find(slide => slide.id === currentSlideId) || null;
  const currentSlideIndex = slides.findIndex(slide => slide.id === currentSlideId);

  const handleSlideChange = (direction: "prev" | "next") => {
    const currentIndex = slides.findIndex(slide => slide.id === currentSlideId);
    let newIndex;
    
    if (direction === "prev") {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(slides.length - 1, currentIndex + 1);
    }
    
    if (slides[newIndex]) {
      setCurrentSlideId(slides[newIndex].id);
    }
  };

  if (presentationLoading || slidesLoading || createPresentation.isPending) {
    return (
      <div className="h-screen flex items-center justify-center editor-theme">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="editor-text-muted text-sm">Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col editor-theme overflow-hidden">
      <EditorHeader 
        presentation={presentation}
        presentationId={presentationId}
      />
      
      <EditorToolbar />
      
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar
          slides={filteredSlides}
          currentSlideId={currentSlideId}
          onSlideSelect={setCurrentSlideId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          presentationId={presentationId}
        />
        
        <EditorCanvas
          currentSlide={currentSlide}
          currentSlideIndex={currentSlideIndex}
          totalSlides={slides.length}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSlideChange={handleSlideChange}
        />
      </div>
    </div>
  );
}
