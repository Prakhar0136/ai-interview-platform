"use client";

import { CheckCircle, AlertTriangle, Code2, Award, MessageSquare } from "lucide-react";

interface ReportDashboardProps {
    report: {
        overallScore: number;
        codeQualityScore: number;
        communicationScore: number;
        problemSolvingScore: number;
        summary: string;
        strengths: string[];
        improvements: string[];
        codeReview: string;
    };
    onRestart: () => void;
}

export default function ReportDashboard({ report, onRestart }: ReportDashboardProps) {
    const metrics = [
        { name: "Code Quality", score: report.codeQualityScore, icon: <Code2 className="text-amber-500" /> },
        { name: "Communication", score: report.communicationScore, icon: <MessageSquare className="text-neutral-400" /> },
        { name: "Problem Solving", score: report.problemSolvingScore, icon: <Award className="text-amber-500" /> },
    ];

    return (
        <div className="min-h-screen w-full bg-black text-neutral-200 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Summary Card */}
                <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100">Interview Evaluation Report</h1>
                        <p className="text-neutral-400 text-sm leading-relaxed">{report.summary}</p>
                    </div>
                    <div className="flex flex-col items-center bg-amber-500/10 border border-amber-500/30 p-6 rounded-xl w-40 h-40 justify-center shrink-0">
                        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Overall Score</span>
                        <span className="text-5xl font-black text-amber-400 mt-1">{report.overallScore}</span>
                        <span className="text-xs text-amber-500/80 mt-1">out of 100</span>
                    </div>
                </div>

                {/* Scoring Matrices Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {metrics.map((m, idx) => (
                        <div key={idx} className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-sm space-y-4">
                            <div className="flex items-center gap-2">
                                {m.icon}
                                <span className="font-bold text-neutral-300">{m.name}</span>
                            </div>
                            <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${m.score}%` }}
                                />
                            </div>
                            <div className="text-right text-sm font-black text-neutral-400">{m.score} / 100</div>
                        </div>
                    ))}
                </div>

                {/* Detailed Breakdown Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" /> Key Strengths
                        </h3>
                        <ul className="space-y-2">
                            {report.strengths.map((str, idx) => (
                                <li key={idx} className="text-sm text-neutral-300 bg-amber-500/5 border border-amber-500/20 px-3 py-2 rounded-md">
                                    {str}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" /> Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                            {report.improvements.map((imp, idx) => (
                                <li key={idx} className="text-sm text-neutral-300 bg-neutral-800/60 border border-neutral-700 px-3 py-2 rounded-md">
                                    {imp}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Code Review Panel */}
                <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 shadow-sm space-y-3">
                    <h3 className="text-lg font-bold text-neutral-200 flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-neutral-400" /> Deep-Dive Code Review
                    </h3>
                    <p className="text-sm text-neutral-300 leading-relaxed bg-black border border-neutral-800 p-4 rounded-lg font-mono whitespace-pre-wrap">
                        {report.codeReview}
                    </p>
                </div>

                {/* Bottom Actions Area */}
                <div className="flex justify-end">
                    <button
                        onClick={onRestart}
                        className="bg-amber-500 text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-sm"
                    >
                        Start a New Assessment
                    </button>
                </div>
            </div>
        </div>
    );
}