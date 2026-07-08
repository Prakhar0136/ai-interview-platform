import { ChatGroq } from "@langchain/groq";

// This initializes the connection to Groq using the API key from .env.local
export const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2, // Low temperature for focused, logical, and consistent responses
});