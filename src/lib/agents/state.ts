import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

// This schema defines what data the agents share.
export const InterviewState = Annotation.Root({
    // Stores the entire conversation history
    messages: Annotation<BaseMessage[]>({
        reducer: (currentState, newMessages) => currentState.concat(newMessages),
        default: () => [],
    }),
    // Stores the live code written by the candidate in the whiteboard
    candidateCode: Annotation<string>({
        reducer: (currentState, newCode) => newCode ?? currentState,
        default: () => "",
    }),
    // Secret notes from the Evaluator agent for the Interviewer
    evaluation: Annotation<string>({
        reducer: (currentState, newEval) => newEval ?? currentState,
        default: () => "",
    }),
});