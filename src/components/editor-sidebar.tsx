import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Plus,
  FileImage,
  MoreHorizontal,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock hooks - replace with your actual implementations
const useCreateSlide = () => ({
  mutate: (params, callbacks) => {
    setTimeout(() => {
      const newSlide = {
        id: Date.now(),
        title: params.data.title,
        content: params.data.content,
        position: params.data.position,
        isVisible: true,
        updatedAt: new Date().toISOString(),
      };
      callbacks?.onSuccess?.(newSlide);
    }, 500);
  },
  isPending: false,
});

const useToast = () => ({
  toast: ({ title, description, variant }) => {
    console.log(`Toast: ${title} - ${description} (${variant || "default"})`);
  },
});

// Mock slide type
interface Slide {
  id: number;
  title: string;
  content: any;
  position: number;
  isVisible?: boolean;
  updatedAt?: string;
}

interface EditorSidebarProps {
  slides: Slide[];
  currentSlideId: number | null;
  onSlideSelect: (slideId: number) => void;
  onSlideUpdate?: (slideId: number, updates: Partial<Slide>) => void;
  onSlideDelete?: (slideId: number) => void;
  onSlideDuplicate?: (slideId: number) => void;
  onSlideReorder?: (fromIndex: number, toIndex: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  presentationId?: number;
}

export default function EditorSidebar({
  slides = [],
  currentSlideId,
  onSlideSelect,
  onSlideUpdate,
  onSlideDelete,
  onSlideDuplicate,
  onSlideReorder,
  searchQuery,
  onSearchChange,
  presentationId,
}: EditorSidebarProps) {
  const createSlide = useCreateSlide();
  const { toast } = useToast();

  // Local state
  const [deleteSlideId, setDeleteSlideId] = useState<number | null>(null);
  const [draggedSlideId, setDraggedSlideId] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedSlideIds, setSelectedSlideIds] = useState<Set<number>>(
    new Set(),
  );

  // Filtered slides based on search query
  const filteredSlides = useMemo(() => {
    if (!searchQuery.trim()) return slides;

    const query = searchQuery.toLowerCase();
    return slides.filter(
      (slide) =>
        slide.title.toLowerCase().includes(query) ||
        (slide.content &&
          JSON.stringify(slide.content).toLowerCase().includes(query)),
    );
  }, [slides, searchQuery]);

