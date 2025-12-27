"use client";

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chat-store';
import { MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Sidebar({ className }: { className?: string }) {
    const { chats, currentChatId, createChat, selectChat, deleteChat, updateChatTitle } = useChatStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleNewChat = () => createChat();

    const startEditing = (e: React.MouseEvent, chat: { id: string, title: string }) => {
        e.stopPropagation();
        setEditingId(chat.id);
        setEditValue(chat.title);
    };

    const saveTitle = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (editingId && editValue.trim()) {
            updateChatTitle(editingId, editValue.trim());
        }
        setEditingId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') saveTitle();
        if (e.key === 'Escape') setEditingId(null);
    };

    return (
        <div className={cn("flex flex-col h-full border-r bg-muted/20", className)}>
            <div className="p-4">
                <Button onClick={handleNewChat} className="w-full justify-start gap-2 shadow-sm" size="lg">
                    <Plus className="w-4 h-4" />
                    New Chat
                </Button>
            </div>

            <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Recent Chats
                </h3>
            </div>

            <ScrollArea className="flex-1 px-3">
                <div className="space-y-1">
                    {chats.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground p-8">
                            No chats yet.
                        </div>
                    )}

                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={cn(
                                "group flex items-center gap-2 p-2.5 rounded-md cursor-pointer transition-all text-sm",
                                currentChatId === chat.id
                                    ? "bg-slate-200 dark:bg-slate-800 font-medium text-foreground"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                            onClick={() => selectChat(chat.id)}
                        >
                            <MessageSquare className="w-4 h-4 shrink-0" />

                            {editingId === chat.id ? (
                                <input
                                    autoFocus
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => saveTitle()}
                                    onKeyDown={handleKeyDown}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 bg-background border rounded px-1 min-w-0"
                                />
                            ) : (
                                <span className="truncate flex-1">{chat.title || 'New Chat'}</span>
                            )}

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"
                                    onClick={(e) => startEditing(e, chat as any)}
                                    title="Rename"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    className="p-1 hover:bg-background rounded text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                    title="Delete"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
