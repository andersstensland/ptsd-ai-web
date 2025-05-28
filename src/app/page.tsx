
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
          A powerful AI workspace for mental health support and research using
          both DeepInfra and Ollama providers.
        </p>
        <div className="space-x-4">
          <Link href="/workspace">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/documentation">
            <Button variant="outline" size="lg">
              Documentation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
