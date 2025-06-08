import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { DesktopHeader } from "@/components/desktop-header";

export default function Home() {
  return (
    <>
      <MobileHeader title="PTSD AI Assistant" />
      <DesktopHeader title="PTSD AI Assistant" />
      <div className="[--header-height:calc(theme(spacing.14))] min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            PTSD AI Assistant
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Your specialized AI companion for PTSD research and mental health support.
            Chat with our RAG-enhanced assistant or manage your knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 sm:justify-center">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button size="lg" className="w-full mobile-touch-target">
                Start Chatting
              </Button>
            </Link>
            <Link href="/workspace" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full mobile-touch-target">
                Dashboard
              </Button>
            </Link>
          </div>
          <div className="pt-4">
            <Link href="/documentation">
              <Button variant="ghost" size="sm" className="mobile-touch-target">
                Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
