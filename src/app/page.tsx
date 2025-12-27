"use client";

import { ChatInterface } from "@/components/chat/chat-interface";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="h-14 border-b flex items-center px-4 bg-background z-10">
        <h1 className="font-semibold text-lg">AI Assistant</h1>
        {/* Model selector could go here */}
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
