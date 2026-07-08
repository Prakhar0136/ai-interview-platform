"use client";

import Editor from "@monaco-editor/react";
import { FileCode2 } from "lucide-react";

interface EditorPanelProps {
    code: string;
    setCode: (val: string) => void;
}

export default function EditorPanel({
    code,
    setCode,
}: EditorPanelProps) {
    return (
        <div className="h-full flex flex-col bg-[#0F0F10] rounded-r-lg overflow-hidden">

            {/* Header */}
            <div className="h-14 px-5 flex items-center justify-between border-b border-white/[0.06] bg-[#141415] shrink-0">

                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-md border border-white/10 bg-[#1A1B1D] flex items-center justify-center">
                        <FileCode2 size={14} className="text-[#8A8A8E]" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[#EDEDED]">
                            Candidate Whiteboard
                        </p>

                        <p className="text-[11px] text-[#5C5C60] font-mono">
                            index.ts
                        </p>
                    </div>
                </div>

                <span className="text-[11px] text-[#5C5C60] font-mono tracking-wide uppercase">
                    Live
                </span>
            </div>

            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="typescript"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        fontSize: 15,
                        fontLigatures: true,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: "on",
                        padding: {
                            top: 20,
                        },
                    }}
                />
            </div>
        </div>
    );
}