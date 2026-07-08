import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "./llm";
import { InterviewState } from "./state";

export const summarizeConversation = async (state: typeof InterviewState.State) => {
    const { messages } = state;

    // Only summarize if the conversation is getting long
    if (messages.length < 6) return { messages: [] };

    const systemPrompt = `
You are summarizing an ongoing technical coding interview.

Create a concise summary that preserves all important context needed to continue the interview naturally.

Include:
- Problem(s) discussed
- Questions asked by the interviewer
- Candidate's key answers and reasoning
- Current progress toward the solution
- Important mistakes, misconceptions, or bugs
- Strengths demonstrated
- Remaining topics or edge cases still worth exploring

Do NOT include greetings, small talk, or repeated information.
Do NOT invent information.
Do NOT evaluate beyond what was actually discussed.

Write the summary as short bullet points (6-10 bullets, under 180 words).
`;

    const summary = await llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(messages.map(m => m.content).join("\n"))
    ]);

    // Return a new state replacing the old history with a summary message
    return { messages: [new SystemMessage(`Conversation Summary: ${summary.content}`)] };
};