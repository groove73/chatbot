export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: number;
}

export interface ChatSession {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
}

export interface ChatState {
    chats: ChatSession[];
    currentChatId: string | null;
    messages: Message[];
    isLoading: boolean;
    chatMessages: Record<string, Message[]>;

    // Actions
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    setLoading: (isLoading: boolean) => void;
    createChat: () => string;
    selectChat: (chatId: string) => void;
    deleteChat: (chatId: string) => void;
    updateChatTitle: (chatId: string, title: string) => void;
    updateMessageContent: (messageId: string, content: string) => void;
}
