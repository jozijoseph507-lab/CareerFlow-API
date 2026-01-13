import { useSnippets, useDeleteSnippet } from "@/hooks/use-snippets";
import { Plus, Trash2, Code2, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  onSelect: (snippetId: number) => void;
  onNew: () => void;
  selectedId: number | null;
  className?: string;
}

export function Sidebar({ onSelect, onNew, selectedId, className }: SidebarProps) {
  const { data: snippets, isLoading } = useSnippets();
  const deleteSnippet = useDeleteSnippet();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await deleteSnippet.mutateAsync(id);
      toast({ title: "Deleted", description: "Snippet removed successfully." });
      if (selectedId === id) onNew();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete snippet." });
    }
  };

  const filteredSnippets = snippets?.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("flex flex-col h-full bg-secondary/30 border-r border-border backdrop-blur-xl", className)}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight">PyPlay</h1>
          </div>
        </div>

        <Button 
          onClick={onNew} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Snippet
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search snippets..." 
            className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Saved Snippets</h2>
      </div>

      <ScrollArea className="flex-1 px-2">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredSnippets?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Code2 className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">No snippets found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredSnippets?.map((snippet) => (
              <div
                key={snippet.id}
                onClick={() => onSelect(snippet.id)}
                className={cn(
                  "group relative p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md",
                  selectedId === snippet.id
                    ? "bg-primary/10 border-primary/30 shadow-sm"
                    : "bg-card/40 border-transparent hover:bg-card hover:border-border/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className={cn(
                      "font-medium truncate text-sm",
                      selectedId === snippet.id ? "text-primary" : "text-foreground"
                    )}>
                      {snippet.title}
                    </h3>
                    {snippet.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {format(new Date(snippet.createdAt), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  
                  {selectedId === snippet.id && (
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button
                         size="icon"
                         variant="ghost"
                         className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                         onClick={(e) => handleDelete(e, snippet.id)}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                  )}
                  
                  {selectedId === snippet.id && (
                    <ChevronRight className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
