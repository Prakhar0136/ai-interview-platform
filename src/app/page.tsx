"use client";

import { useState } from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

import EditorPanel from "@/components/interview/EditorPanel";
import ChatPanel from "@/components/interview/ChatPanel";

export default function InterviewWorkspace() {
  const [code, setCode] = useState(
    "// Write your solution here...\n"
  );

  return (
    <main className="h-screen bg-[#0D0D0E] text-[#EDEDED] overflow-hidden">

      {/* Navbar */}

      <header className="h-16 border-b border-white/6 bg-[#0D0D0E] flex items-center justify-between px-8">

        <div className="flex items-center gap-2.5">

          <span className="h-2 w-2 rounded-full bg-[#E8A33D]" />

          <h1 className="text-[15px] font-semibold tracking-tight text-[#EDEDED]">
            AI Interview Platform
          </h1>

        </div>

      </header>

      <div className="h-[calc(100vh-64px)] p-5">

        <PanelGroup
          direction="horizontal"
          className="h-full rounded-xl overflow-hidden border border-white/6"
        >

          <Panel
            defaultSize={65}
            minSize={30}
          >
            <EditorPanel
              code={code}
              setCode={setCode}
            />
          </Panel>

          <PanelResizeHandle className="w-px bg-white/6 hover:bg-[#E8A33D]/50 transition-colors relative group">

            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center">

              <div className="h-10 w-0.75 rounded-full bg-white/10 group-hover:bg-[#E8A33D] transition-colors" />

            </div>

          </PanelResizeHandle>

          <Panel
            defaultSize={35}
            minSize={25}
          >
            <ChatPanel currentCode={code} />
          </Panel>

        </PanelGroup>

      </div>
    </main>
  );
}