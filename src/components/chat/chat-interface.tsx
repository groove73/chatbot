"use client";

import { useChatStore } from '@/store/chat-store';
import { MessageBubble } from './message-bubble';
import { InputArea } from './input-area';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';

export function ChatInterface() {
    const { messages, isLoading, addMessage, setLoading, currentChatId, updateMessageContent, createChat, selectedModel, setModel } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (content: string) => {
        let activeChatId = currentChatId;
        if (!activeChatId) {
            activeChatId = createChat();
        }

        const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content,
            createdAt: Date.now(),
        };
        addMessage(userMessage);

        setLoading(true);

        // Create placeholder for assistant response
        const assistantMessageId = uuidv4();
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            createdAt: Date.now(),
        };
        addMessage(assistantMessage);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
                    model: selectedModel
                })
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                updateMessageContent(assistantMessageId, chunk);
            }

        } catch (error) {
            console.error(error);
            updateMessageContent(assistantMessageId, "\n\nError: Failed to generate response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-background/50 backdrop-blur top-0 z-10">
                <div className="text-sm font-medium">Model</div>
                <select
                    className="text-sm border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedModel}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="solar-1-mini-chat">Upstage Solar</option>
                    <option value="gemini-3-flash-preview">Google Gemini 3.0 Flash</option>
                </select>
            </div>
            <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full w-full" ref={scrollRef}>
                    <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto h-full min-h-[calc(100vh-140px)]" ref={viewportRef}>
                        {messages.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground h-full flex-col mt-10 p-4">
                                <div className="text-center space-y-4 max-w-lg">
                                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome to AI Assist</h2>
                                    <p className="text-muted-foreground">
                                        I can help you create marketing content, analyze strategies, or brainstorm ideas.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 text-left">
                                        {[
                                            "Write a blog post about AI trends",
                                            "Draft a cold email for B2B sales",
                                            "Create 5 Instagram captions for...",
                                            "Analyze this marketing funnel..."
                                        ].map((prompt) => (
                                            <button
                                                key={prompt}
                                                onClick={() => handleSend(prompt)}
                                                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-sm text-foreground shadow-sm hover:shadow"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))
                        )}
                        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                            <div className="flex items-center gap-2 p-4 animate-in fade-in duration-300">
                                <div className="flex gap-1 h-2 items-center">
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                </div>
                                <span className="text-xs text-muted-foreground">AI is thinking...</span>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
            <InputArea onSend={handleSend} isLoading={isLoading} />
        </div>
    );
}
