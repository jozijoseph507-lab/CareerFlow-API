import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme"; // Assuming standard theme hook or just use dark mode default

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="h-full w-full bg-[#1e1e1e] rounded-b-xl overflow-hidden shadow-inner border-t border-white/5">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={value}
        onChange={onChange}
        theme="vs-dark"
        loading={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-mono">Initializing editor...</span>
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "all",
          contextmenu: true,
        }}
      />
    </div>
  );
}
