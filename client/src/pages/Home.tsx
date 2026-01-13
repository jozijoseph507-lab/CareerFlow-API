import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputConsole } from "@/components/OutputConsole";
import { SaveSnippetDialog } from "@/components/SaveSnippetDialog";
import { useSnippet, useCreateSnippet, useRunCode } from "@/hooks/use-snippets";
import { Button } from "@/components/ui/button";
import { Play, Save, Share2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const DEFAULT_CODE = `# Welcome to PyPlay
# Write your Python code here and click 'Run'

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
print(f"Python version: {3.11}")

# Try some math
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(f"Squares: {squares}")
`;

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const { data: selectedSnippet, isLoading: isLoadingSnippet } = useSnippet(selectedId);
  const createSnippet = useCreateSnippet();
  const runCode = useRunCode();
  const { toast } = useToast();

  // Update editor when snippet is loaded
  useEffect(() => {
    if (selectedSnippet) {
      setCode(selectedSnippet.code);
      setOutput("");
      setError(undefined);
    }
  }, [selectedSnippet]);

  const handleRun = async () => {
    setOutput("");
    setError(undefined);
    try {
      const result = await runCode.mutateAsync(code);
      setOutput(result.output);
      setError(result.error);
    } catch (err) {
      setError("Failed to connect to execution server. Please try again.");
    }
  };

  const handleSave = async (title: string, description: string) => {
    try {
      const newSnippet = await createSnippet.mutateAsync({
        title,
        description,
        code,
      });
      setSelectedId(newSnippet.id);
      toast({
        title: "Success",
        description: "Snippet saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save snippet.",
      });
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setCode(DEFAULT_CODE);
    setOutput("");
    setError(undefined);
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <div 
        className={cn(
          "fixed md:relative z-50 h-full transition-all duration-300 ease-in-out border-r border-border shadow-2xl md:shadow-none",
          isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-0 md:w-0 md:border-none"
        )}
      >
        <Sidebar 
          onSelect={(id) => {
            setSelectedId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onNew={handleNew}
          selectedId={selectedId}
          className="h-full w-72"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Navigation Bar */}
        <header className="h-14 border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-4 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </Button>
            
            {selectedSnippet ? (
              <div className="flex flex-col">
                <span className="text-sm font-medium animate-in">{selectedSnippet.title}</span>
                {isLoadingSnippet && <span className="text-xs text-muted-foreground">Loading...</span>}
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground italic">Unsaved Scratchpad</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaveDialogOpen(true)}
              className="hidden sm:flex border-white/10 hover:bg-white/5 hover:text-primary transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button
              size="sm"
              onClick={handleRun}
              disabled={runCode.isPending}
              className={cn(
                "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all",
                runCode.isPending && "opacity-80 cursor-not-allowed"
              )}
            >
              {runCode.isPending ? (
                <>Running...</>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Resizable Layout: Editor | Console */}
        <div className="flex-1 overflow-hidden p-2 md:p-4">
          <ResizablePanelGroup direction="horizontal" className="rounded-xl border border-white/5 bg-card shadow-2xl overflow-hidden">
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="px-4 py-2 bg-[#1e1e1e] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="ml-2 text-xs text-muted-foreground font-mono">main.py</span>
                  </div>
                  <span className="text-xs text-muted-foreground/50">Python 3.11</span>
                </div>
                <div className="flex-1 relative">
                  <CodeEditor 
                    value={code} 
                    onChange={(val) => setCode(val || "")} 
                  />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle className="bg-border w-1.5 hover:w-2 hover:bg-primary/50 transition-all" />
            
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="h-full p-0">
                <OutputConsole 
                  output={output} 
                  error={error} 
                  isLoading={runCode.isPending} 
                  onClear={() => { setOutput(""); setError(undefined); }}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <SaveSnippetDialog 
        isOpen={isSaveDialogOpen} 
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
