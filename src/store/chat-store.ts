import { create } from 'zustand';
import { ChatState, Message, ChatSession } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

// Mock initial data for testing UI
const MOCK_CHATS: ChatSession[] = [
    { id: '1', title: 'Marketing Strategy for Q4', createdAt: Date.now(), updatedAt: Date.now() },
    { id: '2', title: 'Blog Post Ideas', createdAt: Date.now() - 1000000, updatedAt: Date.now() - 1000000 },
];

export const useChatStore = create<ChatState>((set, get) => ({
    chats: MOCK_CHATS,
    currentChatId: null,
    messages: [],
    isLoading: false,
    selectedModel: 'gemini-3-flash-preview',

    chatMessages: {},

    addMessage: (message) => set((state) => {
        const currentChatId = state.currentChatId;
        if (!currentChatId) return state;

        const updatedMessages = [...state.messages, message];

        // Auto-update title if it's the first user message
        let updatedChats = state.chats;
        if (message.role === 'user' && state.messages.length === 0) {
            const newTitle = message.content.slice(0, 10) + (message.content.length > 10 ? '...' : '');
            updatedChats = state.chats.map(c =>
                c.id === currentChatId ? { ...c, title: newTitle } : c
            );
        }

        return {
            chats: updatedChats,
            messages: updatedMessages,
            chatMessages: {
                ...state.chatMessages,
                [currentChatId]: updatedMessages
            }
        };
    }),

    setMessages: (messages) => set({ messages }),

    setLoading: (isLoading) => set({ isLoading }),

    createChat: () => {
        const newChat: ChatSession = {
            id: uuidv4(),
            title: 'New Chat',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        set((state) => ({
            chats: [newChat, ...state.chats],
            currentChatId: newChat.id,
            messages: [],
            chatMessages: {
                ...state.chatMessages,
                [newChat.id]: []
            }
        }));
        return newChat.id;
    },

    selectChat: (chatId) => {
        set((state) => ({
            currentChatId: chatId,
            messages: state.chatMessages[chatId] || []
        }));
    },

    deleteChat: (chatId) => set((state) => {
        const newChatMessages = { ...state.chatMessages };
        delete newChatMessages[chatId];

        return {
            chats: state.chats.filter((c) => c.id !== chatId),
            currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
            messages: state.currentChatId === chatId ? [] : state.messages,
            chatMessages: newChatMessages
        };
    }),

    updateChatTitle: (chatId, title) => set((state) => ({
        chats: state.chats.map((c) => c.id === chatId ? { ...c, title } : c)
    })),

    updateMessageContent: (messageId, content) => set((state) => {
        const currentChatId = state.currentChatId;
        if (!currentChatId) return state;

        const updatedMessages = state.messages.map((m) =>
            m.id === messageId ? { ...m, content: m.content + content } : m
        );

        return {
            messages: updatedMessages,
            chatMessages: {
                ...state.chatMessages,
                [currentChatId]: updatedMessages
            }
        };
    }),

    setModel: (model) => set({ selectedModel: model }),
}));
