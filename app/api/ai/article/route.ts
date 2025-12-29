import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HF_API_KEY!;

export async function POST(req: Request) {
    const { content, type, question, history } = await req.json();

    const model = "meta-llama/Llama-3.2-3B-Instruct";

    const systemPrompt = "You are a helpful assistant that summarizes and explains blog posts clearly and concisely. You MUST provide ONLY the requested content without any introductory or concluding remarks (e.g., do NOT say 'Here is a summary' or 'I hope this helps'). Be direct.";

    let messages: any[] = [
        { role: "system", content: systemPrompt }
    ];

    if (type === "ask") {
        // Provide article context first
        messages.push({
            role: "user",
            content: `Context Article:\n${content}\n\nPlease answer my questions based strictly on this article.`
        });
        messages.push({
            role: "assistant",
            content: "I have processed the article and I'm ready to answer any questions you have about it."
        });

        // Add conversation history
        if (history && Array.isArray(history)) {
            messages.push(...history);
        }

        // Add the current question
        messages.push({
            role: "user",
            content: question
        });
    } else {
        let userPrompt = "";
        if (type === "summary") {
            userPrompt = `Please provide a concise, engaging 3-4 sentence summary of the following article. Respond with the summary only, do not include any introductory phrases:\n\n${content}`;
        } else if (type === "explain") {
            userPrompt = `Please explain the key concepts of this article in very simple, easy-to-understand terms for a non-technical reader. Respond with the explanation only, do not include any introductory phrases:\n\n${content}`;
        } else if (type === "takeaways") {
            userPrompt = `Please extract the most important 3-5 key takeaways from this article as a bulleted list. Respond with the list only, do not include any introductory phrases:\n\n${content}`;
        }

        messages.push({
            role: "user",
            content: userPrompt
        });
    }

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            }
        );

        let data: any;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const raw = await response.text();
            console.error("HF Non-JSON Response:", raw);
            return NextResponse.json({ text: `AI Error: Server returned non-JSON response (${response.status})` });
        }

        console.log("HF API Debug:", { model, status: response.status, data });

        if (!response.ok) {
            return NextResponse.json({ text: `AI Error: ${data?.error?.message || data?.error || "Inference failed"}` });
        }

        // Extract text from OpenAI-compatible chat completion response
        const text = data?.choices?.[0]?.message?.content || "AI could not generate a response.";

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("AI Route Error:", error);
        return NextResponse.json({ text: `AI Route Error: ${error.message}` });
    }
}
