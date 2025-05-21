"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MoreHorizontal,
  RotateCcw,
  AlignLeft,
  AlignJustify,
  AlignRight,
  Copy,
  Check,
  Settings,
  Database,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { KnowledgeBase } from "./knowledge-base";

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxLength, setMaxLength] = useState(256);
  const [topP, setTopP] = useState(0.9);
  const [model, setModel] = useState("text-davinci-003");
  const [mode, setMode] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("playground");
  const [ragEnabled, setRagEnabled] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setOutput(
        ragEnabled
          ? "This is a simulated RAG-enhanced response that would include information from your knowledge base. The response would reference documents and provide citations to the sources used."
          : "This is a simulated response from the AI model based on your prompt. In a real implementation, this would be the result from an API call to the selected model with the specified parameters."
      );
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Playground</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-[200px]">
              <Select>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <span>Load a preset...</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preset1">Preset 1</SelectItem>
                  <SelectItem value="preset2">Preset 2</SelectItem>
                  <SelectItem value="preset3">Preset 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">Save</Button>
            <Link href="/playground/settings">
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
              Playground
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="flex-1 pt-6">
            {/* Output display area */}
            <div className="border rounded-md p-4 bg-muted/30 min-h-[200px] relative">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Output
                </h2>
                {output && (
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
              <div className="font-mono text-sm whitespace-pre-wrap">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-pulse text-muted-foreground">
                      Generating response...
                    </div>
                  </div>
                ) : output ? (
                  output
                ) : (
                  <div className="text-muted-foreground italic">
                    Your generated text will appear here...
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 mt-6">
              <div className="flex flex-col">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write a tagline for an ice cream shop"
                  className="flex-1 min-h-[400px] p-4 text-base resize-none border rounded-md"
                />
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt.trim()}
                  >
                    {isLoading ? "Generating..." : "Submit"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPrompt("")}
                    disabled={!prompt || isLoading}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm">RAG</span>
                    <Switch
                      checked={ragEnabled}
                      onCheckedChange={setRagEnabled}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="space-y-4">
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
                    <h3 className="mb-2 font-medium">Model</h3>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text-davinci-003">
                          text-davinci-003
                        </SelectItem>
                        <SelectItem value="gpt-3.5-turbo">
                          gpt-3.5-turbo
                        </SelectItem>
                        <SelectItem value="gpt-4">gpt-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Temperature</h3>
                      <span className="text-sm text-gray-500">
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
                      <h3 className="font-medium">Maximum Length</h3>
                      <span className="text-sm text-gray-500">{maxLength}</span>
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
                      <h3 className="font-medium">Top P</h3>
                      <span className="text-sm text-gray-500">{topP}</span>
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

function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        checked ? "bg-primary" : "bg-input"
      }`}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
