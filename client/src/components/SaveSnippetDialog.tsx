import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

interface SaveSnippetDialogProps {
  onSave: (title: string, description: string) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveSnippetDialog({ onSave, isOpen, onOpenChange }: SaveSnippetDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSaving(true);
    try {
      await onSave(title, description);
      setTitle("");
      setDescription("");
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Save Snippet</DialogTitle>
          <DialogDescription>
            Give your snippet a memorable name to find it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fibonacci Sequence"
              className="bg-background/50 border-white/10 focus:border-primary/50"
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-foreground">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of what this code does..."
              className="bg-background/50 border-white/10 focus:border-primary/50 resize-none h-24"
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!title || isSaving}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Snippet
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
