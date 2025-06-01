
import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Share,
  Play,
  Download,
  MoreVertical,
  Users,
  Clock,
  Star,
  Loader2,
  Settings,
  Undo,
  Redo,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface EditorHeaderProps {
  title?: string;
  isModified?: boolean;
  isStarred?: boolean;
  lastSaved?: Date;
  collaborators?: Array<{ id: string; name: string; avatar?: string }>;
  canUndo?: boolean;
  canRedo?: boolean;
  onBack?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onPresent?: () => void;
  onDownload?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleStar?: () => void;
  isSaving?: boolean;
}

export default function EditorHeader({
  title = "Untitled Card",
  isModified = false,
  isStarred = false,
  lastSaved,
  collaborators = [],
  canUndo = false,
  canRedo = false,
  onBack,
  onSave,
  onShare,
  onPresent,
  onDownload,
  onUndo,
  onRedo,
  onDuplicate,
  onDelete,
  onToggleStar,
  isSaving = false,
}: EditorHeaderProps) {
  const { toast } = useToast();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // Auto-save indicator
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  useEffect(() => {
    if (isSaving) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            onSave?.();
            break;
          case "z":
            if (e.shiftKey) {
              e.preventDefault();
              onRedo?.();
            } else {
              e.preventDefault();
              onUndo?.();
            }
            break;
          case "y":
            e.preventDefault();
            onRedo?.();
            break;
          case "d":
            e.preventDefault();
            onDuplicate?.();
            break;
          case "k":
            e.preventDefault();
            onShare?.();
            break;
          case "Enter":
            e.preventDefault();
            onPresent?.();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onUndo, onRedo, onDuplicate, onShare, onPresent]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: "Check out this card design",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Card link copied to clipboard",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Share Failed",
          description: "Unable to share card",
          variant: "destructive",
        });
      }
    }
  }, [title, toast]);

  const handleDownload = useCallback(async () => {
    try {
      // Create download data
      const cardData = {
        title,
        timestamp: new Date().toISOString(),
        // Add card configuration here
      };
      
      const dataStr = JSON.stringify(cardData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: "Card design downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download card design",
        variant: "destructive",
      });
    }
  }, [title, toast]);

  const lastSavedText = lastSaved
    ? formatDistanceToNow(lastSaved, { addSuffix: true })
    : "Never";

  const collaboratorText = collaborators.length > 0
    ? `${collaborators.length + 1} collaborators`
    : "Only you";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-9 w-9 p-0 hover:bg-gray-100 rounded-lg"
          title="Back (Alt+←)"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Button>

        <div className="flex items-center gap-4">
          {/* Project Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-lg font-bold">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Project Info */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900 max-w-xs truncate">
                {title}
              </h1>
              {isModified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleStar}
                className={`h-6 w-6 p-0 ${
                  isStarred
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-gray-400 hover:text-yellow-500"
                }`}
                title={isStarred ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
              </Button>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Last saved {lastSavedText}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{collaboratorText}</span>
              </div>
              {showSaveIndicator && (
                <>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Saving...</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center Section - History Controls */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8 p-0 disabled:opacity-50"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8 p-0 disabled:opacity-50"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Save Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !isModified}
          className="h-9 px-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          title="Save (Ctrl+S)"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>

        {/* Share Button */}
        <DropdownMenu open={isShareMenuOpen} onOpenChange={setIsShareMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-gray-600 hover:bg-gray-100"
              title="Share (Ctrl+K)"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Present Button */}
        <Button
          size="sm"
          onClick={onPresent}
          className="h-9 bg-blue-600 hover:bg-blue-700 text-white px-4 font-medium shadow-sm"
          title="Present (Ctrl+Enter)"
        >
          <Play className="h-4 w-4 mr-2 fill-current" />
          Present
        </Button>

        <div className="w-px h-6 bg-gray-200" />

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100"
              title="More options"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Card
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collaborator Avatars */}
      {collaborators.length > 0 && (
        <div className="flex items-center gap-1 ml-4">
          {collaborators.slice(0, 3).map((collaborator) => (
            <div
              key={collaborator.id}
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white shadow-sm"
              title={collaborator.name}
            >
              {collaborator.avatar ? (
                <img 
                  src={collaborator.avatar} 
                  alt={collaborator.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                collaborator.name.charAt(0).toUpperCase()
              )}
            </div>
          ))}
          {collaborators.length > 3 && (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white shadow-sm">
              +{collaborators.length - 3}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
