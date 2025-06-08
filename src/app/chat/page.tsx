"use client";

import { ChatForm } from "@/components/chat-form";
import { MobileHeader } from "@/components/mobile-header";
import { DesktopHeader } from "@/components/desktop-header";

export default function ChatPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <MobileHeader title="AI Assistant" />
      <DesktopHeader title="AI Assistant" />
      <div className="flex h-full w-full flex-1">
        <ChatForm className="flex-1" />
      </div>
    </div>
  );
}
