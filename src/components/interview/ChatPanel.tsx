"use client";

import { useState } from "react";
import {
    Send,
    Loader2,
    Bot,
    User,
} from "lucide-react";

type Message = {
    role: "user" | "ai";
    content: string;
};

interface ChatPanelProps {
    currentCode: string;
}

export default function ChatPanel({
    currentCode,
}: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            content:
                "Hello! I'm your AI interviewer. Let's begin your technical interview whenever you're ready.",
        },
    ]);

    const [input, setInput] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [
            ...messages,
            {
                role: "user" as const,
                content: input,
            },
        ];

        setMessages(newMessages);

        setInput("");

        setIsLoading(true);

        try {
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: input,
                    candidateCode: currentCode,
                    previousMessages: messages,
                }),
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: data.response,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content:
                        "Unable to connect to the interviewer.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#141415] rounded-l-lg overflow-hidden">

            {/* Header */}

            <div className="h-14 border-b border-white/[0.06] bg-[#141415] px-5 flex items-center justify-between shrink-0">

                <div className="flex items-center gap-3">

                    <div className="relative h-9 w-9 rounded-full border border-white/10 bg-[#1A1B1D] flex items-center justify-center">
                        <Bot size={16} className="text-[#EDEDED]" />

                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#141415]" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[#EDEDED]">
                            AI Interviewer
                        </p>

                        <p className="text-[11px] text-emerald-500/90 tracking-wide">
                            Online
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-[#141415]">

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-2.5 ${msg.role === "user"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        {msg.role === "ai" && (
                            <div className="h-7 w-7 rounded-full border border-white/10 bg-[#1A1B1D] flex items-center justify-center shrink-0 mt-0.5">
                                <Bot size={13} className="text-[#8A8A8E]" />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-[13.5px] leading-relaxed ${msg.role === "user"
                                ? "bg-[#1E1B16] border border-[#E8A33D]/25 text-[#F2E9DC] rounded-br-sm"
                                : "bg-[#1A1B1D] text-[#D4D4D6] border border-white/[0.05] rounded-bl-sm"
                                }`}
                        >
                            {msg.content}
                        </div>

                        {msg.role === "user" && (
                            <div className="h-7 w-7 rounded-full border border-white/10 bg-[#1A1B1D] flex items-center justify-center shrink-0 mt-0.5">
                                <User size={13} className="text-[#8A8A8E]" />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-2.5">

                        <div className="h-7 w-7 rounded-full border border-white/10 bg-[#1A1B1D] flex items-center justify-center shrink-0">
                            <Bot size={13} className="text-[#8A8A8E]" />
                        </div>

                        <div className="bg-[#1A1B1D] rounded-xl px-4 py-2.5 border border-white/[0.05] flex items-center gap-2.5">

                            <Loader2 className="animate-spin h-3.5 w-3.5 text-[#8A8A8E]" />

                            <span className="text-[13px] text-[#8A8A8E]">
                                Thinking...
                            </span>

                        </div>
                    </div>
                )}
            </div>

            {/* Input */}

            <div className="border-t border-white/[0.06] bg-[#141415] p-4 shrink-0">

                <div className="flex items-center gap-2 rounded-lg bg-[#1A1B1D] border border-white/[0.08] px-3 py-2 focus-within:border-white/20 transition-colors">

                    <input
                        value={input}
                        disabled={isLoading}
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            !isLoading &&
                            sendMessage()
                        }
                        placeholder="Reply to interviewer..."
                        className="flex-1 bg-transparent outline-none text-[13.5px] text-[#EDEDED] placeholder:text-[#5C5C60]"
                    />

                    <button
                        disabled={!input.trim() || isLoading}
                        onClick={sendMessage}
                        aria-label="Send message"
                        className="h-8 w-8 rounded-md bg-[#E8A33D] text-[#141415] flex items-center justify-center hover:bg-[#F0AE4C] transition-colors disabled:opacity-30 disabled:hover:bg-[#E8A33D]"
                    >
                        <Send size={15} />
                    </button>

                </div>

            </div>
        </div>
    );
}