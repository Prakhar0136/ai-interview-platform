import { SystemMessage } from "@langchain/core/messages";
import { llm } from "./llm";
import { InterviewState } from "./state";

export const interviewCandidate = async (state: typeof InterviewState.State) => {
    const { messages, evaluation, candidateCode } = state;

    const systemPrompt = `You are a friendly but professional technical interviewer.
  Use the following hidden evaluation from the background evaluator to guide the candidate:
  HIDDEN EVALUATION: ${evaluation}
  
  CURRENT CANDIDATE CODE:
  ${candidateCode}
  
  Do not mention the "evaluator". Ask a follow-up question, provide a gentle hint if they are stuck, or validate their correct answer. Keep responses concise.`;

    const response = await llm.invoke([
        new SystemMessage(systemPrompt),
        ...messages // Inject the whole conversation history
    ]);

    // We return the new message to be appended to the state
    return { messages: [response] };
};