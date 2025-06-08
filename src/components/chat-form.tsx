"use client";

import { AutoResizeTextarea } from "@/components/autoresize-textarea";
import { MessageContent } from "@/components/message-content";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEEPINFRA_MODELS, OLLAMA_MODELS, type AIModel, type Provider } from "@/lib/ai-config";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { ArrowUpIcon, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [provider, ] = useState<Provider>("deepinfra");
  const [selectedModel, setSelectedModel] = useState<AIModel>("meta-llama/Meta-Llama-3.1-8B-Instruct");
  const [temperature] = useState(0.7);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, append, isLoading } = useChat({
    api: "/api/chat",
    body: {
      provider,
      model: selectedModel,
      temperature,
      maxTokens: 1000,
      topP: 0.9,
      useRag: true,
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      void append({ content: input, role: "user" });
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  // Simple auto-scroll to bottom for new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const header = (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-800 to-red-600 rounded-2xl flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
          PTSD AI Assistant
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Your specialized AI companion for PTSD research and mental health
          support. Ask me anything about trauma-informed care, treatments, or
          research.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="px-3 py-1 bg-gray-700 dark:bg-blue-900/30 text-white rounded-full text-sm">
            Evidence-based
          </div>
          <div className="px-3 py-1 bg-gray-700 dark:bg-green-900/30 text-white rounded-full text-sm">
            RAG-enhanced
          </div>
          <div className="px-3 py-1 bg-gray-700 dark:bg-purple-900/30 text-white rounded-full text-sm">
            Research-focused
          </div>
        </div>
      </div>
    </div>
  );

  const messageList = (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="max-w-4xl mx-auto py-8">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-red-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-blue-600 text-white ml-12"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                )}
              >
                <MessageContent content={message.content} role={message.role} />
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white dark:text-gray-900 text-xs font-medium">U</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  return (
    <main
      className={cn(
        "flex flex-col h-full bg-background",
        className
      )}
      {...props}
    >
      {/* Header with model selection */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Model: {selectedModel}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <span className="hidden sm:inline">Models</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <div className="space-y-1">
                  {(DEEPINFRA_MODELS).map((model) => (
                    <Button
                      key={model}
                      variant={selectedModel === model ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedModel(model)}
                    >
                      {model}
                    </Button>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col min-h-0">
        {messages.length ? messageList : header}
      </div>

      {/* Input area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end gap-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
              <AutoResizeTextarea
                onKeyDown={handleKeyDown}
                onChange={(v) => setInput(v)}
                value={input}
                placeholder="Ask about PTSD research, treatments, or mental health..."
                className="flex-1 bg-transparent border-0 resize-none px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 min-h-[52px] max-h-32"
                disabled={isLoading}
              />
              <div className="p-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!input.trim() || isLoading}
                      className="rounded-xl h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={12}>Send message</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
              <div>
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
