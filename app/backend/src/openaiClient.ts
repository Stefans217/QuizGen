/**
 * This code initializes and exports an instance of the OpenAI client configured with the API key.
 * 
 * Functionality:
 * - Imports the OpenAI library and creates an instance of the OpenAI client.
 * - The `apiKey` is loaded from the environment variable `OPENAI_API_KEY` for secure access.
 * - The configured OpenAI instance is exported as the default export, enabling it to be reused
 *   across other parts of the application for interacting with OpenAI's API.
 * 
 */


import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable.");
  throw new Error("Failed to initialize OpenAI client. Please set OPENAI_API_KEY.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;