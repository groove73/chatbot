"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="h-14 border-b flex items-center px-4 bg-background z-10 gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Access recent chats and start new conversations</SheetDescription>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 className="font-semibold text-lg">AI Assistant</h1>
        {/* Model selector could go here */}
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
