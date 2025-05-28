"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DEEPINFRA_MODELS, OLLAMA_MODELS, type AIModel, type Provider } from "@/lib/ai-config";
import { useChat } from "ai/react";
import {
  AlignJustify,
  AlignLeft,
  AlignRight,
  BookOpen,
  Check,
  Copy,
  Database,
  MoreHorizontal,
  RotateCcw,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { KnowledgeBase } from "./knowledge-base";

export default function PlaygroundPage() {
  const [temperature, setTemperature] = useState(0.7);
  const [maxLength, setMaxLength] = useState(256);
  const [topP, setTopP] = useState(0.9);
  const [provider, setProvider] = useState<Provider>("deepinfra");
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEEPINFRA_MODELS[0]);
  const [mode, setMode] = useState("default");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("playground");

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      provider,
      model: selectedModel,
      temperature,
      maxTokens: maxLength,
      topP,
    },
  });

  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    // Set default model for the selected provider
    if (newProvider === "ollama") {
      setSelectedModel(OLLAMA_MODELS[0]);
    } else {
      setSelectedModel(DEEPINFRA_MODELS[0]);
    }
  };

  const copyToClipboard = () => {
    const output = messages[messages.length - 1]?.content || '';
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Workspace</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">Save</Button>
            <Link href="workspace/settings">
              <Button variant="outline" size="icon" title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="playground" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Knowledge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="flex-1 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              {/* Left Panel - Prompt and Controls */}
              <div className="flex flex-col gap-4">
                {/* Controls */}
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <h3 className="mb-2 font-medium">Mode</h3>
                    <div className="flex border rounded-md">
                      <Button
                        variant={mode === "default" ? "default" : "ghost"}
                        className="flex-1 rounded-none border-0"
                        onClick={() => setMode("default")}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={mode === "focused" ? "default" : "ghost"}
                        className="flex-1 rounded-none border-0"
                        onClick={() => setMode("focused")}
                      >
                        <AlignJustify className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={mode === "chat" ? "default" : "ghost"}
                        className="flex-1 rounded-none border-0"
                        onClick={() => setMode("chat")}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Provider</h3>
                    <Select value={provider} onValueChange={(value) => handleProviderChange(value as Provider)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deepinfra">DeepInfra</SelectItem>
                        <SelectItem value="ollama">Ollama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Model</h3>
                    <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as AIModel)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {provider === "ollama" 
                          ? OLLAMA_MODELS.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))
                          : DEEPINFRA_MODELS.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-sm">Temperature</h3>
                        <span className="text-xs text-gray-500">
                          {temperature}
                        </span>
                      </div>
                      <Slider
                        value={[temperature]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) => setTemperature(value[0])}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-sm">Max Length</h3>
                        <span className="text-xs text-gray-500">
                          {maxLength}
                        </span>
                      </div>
                      <Slider
                        value={[maxLength]}
                        min={1}
                        max={4000}
                        step={1}
                        onValueChange={(value) => setMaxLength(value[0])}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-sm">Top P</h3>
                        <span className="text-xs text-gray-500">{topP}</span>
                      </div>
                      <Slider
                        value={[topP]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) => setTopP(value[0])}
                      />
                    </div>
                  </div>
                </div>

                {/* Prompt Area */}
                <div className="flex-1 flex flex-col">
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <label className="text-sm font-medium mb-2">Prompt</label>
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Write your prompt here..."
                      className="flex-1 p-4 text-base resize-none border rounded-md min-h-[300px]"
                    />
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                      >
                        {isLoading ? "Generating..." : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>)}
                        disabled={!input || isLoading}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Panel - Output */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Output</label>
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </div>
                <div className="border rounded-md p-6 bg-muted/30 flex-1 relative">
                  <div className="font-mono text-sm whitespace-pre-wrap h-full overflow-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse text-muted-foreground">
                          Generating response...
                        </div>
                      </div>
                    ) : messages.length > 0 ? (
                      messages[messages.length - 1]?.content
                    ) : (
                      <div className="text-muted-foreground italic flex items-center justify-center h-full">
                        Your generated text will appear here...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="pt-6">
            <KnowledgeBase />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}