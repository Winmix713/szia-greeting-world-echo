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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdatePresentation } from "@/hooks/use-presentation";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { Presentation } from "@shared/schema";

interface EditorHeaderProps {
  presentation?: Presentation | null;
  presentationId?: number;
  showCollaborators?: boolean;
  autoSaveEnabled?: boolean;
  onBack?: () => void;
  customActions?: React.ReactNode;
  onPresentationChange?: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  presentation,
  presentationId,
  showCollaborators = true,
  autoSaveEnabled = true,
  onBack,
  customActions,
  onPresentationChange,
}) => {
  const updatePresentation = useUpdatePresentation();
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isStarred, setIsStarred] = useState(presentation?.isStarred || false);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && presentationId) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, presentationId, autoSaveEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "Enter":
            e.preventDefault();
            handlePresent();
            break;
          case "k":
            e.preventDefault();
            handleShare();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track changes
  useEffect(() => {
    if (onPresentationChange) {
      setHasUnsavedChanges(true);
    }
  }, [presentation?.title, presentation?.content, onPresentationChange]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      // Fallback navigation
      window.history.back();
    }
  }, [onBack]);

  const handleSave = useCallback(() => {
    if (!presentationId) {
      toast({
        title: "Error",
        description: "No presentation ID available",
        variant: "destructive",
      });
      return;
    }

    updatePresentation.mutate(
      { id: presentationId, data: {} },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          toast({
            title: "Saved",
            description: "Presentation saved successfully",
          });
        },
        onError: (error) => {
          console.error("Save error:", error);
          toast({
            title: "Error",
            description: "Failed to save presentation",
            variant: "destructive",
          });
        },
      },
    );
  }, [presentationId, updatePresentation, toast]);

  const handleShare = useCallback(async () => {
    if (!presentation) {
      toast({
        title: "Error",
        description: "No presentation to share",
        variant: "destructive",
      });
      return;
    }

    try {
      if (navigator.share && "share" in navigator) {
        await navigator.share({
          title: presentation.title || "Untitled Presentation",
          text: "Check out this presentation",
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Presentation link copied to clipboard",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Share Failed",
          description: "Unable to share presentation",
          variant: "destructive",
        });
      }
    }
  }, [presentation, toast]);

  const handlePresent = useCallback(() => {
    if (!presentationId) {
      toast({
        title: "Error",
        description: "No presentation available",
        variant: "destructive",
      });
      return;
    }

    // Open presentation in fullscreen mode
    const presentUrl = `/presentation/${presentationId}/present`;
    window.open(presentUrl, "_blank");
  }, [presentationId, toast]);

  const handleDownload = useCallback(async () => {
    if (!presentation) {
      toast({
        title: "Error",
        description: "No presentation to download",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create and download presentation file
      const dataStr = JSON.stringify(presentation, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${presentation.title || "presentation"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: "Presentation downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download presentation",
        variant: "destructive",
      });
    }
  }, [presentation, toast]);

  const handleToggleStar = useCallback(() => {
    if (!presentationId) return;

    const newStarredState = !isStarred;
    setIsStarred(newStarredState);

    // Update presentation with starred state
    updatePresentation.mutate(
      { id: presentationId, data: { isStarred: newStarredState } },
      {
        onError: () => {
          // Revert on error
          setIsStarred(!newStarredState);
          toast({
            title: "Error",
            description: "Failed to update star status",
            variant: "destructive",
          });
        },
      },
    );
  }, [presentationId, isStarred, updatePresentation, toast]);

  // Format last edited time
  const lastEditedText = presentation?.updatedAt
    ? formatDistanceToNow(new Date(presentation.updatedAt), { addSuffix: true })
    : "Never";

  // Determine collaborator text
  const collaboratorText = showCollaborators
    ? presentation?.collaborators?.length
      ? `${presentation.collaborators.length + 1} collaborators`
      : "Only you"
    : "Only you";

  return (
    <header
      className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm"
      role="banner"
      aria-label="Presentation editor header"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
          title="Back to presentations (Alt+←)"
          aria-label="Go back to presentations list"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span
              className="text-white text-sm font-semibold"
              aria-hidden="true"
            >
              {presentation?.title?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 max-w-xs truncate">
              {presentation?.title || "Untitled Presentation"}
              {hasUnsavedChanges && (
                <span className="text-orange-500 ml-1">•</span>
              )}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>Last edited {lastEditedText}</span>
              {showCollaborators && (
                <>
                  <span aria-hidden="true">•</span>
                  <Users className="h-3 w-3" aria-hidden="true" />
                  <span>{collaboratorText}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleStar}
          className={`h-8 text-sm px-3 ${
            isStarred
              ? "text-yellow-600 hover:bg-yellow-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          title={isStarred ? "Remove from starred" : "Add to starred"}
          aria-label={
            isStarred
              ? "Remove from starred presentations"
              : "Add to starred presentations"
          }
        >
          <Star
            className={`h-3.5 w-3.5 mr-1.5 ${isStarred ? "fill-current" : ""}`}
          />
          {isStarred ? "Starred" : "Star"}
        </Button>
        {customActions}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={updatePresentation.isPending || !hasUnsavedChanges}
          className="h-8 text-sm text-gray-600 hover:bg-gray-100 px-3"
          title="Save presentation (Ctrl+S)"
          aria-label="Save presentation"
        >
          {updatePresentation.isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-8 text-sm text-gray-600 hover:bg-gray-100 px-3"
          title="Share presentation (Ctrl+K)"
          aria-label="Share presentation"
        >
          <Share className="h-3.5 w-3.5 mr-1.5" />
          Share
        </Button>

        <Button
          size="sm"
          onClick={handlePresent}
          className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-4 font-medium"
          title="Start presentation (Ctrl+Enter)"
          aria-label="Start presentation mode"
        >
          <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
          Present
        </Button>

        <div className="w-px h-6 bg-gray-200 mx-1" role="separator" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
          title="Download presentation"
          aria-label="Download presentation"
        >
          <Download className="h-3.5 w-3.5 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
          title="More options"
          aria-label="More options"
        >
          <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
        </Button>
      </div>
    </header>
  );
};

export default React.memo(EditorHeader, (prevProps, nextProps) => {
  return (
    prevProps.presentationId === nextProps.presentationId &&
    prevProps.presentation?.title === nextProps.presentation?.title &&
    prevProps.presentation?.updatedAt === nextProps.presentation?.updatedAt &&
    prevProps.presentation?.isStarred === nextProps.presentation?.isStarred
  );
});
