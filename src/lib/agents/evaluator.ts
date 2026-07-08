import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "./llm";
import { InterviewState } from "./state";

export const evaluateCandidate = async (state: typeof InterviewState.State) => {
    const { messages, candidateCode } = state;
    const lastCandidateMessage = messages[messages.length - 1]?.content || "No message";

    const systemPrompt = `
You are an expert technical interviewer acting as a hidden evaluator.

Your analysis is PRIVATE and will only be used by another AI interviewer. Never write as if you are speaking to the candidate.

Analyze the candidate's latest message together with their current code.

Evaluate:
- Technical correctness
- Logical errors or bugs
- Missing edge cases
- Time and space complexity
- Code quality and readability
- Signs of misunderstanding
- Progress since the previous turn

If the solution is incomplete, infer what the candidate is trying to achieve.

Return a concise assessment using exactly this format:

Strengths:
- ...

Issues:
- ...

Suggested Next Direction:
- A single follow-up topic or question the interviewer should explore.

Keep the entire response under 120 words.
Do not write code.
Do not solve the problem.
Do not praise unnecessarily.
Only include information useful for guiding the interviewer.
`;
    const evaluatorResponse = await llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`Candidate Code:\n${candidateCode}\n\nCandidate Message:\n${lastCandidateMessage}`)
    ]);

    // We return the updated 'evaluation' state
    return { evaluation: evaluatorResponse.content as string };
};