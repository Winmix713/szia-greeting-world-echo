
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
  Filter,
  SortAsc,
  Grid,
  List,
  Star,
  Clock,
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
  DropdownMenuCheckboxItem,
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Card {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isVisible?: boolean;
  isStarred?: boolean;
  updatedAt?: Date;
  tags?: string[];
  category?: string;
}

interface EditorSidebarProps {
  cards: Card[];
  currentCardId: string | null;
  onCardSelect: (cardId: string) => void;
  onCardUpdate?: (cardId: string, updates: Partial<Card>) => void;
  onCardDelete?: (cardId: string) => void;
  onCardDuplicate?: (cardId: string) => void;
  onCardCreate?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "modified" | "created" | "starred";
type FilterBy = "all" | "visible" | "hidden" | "starred";

export default function EditorSidebar({
  cards = [],
  currentCardId,
  onCardSelect,
  onCardUpdate,
  onCardDelete,
  onCardDuplicate,
  onCardCreate,
  searchQuery,
  onSearchChange,
  isLoading = false,
}: EditorSidebarProps) {
  const { toast } = useToast();

  // Local state
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("modified");
  const [filterBy, setFilterBy] = useState<FilterBy>("all");
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  // Filtered and sorted cards
  const processedCards = useMemo(() => {
    let filtered = cards;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply visibility filter
    switch (filterBy) {
      case "visible":
        filtered = filtered.filter(card => card.isVisible !== false);
        break;
      case "hidden":
        filtered = filtered.filter(card => card.isVisible === false);
        break;
      case "starred":
        filtered = filtered.filter(card => card.isStarred === true);
        break;
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "modified":
          return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0);
        case "starred":
          if (a.isStarred === b.isStarred) {
            return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0);
          }
          return a.isStarred ? -1 : 1;
        default:
          return 0;
      }
    });

    return sorted;
  }, [cards, searchQuery, filterBy, sortBy]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!processedCards.length) return;

      const currentIndex = processedCards.findIndex(
        (card) => card.id === currentCardId
      );

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            onCardSelect(processedCards[currentIndex - 1].id);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < processedCards.length - 1) {
            onCardSelect(processedCards[currentIndex + 1].id);
          }
          break;
        case "Delete":
          if (currentCardId && e.target === document.body) {
            e.preventDefault();
            setDeleteCardId(currentCardId);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [processedCards, currentCardId, onCardSelect]);

  const handleCardAction = useCallback(
    (action: string, cardId: string, card?: Card) => {
      switch (action) {
        case "duplicate":
          onCardDuplicate?.(cardId);
          toast({
            title: "Card Duplicated",
            description: "Card has been duplicated successfully",
          });
          break;
        case "delete":
          setDeleteCardId(cardId);
          break;
        case "toggle-visibility":
          if (onCardUpdate && card) {
            onCardUpdate(cardId, { isVisible: !card.isVisible });
            toast({
              title: card.isVisible ? "Card Hidden" : "Card Shown",
              description: `Card is now ${card.isVisible ? "hidden" : "visible"}`,
            });
          }
          break;
        case "toggle-star":
          if (onCardUpdate && card) {
            onCardUpdate(cardId, { isStarred: !card.isStarred });
          }
          break;
        default:
          console.log(`Action ${action} not implemented`);
      }
    },
    [onCardDuplicate, onCardUpdate, toast]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteCardId && onCardDelete) {
      onCardDelete(deleteCardId);
      if (currentCardId === deleteCardId) {
        const remainingCards = cards.filter((c) => c.id !== deleteCardId);
        if (remainingCards.length > 0) {
          onCardSelect(remainingCards[0].id);
        }
      }
      toast({
        title: "Card Deleted",
        description: "Card has been deleted successfully",
      });
    }
    setDeleteCardId(null);
  }, [deleteCardId, onCardDelete, currentCardId, cards, onCardSelect, toast]);

  const formatLastEdited = (updatedAt?: Date) => {
    if (!updatedAt) return "Never";

    const now = new Date();
    const diffMs = now.getTime() - updatedAt.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const CardItem = ({ card, index }: { card: Card; index: number }) => (
    <div
      key={card.id}
      className={`group relative rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        currentCardId === card.id
          ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02]"
          : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
      } ${card.isVisible === false ? "opacity-60" : ""}`}
      onClick={() => onCardSelect(card.id)}
    >
      {/* Card Number Badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center font-medium z-10">
        {index + 1}
      </div>

      {/* Status Indicators */}
      <div className="absolute -top-2 -right-2 flex gap-1 z-10">
        {card.isStarred && (
          <div className="w-6 h-6 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
            <Star className="h-3 w-3 fill-current" />
          </div>
        )}
        {card.isVisible === false && (
          <div className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            <EyeOff className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
      </div>

      {/* Card Preview */}
      {viewMode === "grid" && (
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl border-b border-gray-100 flex items-center justify-center text-gray-400 text-xs relative overflow-hidden">
          {card.thumbnail ? (
            <img 
              src={card.thumbnail} 
              alt={card.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <FileImage className="w-8 h-8 mx-auto mb-1 text-gray-300" />
              <span className="text-gray-400 font-medium">{card.title}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/90 hover:bg-white shadow-sm rounded-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleCardAction("toggle-star", card.id, card)}>
                  <Star className={`h-4 w-4 mr-2 ${card.isStarred ? "fill-current text-yellow-500" : ""}`} />
                  {card.isStarred ? "Remove Star" : "Add Star"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCardAction("duplicate", card.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCardAction("toggle-visibility", card.id, card)}>
                  {card.isVisible !== false ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Card
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Card
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleCardAction("delete", card.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Card Info */}
      <div className={`p-4 ${viewMode === "list" ? "flex items-center justify-between" : ""}`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900 truncate text-sm">
              {card.title}
            </h3>
            {card.isStarred && viewMode === "list" && (
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
            )}
          </div>
          
          {card.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {card.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatLastEdited(card.updatedAt)}</span>
            </div>
            {card.category && (
              <Badge variant="secondary" className="text-xs">
                {card.category}
              </Badge>
            )}
          </div>

          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{card.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {viewMode === "list" && (
          <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCardAction("toggle-star", card.id, card);
              }}
              className="h-6 w-6 p-0"
            >
              <Star className={`h-3 w-3 ${card.isStarred ? "fill-current text-yellow-500" : "text-gray-400"}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleCardAction("duplicate", card.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCardAction("toggle-visibility", card.id, card)}>
                  {card.isVisible !== false ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleCardAction("delete", card.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Cards ({cards.length})
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center gap-2 mb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem
                  checked={filterBy === "all"}
                  onCheckedChange={() => setFilterBy("all")}
                >
                  All Cards
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBy === "visible"}
                  onCheckedChange={() => setFilterBy("visible")}
                >
                  Visible Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBy === "hidden"}
                  onCheckedChange={() => setFilterBy("hidden")}
                >
                  Hidden Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBy === "starred"}
                  onCheckedChange={() => setFilterBy("starred")}
                >
                  Starred Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <SortAsc className="h-3 w-3 mr-1" />
                  Sort
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem
                  checked={sortBy === "modified"}
                  onCheckedChange={() => setSortBy("modified")}
                >
                  Last Modified
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "name"}
                  onCheckedChange={() => setSortBy("name")}
                >
                  Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "starred"}
                  onCheckedChange={() => setSortBy("starred")}
                >
                  Starred First
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Create Button */}
          <Button
            onClick={onCardCreate}
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create Card"}
          </Button>
        </div>

        {/* Card List */}
        <ScrollArea className="flex-1">
          {processedCards.length === 0 ? (
            <div className="text-center text-gray-500 py-12 px-4">
              <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="font-medium mb-2 text-lg">
                {searchQuery ? "No cards found" : "No cards yet"}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Create your first card to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={onCardCreate} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Card
                </Button>
              )}
            </div>
          ) : (
            <div className={`p-3 ${
              viewMode === "grid" 
                ? "grid grid-cols-1 gap-3" 
                : "space-y-2"
            }`}>
              {processedCards.map((card, index) => (
                <CardItem key={card.id} card={card} index={index} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {searchQuery || filterBy !== "all"
                ? `${processedCards.length} of ${cards.length}`
                : `${cards.length}`}{" "}
              cards
            </span>
            {selectedCards.size > 0 && (
              <span>{selectedCards.size} selected</span>
            )}
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCardId}
        onOpenChange={(open) => !open && setDeleteCardId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCardId(null)}>
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
