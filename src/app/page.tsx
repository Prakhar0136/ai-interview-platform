"use client";

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import EditorPanel from "@/components/interview/EditorPanel";
import ChatPanel from "@/components/interview/ChatPanel";
import ReportDashboard from "@/components/interview/ReportDashboard";
import { Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export default function InterviewWorkspace() {
  const [view, setView] = useState<"workspace" | "dashboard">("workspace");
  const [code, setCode] = useState<string>("// Write your code here...\n");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "ai",
      content:
        "Hello! I am your AI interviewer. Let's begin the technical assessment. Are you ready?",
    },
  ]);

  const [report, setReport] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleEndInterview = async () => {
    // End speech synthesis if active
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }

    setIsGeneratingReport(true);

    try {
      const res = await fetch("/api/interview/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          candidateCode: code,
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setReport(data);
      setView("dashboard");
    } catch (error) {
      alert(
        "Error parsing report analytical metrics. Check system terminal logs."
      );
      console.error(error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleRestart = () => {
    setCode("// Write your code here...\n");

    setMessages([
      {
        id: crypto.randomUUID(),
        role: "ai",
        content:
          "Hello! I am your AI interviewer. Let's begin the technical assessment. Are you ready?",
      },
    ]);

    setReport(null);
    setView("workspace");
  };

  if (isGeneratingReport) {
    return (
      <div className="h-screen w-screen bg-black text-neutral-200 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />

        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-100">
            Compiling Code Metrics & Transcripts
          </h2>

          <p className="text-sm text-neutral-500 mt-1">
            Generating your Principal-level diagnostic evaluation report...
          </p>
        </div>
      </div>
    );
  }

  if (view === "dashboard" && report) {
    return (
      <ReportDashboard
        report={report}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-neutral-200 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="h-12 border-b border-neutral-800 bg-black flex items-center px-6">
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600">
          AI Interview Platform
        </h1>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 h-[calc(100vh-3rem)]">
        <PanelGroup direction="horizontal">
          {/* Left Panel: Code Editor */}
          <Panel defaultSize={65} minSize={30}>
            <EditorPanel
              code={code}
              setCode={setCode}
            />
          </Panel>

          {/* Resizer Handle */}
          <PanelResizeHandle className="w-2 bg-neutral-900 hover:bg-amber-500/70 transition-colors cursor-col-resize flex items-center justify-center">
            <div className="h-8 w-1 bg-neutral-700 rounded-full" />
          </PanelResizeHandle>

          {/* Right Panel: Chat Interface */}
          <Panel defaultSize={35} minSize={25}>
            <ChatPanel
              currentCode={code}
              messages={messages}
              setMessages={setMessages}
              onEndInterview={handleEndInterview}
            />
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}