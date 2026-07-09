import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const reportLLM = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.1, // Low temperature for highly reliable objective analytics
});

export async function POST(req: NextRequest) {
    try {
        const { messages, candidateCode } = await req.json();

        const conversationHistory = messages
            .map((m: any) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
            .join("\n");

        const systemPrompt = `You are a Principal Engineering Assessor. Analyze the provided technical interview transcript and final code snippet.
    Generate a highly accurate, structured assessment report in strict JSON format. Do not include markdown wraps like \`\`\`json. Output ONLY the raw JSON string matching this exact schema:
    {
      "overallScore": 85, 
      "codeQualityScore": 80,
      "communicationScore": 90,
      "problemSolvingScore": 85,
      "summary": "Summary of candidate performance...",
      "strengths": ["Strength 1", "Strength 2"],
      "improvements": ["Improvement 1", "Improvement 2"],
      "codeReview": "Specific feedback regarding their final code submission."
    }`;

        const response = await reportLLM.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(`Final Candidate Code:\n${candidateCode}\n\nInterview Transcript:\n${conversationHistory}`)
        ]);

        // Parse text clean-up to ensure accurate JSON delivery
        const rawText = response.content as string;
        const jsonReport = JSON.parse(rawText.substring(rawText.indexOf("{"), rawText.lastIndexOf("}") + 1));

        return NextResponse.json(jsonReport);
    } catch (error) {
        console.error("Report Generation Error:", error);
        return NextResponse.json({ error: "Failed to compile assessment analytics." }, { status: 500 });
    }
}