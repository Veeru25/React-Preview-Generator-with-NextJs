import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
    try {
        const { message, history } = await req.json();

        const genAI = new GoogleGenerativeAI(process.env.API_KEY_4);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction:
                "Use the React function 'App' without any import or export statements, and ensure all styles are defined inline",
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(`${message} `);

        return new Response(
            JSON.stringify({ message: result.response.text() }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process the request' , message : "Failed to fetch the data. Please try again." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}