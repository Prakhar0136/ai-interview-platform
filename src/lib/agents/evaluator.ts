import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "./llm";
import { InterviewState } from "./state";

export const evaluateCandidate = async (state: typeof InterviewState.State) => {
    const { messages, candidateCode } = state;
    const lastCandidateMessage = messages[messages.length - 1]?.content || "No message";

    const systemPrompt = `You are a strict technical evaluator. Analyze the candidate's code and recent message.
  Identify bugs, inefficiencies, or logical errors. Do NOT speak to the candidate. 
  Output ONLY a brief technical assessment to guide the Interviewer agent.`;

    const evaluatorResponse = await llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`Candidate Code:\n${candidateCode}\n\nCandidate Message:\n${lastCandidateMessage}`)
    ]);

    // We return the updated 'evaluation' state
    return { evaluation: evaluatorResponse.content as string };
};