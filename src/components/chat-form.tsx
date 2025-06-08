"use client";

import { AutoResizeTextarea } from "@/components/autoresize-textarea";
import { MessageContent } from "@/components/message-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DEEPINFRA_MODELS, type AIModel, type Provider } from "@/lib/ai-config";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { 
  ArrowUpIcon, 
  Sparkles, 
  Zap, 
  Settings,
  Clock,
  BarChart3,
  Brain
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GenerationRound {
  round: number;
  response: string;
  timestamp: Date;
  responseLength: number;
}

interface SequentialResult {
  finalResponse: string;
  totalTime: number;
  rounds: GenerationRound[];
  ragContext?: {
    hasContext: boolean;
    contextLength?: number;
  };
  metadata: {
    model: string;
    rounds: number;
    useRag: boolean;
    generatedAt: string;
  };
}

interface ExtendedMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isSequential?: boolean;
  sequentialData?: SequentialResult;
}

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [provider, ] = useState<Provider>("deepinfra");
  const [selectedModel, setSelectedModel] = useState<AIModel>("meta-llama/Meta-Llama-3.1-8B-Instruct");
  const [temperature] = useState(0.7);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sequential generation state
  const [isSequentialMode, setIsSequentialMode] = useState(false);
  const [sequentialSettings, setSequentialSettings] = useState({
    rounds: 3,
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    useRag: true
  });
  const [extendedMessages, setExtendedMessages] = useState<ExtendedMessage[]>([]);
  const [isSequentialLoading, setIsSequentialLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      if (isSequentialMode) {
        await handleSequentialSubmit();
      } else {
        void append({ content: input, role: "user" });
        setInput("");
      }
    }
  };

  const handleSequentialSubmit = async () => {
    if (!input.trim() || isSequentialLoading) return;

    const userMessage: ExtendedMessage = { 
      id: `user-${Date.now()}`,
      role: "user", 
      content: input 
    };
    setExtendedMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsSequentialLoading(true);

    try {
      const response = await fetch('/api/chat/sequential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          model: selectedModel,
          temperature: sequentialSettings.temperature,
          maxTokens: sequentialSettings.maxTokens,
          topP: sequentialSettings.topP,
          rounds: sequentialSettings.rounds,
          useRag: sequentialSettings.useRag,
          conversationHistory: extendedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) throw new Error('Sequential generation failed');

      const data = await response.json();
      const result = data.result; // Extract the nested result object
      
      const assistantMessage: ExtendedMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.finalResponse,
        isSequential: true,
        sequentialData: {
          finalResponse: result.finalResponse,
          totalTime: result.totalTime,
          rounds: result.rounds.map((r: { round: number; response: string; timestamp: string }) => ({
            round: r.round,
            response: r.response,
            timestamp: new Date(r.timestamp),
            responseLength: r.response.length
          })),
          ragContext: result.ragContext ? {
            hasContext: true,
            contextLength: result.ragContext.contextLength || result.ragContext.length
          } : { hasContext: false },
          metadata: {
            model: selectedModel,
            rounds: sequentialSettings.rounds,
            useRag: sequentialSettings.useRag,
            generatedAt: new Date().toISOString()
          }
        }
      };

      setExtendedMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Sequential generation error:', error);
    } finally {
      setIsSequentialLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  // Get current messages based on mode
  const currentMessages = isSequentialMode ? extendedMessages : messages;
  const currentIsLoading = isSequentialMode ? isSequentialLoading : isLoading;

  // Simple auto-scroll to bottom for new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, extendedMessages]);

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
          {currentMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={cn(
                "flex gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-red-700 flex items-center justify-center flex-shrink-0 mt-1">
                  {(message as ExtendedMessage).isSequential ? (
                    <Brain className="w-4 h-4 text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
              <div className="space-y-2 max-w-[80%]">
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-blue-600 text-white ml-12"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  )}
                >
                  <MessageContent content={message.content} role={message.role} />
                </div>
                
                {/* Sequential generation details */}
                {(message as ExtendedMessage).isSequential && (message as ExtendedMessage).sequentialData && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="w-3 h-3" />
                        Sequential ({(message as ExtendedMessage).sequentialData!.rounds.length} rounds)
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {(message as ExtendedMessage).sequentialData!.totalTime}ms
                      </Badge>
                      {(message as ExtendedMessage).sequentialData!.ragContext?.hasContext && (
                        <Badge variant="outline">RAG Enhanced</Badge>
                      )}
                    </div>
                    
                    <Tabs defaultValue="final" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 text-xs">
                        <TabsTrigger value="final">Final Result</TabsTrigger>
                        <TabsTrigger value="rounds">All Rounds</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="final" className="mt-2">
                        <div className="text-xs text-muted-foreground">
                          This is the final refined response after {(message as ExtendedMessage).sequentialData!.rounds.length} generation rounds.
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="rounds" className="mt-2">
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {(message as ExtendedMessage).sequentialData!.rounds.map((round) => (
                            <Card key={round.round} className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Round {round.round}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {round.responseLength} chars
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-3">
                                {round.response.substring(0, 200)}...
                              </div>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="analysis" className="mt-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <BarChart3 className="w-3 h-3" />
                            <span>Generation Analysis</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Model: {(message as ExtendedMessage).sequentialData!.metadata.model}</div>
                            <div>Rounds: {(message as ExtendedMessage).sequentialData!.metadata.rounds}</div>
                            <div>RAG: {(message as ExtendedMessage).sequentialData!.metadata.useRag ? 'Yes' : 'No'}</div>
                            <div>Time: {(message as ExtendedMessage).sequentialData!.totalTime}ms</div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white dark:text-gray-900 text-xs font-medium">U</span>
                </div>
              )}
            </div>
          ))}
          {currentIsLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                {isSequentialMode ? (
                  <Brain className="w-4 h-4 text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
                {isSequentialMode && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Generating sequential response...
                  </div>
                )}
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
          
          <div className="flex items-center gap-2">
            <Button
              variant={isSequentialMode ? "default" : "ghost"}
              size="sm"
              className="gap-2 text-xs"
              onClick={() => setIsSequentialMode(!isSequentialMode)}
            >
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">
                {isSequentialMode ? "Sequential ON" : "Sequential Mode"}
              </span>
            </Button>
            
            {isSequentialMode && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <Settings className="w-3 h-3" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Sequential Generation Settings</SheetTitle>
                    <SheetDescription>
                      Configure how the AI generates sequential responses
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="rounds">Generation Rounds: {sequentialSettings.rounds}</Label>
                      <Slider
                        id="rounds"
                        value={[sequentialSettings.rounds]}
                        onValueChange={([value]) => 
                          setSequentialSettings(prev => ({ ...prev, rounds: value }))
                        }
                        min={1}
                        max={5}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">
                        More rounds = better quality, but takes longer
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature: {sequentialSettings.temperature}</Label>
                      <Slider
                        id="temperature"
                        value={[sequentialSettings.temperature]}
                        onValueChange={([value]) => 
                          setSequentialSettings(prev => ({ ...prev, temperature: value }))
                        }
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">
                        Lower = more focused, Higher = more creative
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Tokens: {sequentialSettings.maxTokens}</Label>
                      <Slider
                        id="maxTokens"
                        value={[sequentialSettings.maxTokens]}
                        onValueChange={([value]) => 
                          setSequentialSettings(prev => ({ ...prev, maxTokens: value }))
                        }
                        min={500}
                        max={2000}
                        step={100}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="useRag"
                        checked={sequentialSettings.useRag}
                        onCheckedChange={(checked) =>
                          setSequentialSettings(prev => ({ ...prev, useRag: checked }))
                        }
                      />
                      <Label htmlFor="useRag">Use RAG Enhancement</Label>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
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
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col min-h-0">
        {currentMessages.length ? messageList : header}
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
                placeholder={
                  isSequentialMode 
                    ? "Ask for sequential analysis of PTSD research..." 
                    : "Ask about PTSD research, treatments, or mental health..."
                }
                className="flex-1 bg-transparent border-0 resize-none px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 min-h-[52px] max-h-32"
                disabled={currentIsLoading}
              />
              <div className="p-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!input.trim() || currentIsLoading}
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
