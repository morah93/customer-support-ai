import { NextResponse } from "next/server"; // Import NextResponse from Next.js for handling responses
import OpenAI from "openai"; // Import OpenAI library for interacting with the OpenAI API



// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a highly intelligent and helpful AI assistant. Your primary goal is to assist the user by providing accurate, clear, and concise responses. You should aim to be informative, polite, and respectful in all interactions. Avoid giving personal opinions, and focus on providing factual information or guidance. If the user asks for something that might be unethical, illegal, or harmful, politely decline and offer safer alternatives or explain why you cannot fulfill the request.

When answering technical questions, be precise and provide examples or code snippets when necessary. For creative tasks, offer imaginative and thoughtful suggestions. If you don't have enough information to provide a complete answer, ask the user for clarification. Always keep your responses on topic and relevant to the user's request.
`; // Use your own system prompt here



// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  // const openai = new OpenAI({
  //   baseURL: "https://openrouter.ai/api/v1",
  //   apiKey: OPENROUTER_API_KEY,
  //   // defaultHeaders: {
  //   //   "HTTP-Referer": $YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
  //   //   "X-Title": $YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  //   // }
  // })
	const data = await req.json(); // Parse the JSON body of the incoming request

	// Create a chat completion request to the OpenAI API
	const completion = await openai.chat.completions.create({
		messages: [{ role: "system", content: systemPrompt }, ...data], // Include the system prompt and user messages
		model: "gpt-4o-mini", // Specify the model to use
		stream: true, // Enable streaming responses
	});

	// Create a ReadableStream to handle the streaming response
	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
			try {
				// Iterate over the streamed chunks of the response
				for await (const chunk of completion) {
					const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
					if (content) {
						const text = encoder.encode(content); // Encode the content to Uint8Array
						controller.enqueue(text); // Enqueue the encoded text to the stream
					}
				}
			} catch (err) {
				controller.error(err); // Handle any errors that occur during streaming
			} finally {
				controller.close(); // Close the stream when done
			}
		},
	});

	return new NextResponse(stream); // Return the stream as the response
}
