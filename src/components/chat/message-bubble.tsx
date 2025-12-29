import { Message } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            toast.success("Message copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy message");
            console.error("Copy failed", err);
        }
    };

    return (
        <div className={cn("flex w-full gap-4 p-4 group", isUser ? "flex-row-reverse" : "flex-row")}>
            <Avatar className={cn("h-8 w-8 shrink-0", isUser ? "bg-primary" : "bg-muted")}>
                <AvatarFallback className={isUser ? "text-primary-foreground" : "text-foreground"}>
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
            </Avatar>

            <div className={cn(
                "flex flex-col max-w-[80%]",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "rounded-2xl px-5 py-3 text-sm relative shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none [&_*]:text-primary-foreground"
                        : "bg-secondary/50 text-secondary-foreground rounded-tl-none border"
                )}>
                    <div className={cn(
                        "prose prose-sm break-words max-w-none",
                        isUser ? "" : "dark:prose-invert"
                    )}>
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                code: ({ className, children, ...props }: any) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match;

                                    if (isInline) {
                                        return <code className="bg-muted/50 px-1 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>;
                                    }

                                    return (
                                        <div className="relative group/code my-4 rounded-lg overflow-hidden border bg-muted/50">
                                            <div className="flex items-center justify-between px-3 py-2 bg-muted/80 border-b text-xs text-muted-foreground">
                                                <span>{match?.[1] || 'text'}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const codeText = String(children).replace(/\n$/, '');
                                                        navigator.clipboard.writeText(codeText);
                                                        toast.success("Code copied!");
                                                    }}
                                                    className="hover:text-foreground transition-colors"
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="p-4 overflow-x-auto">
                                                <code className={cn("text-xs font-mono", className)} {...props}>
                                                    {children}
                                                </code>
                                            </div>
                                        </div>
                                    );
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {!isUser && (
                        <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={handleCopy}
                            >
                                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </div>
                    )}
                </div>

                <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-50">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
