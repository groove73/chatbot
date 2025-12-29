import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/types/chat';

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

        const selectedModel = model || 'solar-1-mini-chat';
        const isGemini = selectedModel.startsWith('gemini');

        if (isGemini) {
            const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
            const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:streamGenerateContent?key=${GOOGLE_API_KEY}`;

            const geminiContents = messages.map((msg: Message) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: geminiContents })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API Error:', errorText);
                return NextResponse.json({ error: `Gemini API Error: ${response.statusText}`, details: errorText }, { status: response.status });
            }

            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            const stream = new ReadableStream({
                async start(controller) {
                    const reader = response.body?.getReader();
                    if (!reader) { controller.close(); return; }

                    try {
                        let buffer = '';
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value, { stream: true });
                            buffer += chunk;

                            // Process buffer to find complete JSON objects
                            let startIndex = 0;
                            let braceCount = 0;
                            let inString = false;
                            let escape = false;

                            // Iterate through buffer to find matching braces
                            for (let i = 0; i < buffer.length; i++) {
                                const char = buffer[i];

                                if (escape) {
                                    escape = false;
                                    continue;
                                }

                                if (char === '\\') {
                                    escape = true;
                                    continue;
                                }

                                if (char === '"') {
                                    inString = !inString;
                                    continue;
                                }

                                if (!inString) {
                                    if (char === '{') {
                                        if (braceCount === 0) startIndex = i;
                                        braceCount++;
                                    } else if (char === '}') {
                                        braceCount--;
                                        if (braceCount === 0) {
                                            // Found a complete JSON object
                                            const jsonStr = buffer.substring(startIndex, i + 1);
                                            try {
                                                const parsed = JSON.parse(jsonStr);
                                                const parts = parsed.candidates?.[0]?.content?.parts;
                                                if (parts) {
                                                    for (const part of parts) {
                                                        if (part.text) {
                                                            controller.enqueue(encoder.encode(part.text));
                                                        }
                                                    }
                                                }
                                            } catch (e) {
                                                // Ignore parsing errors for partial/malformed chunks
                                            }

                                            // Update buffer: Remove processed part
                                            // Note: We modifying buffer inside loop, so we reset loop
                                            buffer = buffer.slice(i + 1);
                                            i = -1; // Reset to -1 so next increment makes it 0
                                            startIndex = 0;
                                        }
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

        } else {
            // Existing Upstage Logic
            const payload = {
                model: selectedModel,
                messages: messages.map((msg: Message) => ({
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

            // Reuse the existing streaming logic
            // ... (I need to include the existing logic in the replacement)
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
        }
    } catch (error) {
        console.error('Route Handler Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
