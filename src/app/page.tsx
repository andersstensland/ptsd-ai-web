
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))] min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          PTSD AI Assistant
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Your specialized AI companion for PTSD research and mental health support.
          Chat with our RAG-enhanced assistant or manage your knowledge base.
        </p>
        <div className="space-x-4">
          <Link href="/chat">
            <Button size="lg">
              Start Chatting
            </Button>
          </Link>
          <Link href="/workspace">
            <Button variant="outline" size="lg">
              Dashboard
            </Button>
          </Link>
        </div>
        <div className="pt-4">
          <Link href="/documentation">
            <Button variant="ghost" size="sm">
              Documentation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
