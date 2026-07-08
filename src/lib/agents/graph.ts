import { StateGraph, START, END } from "@langchain/langgraph";
import { InterviewState } from "./state";
import { evaluateCandidate } from "./evaluator";
import { interviewCandidate } from "./interviewer";
import { summarizeConversation } from "./summarizer";

// Define the flow: START -> Summarizer -> Evaluator -> Interviewer -> END
const workflow = new StateGraph(InterviewState)
    .addNode("summarizer", summarizeConversation)
    .addNode("evaluator", evaluateCandidate)
    .addNode("interviewer", interviewCandidate)

    // Create the exact path the data will take
    .addEdge(START, "summarizer")
    .addEdge("summarizer", "evaluator")
    .addEdge("evaluator", "interviewer")
    .addEdge("interviewer", END);

// Compile the graph into a runnable executable
export const interviewGraph = workflow.compile();