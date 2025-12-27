import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';
import { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface InputAreaProps {
    onSend: (content: string) => void;
    isLoading: boolean;
}

export function InputArea({ onSend, isLoading }: InputAreaProps) {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    return (
        <div className="p-4 border-t bg-background">
            <div className="max-w-3xl mx-auto relative flex items-end gap-2">
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Send a message..."
                    className="min-h-[50px] resize-none pr-12 py-3"
                    rows={1}
                    disabled={isLoading}
                />
                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 h-8 w-8"
                >
                    <SendHorizontal className="h-4 w-4" />
                </Button>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-2">
                AI can make mistakes. Verify important information.
            </div>
        </div>
    );
}
