import { ChatGroq } from "@langchain/groq";

// This initializes the connection to Groq using the API key from .env.local
export const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-70b-8192",
    temperature: 0.2, // Low temperature for focused, logical, and consistent responses
});