import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "./llm";
import { InterviewState } from "./state";

export const summarizeConversation = async (state: typeof InterviewState.State) => {
    const { messages } = state;

    // Only summarize if the conversation is getting long
    if (messages.length < 6) return { messages: [] };

    const systemPrompt = `Summarize the technical interview conversation so far. Focus on what questions were asked and how the candidate performed.`;

    const summary = await llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(messages.map(m => m.content).join("\n"))
    ]);

    // Return a new state replacing the old history with a summary message
    return { messages: [new SystemMessage(`Conversation Summary: ${summary.content}`)] };
};