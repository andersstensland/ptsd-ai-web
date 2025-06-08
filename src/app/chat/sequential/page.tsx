"use client";

import { SequentialChatForm } from "@/components/sequential-chat-form";
import { MobileHeader } from "@/components/mobile-header";
import { DesktopHeader } from "@/components/desktop-header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SequentialChatPage() {
  return (
    <TooltipProvider>
      <div className="flex h-full w-full flex-col">
        <MobileHeader title="Sequential AI Assistant" />
        <DesktopHeader title="Sequential AI Assistant" />
        <div className="flex h-full w-full flex-1">
          <SequentialChatForm className="flex-1" />
        </div>
      </div>
    </TooltipProvider>
  );
}
