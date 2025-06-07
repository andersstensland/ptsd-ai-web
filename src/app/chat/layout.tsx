import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat - PTSD Research Assistant",
  description: "Chat with the PTSD Research Assistant",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="h-screen w-full overflow-hidden">
        {children}
      </div>
    </TooltipProvider>
  );
}
