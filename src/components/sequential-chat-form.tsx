"use client";

import { AutoResizeTextarea } from "@/components/autoresize-textarea";
import { MessageContent } from "@/components/message-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DEEPINFRA_MODELS, type AIModel } from "@/lib/ai-config";
import { cn } from "@/lib/utils";
import { 
  ArrowUpIcon, 
  Sparkles, 
  Clock, 
  Layers, 
  BarChart3,
  RefreshCw,
  Settings,
  Zap,
  Brain
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

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

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isSequential?: boolean;
  sequentialData?: SequentialResult;
}

export function SequentialChatForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>("meta-llama/Meta-Llama-3.1-8B-Instruct");
  
  // Sequential generation settings
  const [sequentialSettings, setSequentialSettings] = useState({
    enabled: true,
    rounds: 3,
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    useRag: true
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("final");

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (sequentialSettings.enabled) {
        // Use sequential generation
        const response = await fetch('/api/chat/sequential', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            conversationHistory: messages.slice(-4), // Include last 4 messages for context
            model: selectedModel,
            ...sequentialSettings
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          const assistantMessage: Message = {
            role: "assistant",
            content: data.result.finalResponse,
            isSequential: true,
            sequentialData: data.result
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(data.error || 'Failed to generate response');
        }
      } else {
        // Use regular chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            model: selectedModel,
            temperature: sequentialSettings.temperature,
            maxTokens: sequentialSettings.maxTokens,
            topP: sequentialSettings.topP
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let content = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            content += decoder.decode(value);
          }
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: content.trim(),
          isSequential: false
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const SequentialResultViewer = ({ data }: { data: SequentialResult }) => (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Sequential Generation</span>
              <Badge variant="secondary" className="text-xs">
                {data.rounds.length} rounds
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.round(data.totalTime)}ms
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {data.metadata.model}
              </div>
            </div>
          </div>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="final" className="text-xs">Final Result</TabsTrigger>
            <TabsTrigger value="rounds" className="text-xs">All Rounds</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">Analysis</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="final" className="p-4 m-0">
          <MessageContent content={data.finalResponse} role="assistant" />
        </TabsContent>

        <TabsContent value="rounds" className="p-4 m-0 space-y-4">
          {data.rounds.map((round, index) => (
            <Card key={round.round} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Round {round.round}
                    {index === data.rounds.length - 1 && (
                      <Badge variant="default" className="text-xs">Final</Badge>
                    )}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {round.responseLength} chars
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <MessageContent content={round.response} role="assistant" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analysis" className="p-4 m-0">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Generation Metrics</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Total Time:</span>
                    <span className="font-mono">{Math.round(data.totalTime)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rounds:</span>
                    <span className="font-mono">{data.rounds.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-mono text-xs">{data.metadata.model.split('/').pop()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RAG Context:</span>
                    <span className="font-mono">{data.ragContext?.hasContext ? 'Yes' : 'No'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Response Evolution</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  {data.rounds.map((round, index) => (
                    <div key={round.round} className="flex justify-between items-center">
                      <span>Round {round.round}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{round.responseLength}</span>
                        {index > 0 && (
                          <span className={cn(
                            "text-xs",
                            round.responseLength > data.rounds[index - 1].responseLength
                              ? "text-green-600" 
                              : round.responseLength < data.rounds[index - 1].responseLength
                              ? "text-red-600"
                              : "text-gray-500"
                          )}>
                            {round.responseLength > data.rounds[index - 1].responseLength ? "↗" : 
                             round.responseLength < data.rounds[index - 1].responseLength ? "↘" : "→"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {data.ragContext?.hasContext && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">RAG Context</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Used knowledge base context ({data.ragContext.contextLength} characters) to enhance the response with relevant research and documentation.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const SettingsPanel = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Sequential Generation Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="sequential-mode" className="text-sm">
            Sequential Mode
          </Label>
          <Switch
            id="sequential-mode"
            checked={sequentialSettings.enabled}
            onCheckedChange={(checked) =>
              setSequentialSettings(prev => ({ ...prev, enabled: checked }))
            }
          />
        </div>

        {sequentialSettings.enabled && (
          <>
            <div className="space-y-2">
              <Label className="text-sm">Generation Rounds: {sequentialSettings.rounds}</Label>
              <Slider
                value={[sequentialSettings.rounds]}
                onValueChange={([value]) =>
                  setSequentialSettings(prev => ({ ...prev, rounds: value }))
                }
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Temperature: {sequentialSettings.temperature}</Label>
              <Slider
                value={[sequentialSettings.temperature]}
                onValueChange={([value]) =>
                  setSequentialSettings(prev => ({ ...prev, temperature: value }))
                }
                min={0.1}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="use-rag" className="text-sm">
                Use RAG Context
              </Label>
              <Switch
                id="use-rag"
                checked={sequentialSettings.useRag}
                onCheckedChange={(checked) =>
                  setSequentialSettings(prev => ({ ...prev, useRag: checked }))
                }
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const header = (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
          Sequential AI Research Assistant
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Advanced multi-round generation for higher quality research responses.
          Each round refines and improves upon the previous generation.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
            Multi-round generation
          </div>
          <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
            Quality refinement
          </div>
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
            RAG-enhanced
          </div>
        </div>
      </div>
    </div>
  );

  const messageList = (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6">
      <div className="max-w-4xl mx-auto py-8">
        <SettingsPanel />
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    {message.isSequential ? (
                      <Brain className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
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
                  {message.isSequential && message.sequentialData && (
                    <SequentialResultViewer data={message.sequentialData} />
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white dark:text-gray-900 text-xs font-medium">U</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  {sequentialSettings.enabled && (
                    <span className="text-xs text-muted-foreground">
                      Generating {sequentialSettings.rounds} rounds...
                    </span>
                  )}
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
              {sequentialSettings.enabled && (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Sequential
                </Badge>
              )}
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
                  {DEEPINFRA_MODELS.map((model) => (
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
                placeholder={
                  sequentialSettings.enabled
                    ? `Ask for detailed research... (${sequentialSettings.rounds} rounds)`
                    : "Ask about PTSD research, treatments, or mental health..."
                }
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
                  <TooltipContent sideOffset={12}>
                    {sequentialSettings.enabled ? 'Generate sequentially' : 'Send message'}
                  </TooltipContent>
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
