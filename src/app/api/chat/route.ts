import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Upstage API Configuration
const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY; // Fallback for demo, should be in env
const UPSTAGE_API_URL = 'https://api.upstage.ai/v1/solar/chat/completions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, model } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages are required and must be an array' }, { status: 400 });
        }

        const payload = {
            model: model || 'solar-1-mini-chat',
            messages: messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content
            })),
            stream: true,
        };

        const response = await fetch(UPSTAGE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${UPSTAGE_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upstage API Error:', errorText);
            return NextResponse.json({ error: `Upstage API Error: ${response.statusText}`, details: errorText }, { status: response.status });
        }

        // Streaming response
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') continue;

                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices[0]?.delta?.content || '';
                                    if (content) {
                                        controller.enqueue(encoder.encode(content));
                                    }
                                } catch (e) {
                                    // Ignore parse errors for partial chunks
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Stream processing error:', error);
                    controller.error(error);
                } finally {
                    controller.close();
                }
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Route Handler Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
