import { Terminal, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputConsoleProps {
  output: string;
  error?: string;
  isLoading: boolean;
  onClear?: () => void;
}

export function OutputConsole({ output, error, isLoading, onClear }: OutputConsoleProps) {
  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">Console Output</span>
        </div>
        {onClear && (output || error) && (
          <button 
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative flex-1 p-4 font-mono text-sm overflow-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Running script...</span>
          </div>
        ) : !output && !error ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 select-none">
            <Terminal className="w-12 h-12 mb-4 opacity-20" />
            <p>Ready to execute</p>
          </div>
        ) : (
          <div className="space-y-4">
            {output && (
              <pre className="whitespace-pre-wrap text-emerald-400 break-words leading-relaxed animate-in">
                {output}
              </pre>
            )}
            
            {error && (
              <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 animate-in">
                <div className="flex items-center gap-2 mb-2 text-red-300 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  Execution Error
                </div>
                <pre className="whitespace-pre-wrap text-sm break-words opacity-90 pl-6 border-l-2 border-red-500/30">
                  {error}
                </pre>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-muted-foreground/50">
              Process finished.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