  // Sort slides by position
  const sortedSlides = useMemo(() => {
    return [...filteredSlides].sort((a, b) => a.position - b.position);
  }, [filteredSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sortedSlides.length) return;

      const currentIndex = sortedSlides.findIndex(
        (slide) => slide.id === currentSlideId,
      );

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            onSlideSelect(sortedSlides[currentIndex - 1].id);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < sortedSlides.length - 1) {
            onSlideSelect(sortedSlides[currentIndex + 1].id);
          }
          break;
        case "Delete":
          if (currentSlideId && e.target === document.body) {
            e.preventDefault();
            setDeleteSlideId(currentSlideId);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sortedSlides, currentSlideId, onSlideSelect]);

  const handleAddSlide = useCallback(() => {
    if (!presentationId) {
      toast({
        title: "Error",
        description: "Presentation ID is required to create a slide",
        variant: "destructive",
      });
      return;
    }

    const nextPosition = slides.length;
    createSlide.mutate(
      {
        presentationId,
        data: {
          title: `Slide ${nextPosition + 1}`,
          content: {},
          position: nextPosition,
        },
      },
      {
        onSuccess: (newSlide) => {
          onSlideSelect(newSlide.id);
          toast({
            title: "Slide Added",
            description: "New slide created successfully",
          });
        },
        onError: (error) => {
          console.error("Failed to create slide:", error);
          toast({
            title: "Error",
            description: "Failed to create slide",
            variant: "destructive",
          });
        },
      },
    );
  }, [presentationId, slides.length, createSlide, onSlideSelect, toast]);

  const handleSlideAction = useCallback(
    (action: string, slideId: number, slide?: Slide) => {
      switch (action) {
        case "duplicate":
          if (onSlideDuplicate) {
            onSlideDuplicate(slideId);
            toast({
              title: "Slide Duplicated",
              description: "Slide has been duplicated successfully",
            });
          }
          break;
        case "delete":
          setDeleteSlideId(slideId);
          break;
        case "toggle-visibility":
          if (onSlideUpdate && slide) {
            onSlideUpdate(slideId, { isVisible: !slide.isVisible });
            toast({
              title: slide.isVisible ? "Slide Hidden" : "Slide Shown",
              description: `Slide is now ${slide.isVisible ? "hidden" : "visible"}`,
            });
          }
          break;
        default:
          toast({
            title: action,
            description: `${action} functionality will be implemented`,
          });
      }
    },
    [onSlideDuplicate, onSlideUpdate, toast],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteSlideId && onSlideDelete) {
      onSlideDelete(deleteSlideId);
      if (currentSlideId === deleteSlideId) {
        const remainingSlides = slides.filter((s) => s.id !== deleteSlideId);
        if (remainingSlides.length > 0) {
          onSlideSelect(remainingSlides[0].id);
        }
      }
      toast({
        title: "Slide Deleted",
        description: "Slide has been deleted successfully",
      });
    }
    setDeleteSlideId(null);
  }, [
    deleteSlideId,
    onSlideDelete,
    currentSlideId,
    slides,
    onSlideSelect,
    toast,
  ]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, slideId: number) => {
    setDraggedSlideId(slideId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedSlideId(null);
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();

      if (!draggedSlideId || !onSlideReorder) return;

      const sourceIndex = sortedSlides.findIndex(
        (slide) => slide.id === draggedSlideId,
      );
      if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        onSlideReorder(sourceIndex, targetIndex);
      }

      setDraggedSlideId(null);
      setDragOverIndex(null);
    },
    [draggedSlideId, sortedSlides, onSlideReorder],
  );

  const formatLastEdited = (updatedAt?: string) => {
    if (!updatedAt) return "Never";

    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  return (
    <>
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Slides ({slides.length})
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search slides..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              aria-label="Search slides"
            />
          </div>

          {/* Add Slide Button */}
          <Button
            onClick={handleAddSlide}
            disabled={createSlide.isPending || !presentationId}
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
            aria-label="Add new slide"
          >
            <Plus className="h-4 w-4 mr-2" />
            {createSlide.isPending ? "Adding..." : "Add Slide"}
          </Button>
        </div>

        {/* Slide List */}
        <ScrollArea className="flex-1">
          {sortedSlides.length === 0 ? (
            <div className="text-center text-gray-500 py-12 px-4">
              <FileImage className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium mb-1 text-sm">
                {searchQuery ? "No slides found" : "No slides yet"}
              </p>
              <p className="text-xs text-gray-400">
                {searchQuery
                  ? "Try a different search term"
                  : 'Click "Add Slide" to get started'}
              </p>
            </div>
          ) : (
            <div
              className="p-2 space-y-2"
              role="listbox"
              aria-label="Slide list"
              tabIndex={0}
            >
              {sortedSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`group relative rounded-lg border-2 transition-all cursor-pointer ${
                    currentSlideId === slide.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                  } ${draggedSlideId === slide.id ? "opacity-50" : ""} ${
                    dragOverIndex === index
                      ? "border-blue-400 border-dashed"
                      : ""
                  }`}
                  onClick={() => onSlideSelect(slide.id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, slide.id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  role="option"
                  aria-selected={currentSlideId === slide.id}
                  aria-label={`Slide ${index + 1}: ${slide.title}`}
                  tabIndex={-1}
                >
                  {/* Drag Handle */}
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                  </div>

                  {/* Slide Number Badge */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center font-medium z-10">
                    {index + 1}
                  </div>

                  {/* Visibility Indicator */}
                  {slide.isVisible === false && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center z-10">
                      <EyeOff className="h-3 w-3" />
                    </div>
                  )}

                  {/* Slide Preview */}
                  <div className="aspect-video bg-white rounded-t-md border-b border-gray-100 flex items-center justify-center text-gray-400 text-xs relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 font-medium">
                        {slide.title}
                      </span>
                    </div>

                    {/* Slide Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 bg-white/80 hover:bg-white shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              handleSlideAction("duplicate", slide.id)
                            }
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate Slide
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleSlideAction(
                                "toggle-visibility",
                                slide.id,
                                slide,
                              )
                            }
                          >
                            {slide.isVisible !== false ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Hide Slide
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Show Slide
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleSlideAction("delete", slide.id)
                            }
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Slide
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Slide Info */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 truncate mb-1">
                      {slide.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last edited {formatLastEdited(slide.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {searchQuery
                ? `${sortedSlides.length} of ${slides.length}`
                : `${slides.length}`}{" "}
              slides
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-gray-500 hover:text-gray-700"
                >
                  Sort <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>By Position</DropdownMenuItem>
                <DropdownMenuItem>By Title</DropdownMenuItem>
                <DropdownMenuItem>By Last Modified</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteSlideId}
        onOpenChange={(open) => !open && setDeleteSlideId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this slide? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteSlideId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
