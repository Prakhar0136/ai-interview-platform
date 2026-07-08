"use client";

import { useState, useEffect, useRef } from "react";
import {
    Send,
    Loader2,
    Bot,
    User,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
} from "lucide-react";

type Message = {
    id: string;
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
            id: crypto.randomUUID(),
            role: "ai",
            content:
                "Hello! I'm your AI interviewer. Let's begin your technical interview whenever you're ready.",
        },
    ]);

    const [input, setInput] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isTtsEnabled, setIsTtsEnabled] = useState(true);

    const recognitionRef = useRef<any>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const voicesLoadedRef = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isLoading]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
            let finalTranscript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {
                if (event.results[i].isFinal) {
                    finalTranscript +=
                        event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                setInput((prev) =>
                    prev +
                    (prev && !prev.endsWith(" ") ? " " : "") +
                    finalTranscript
                );
            }
        };

        recognition.onerror = (event: any) => {
            console.log("Speech Recognition Error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const loadVoices = () => {
            window.speechSynthesis.getVoices();
            voicesLoadedRef.current = true;
        };

        loadVoices();
        window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

        return () => {
            recognitionRef.current?.stop?.();
            abortControllerRef.current?.abort();
            window.speechSynthesis.cancel();
            window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
        };
    }, []);

    const speakText = (text: string) => {
        if (!isTtsEnabled) return;
        if (typeof window === "undefined") return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
            text.replace(/[*#`_]/g, "")
        );

        const voices =
            window.speechSynthesis.getVoices();

        const preferred =
            voices.find(
                (v) =>
                    v.lang.includes("en-US") &&
                    v.name.includes("Google")
            ) || voices[0];

        if (preferred) utterance.voice = preferred;

        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        const last = messages[messages.length - 1];

        if (last?.role === "ai") {
            speakText(last.content);
        }
    }, [messages]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert(
                "Speech Recognition isn't supported in this browser."
            );
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const sendMessage = async () => {
        if (isLoading) return;
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
        if (!input.trim()) return;

        // Append the new user message with a unique ID
        const newMessages: Message[] = [
            ...messages,
            {
                id: crypto.randomUUID(),
                role: "user",
                content: input,
            },
        ];

        setMessages(newMessages);

        setInput("");

        setIsLoading(true);

        try {
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: abortControllerRef.current.signal,
                body: JSON.stringify({
                    message: input,
                    candidateCode: currentCode,
                    previousMessages: newMessages,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (!data?.response) throw new Error("Invalid response");

            if (data.error) throw new Error(data.error);

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "ai",
                    content: data.response,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
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

                <button
                    onClick={() => {
                        const next = !isTtsEnabled;

                        setIsTtsEnabled(next);

                        if (!next)
                            window.speechSynthesis.cancel();
                    }}
                    className="h-8 w-8 rounded-md bg-[#1A1B1D] border border-white/10 flex items-center justify-center hover:border-white/20 transition"
                >
                    {isTtsEnabled ? (
                        <Volume2
                            size={16}
                            className="text-[#EDEDED]"
                        />
                    ) : (
                        <VolumeX
                            size={16}
                            className="text-[#666]"
                        />
                    )}
                </button>

            </div>
            {/* Messages */}

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-[#141415]">

                {messages.map((msg, idx) => (
                    <div
                        key={msg.id}
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
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}

            <div className="border-t border-white/[0.06] bg-[#141415] p-4 shrink-0">

                <div className="flex items-center gap-2 rounded-lg bg-[#1A1B1D] border border-white/[0.08] px-3 py-2 focus-within:border-white/20 transition-colors">

                    <button
                        onClick={toggleListening}
                        disabled={isLoading}
                        className={`h-8 w-8 rounded-md flex items-center justify-center transition ${isListening
                            ? "bg-red-500 text-white animate-pulse"
                            : "text-[#8A8A8E] hover:bg-white/5"
                            }`}
                    >
                        {isListening ? (
                            <MicOff size={15} />
                        ) : (
                            <Mic size={15} />
                        )}
                    </button>

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
                        placeholder={
                            isListening
                                ? "Listening..."
                                : "Reply to interviewer..."
                        }
                        className="flex-1 bg-transparent outline-none text-[13.5px] text-[#EDEDED] placeholder:text-[#5C5C60]"
                    />

                    <button
                        disabled={!input.trim() || isLoading}
                        onClick={sendMessage}
                        className="h-8 w-8 rounded-md bg-[#E8A33D] text-[#141415] flex items-center justify-center hover:bg-[#F0AE4C] transition disabled:opacity-30"
                    >
                        <Send size={15} />
                    </button>

                </div>

            </div>
        </div>
    );
}