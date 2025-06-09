"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Lightbulb, 
  Copy, 
  CheckCircle, 
  Loader2,
  Sparkles,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SequentialPrompts } from "@/lib/prompt-generation";

interface PromptGeneratorProps {
  onPromptsGenerated?: (prompts: SequentialPrompts, contextMessage: string) => void;
  className?: string;
}

export function PromptGenerator({ onPromptsGenerated, className }: PromptGeneratorProps) {
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<SequentialPrompts | null>(null);
  const [settings, setSettings] = useState({
    numberOfPrompts: 4,
    temperature: 0.3,
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct'
  });
  const [activeTab, setActiveTab] = useState("generator");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGeneratePrompts = async () => {
    if (!query.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          model: settings.model,
          temperature: settings.temperature,
          numberOfPrompts: settings.numberOfPrompts
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setGeneratedPrompts(data.prompts);
        setActiveTab("results");
        onPromptsGenerated?.(data.prompts, data.contextMessage);
      } else {
        throw new Error(data.error || 'Failed to generate prompts');
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
      // You might want to show a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const copyAllPrompts = async () => {
    if (!generatedPrompts) return;
    
    const allPrompts = generatedPrompts.sequentialPrompts
      .map((p, i) => `${i + 1}. ${p.prompt}`)
      .join('\n\n');
    
    await copyToClipboard(allPrompts, -1);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            Prompt Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate strategic sequential prompts for comprehensive research responses
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">Generate</TabsTrigger>
            <TabsTrigger value="results" disabled={!generatedPrompts}>
              Results {generatedPrompts && <Badge variant="secondary" className="ml-1 text-xs">{generatedPrompts.sequentialPrompts.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Research Query</Label>
              <Textarea
                id="query"
                placeholder="E.g., 'Can you provide me with some PTSD research?'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Prompts: {settings.numberOfPrompts}</Label>
                <Slider
                  value={[settings.numberOfPrompts]}
                  onValueChange={([value]) => 
                    setSettings(prev => ({ ...prev, numberOfPrompts: value }))
                  }
                  min={2}
                  max={6}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Creativity: {settings.temperature}</Label>
                <Slider
                  value={[settings.temperature]}
                  onValueChange={([value]) => 
                    setSettings(prev => ({ ...prev, temperature: value }))
                  }
                  min={0.1}
                  max={0.8}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            <Button 
              onClick={handleGeneratePrompts}
              disabled={!query.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Prompts...
                </>
              ) : (
                <>
                  Generate Prompts
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {generatedPrompts && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Research Strategy
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {generatedPrompts.researchStrategy}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyAllPrompts}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy All
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Primary Focus:</strong> {generatedPrompts.primaryFocus}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Sequential Prompts
                  </h4>
                  
                  {generatedPrompts.sequentialPrompts.map((prompt, index) => (
                    <Card key={index} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">
                              Step {prompt.step}
                            </Badge>
                            <span className="text-sm font-medium">{prompt.purpose}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(prompt.prompt, index)}
                            className="p-1 h-auto"
                          >
                            {copiedIndex === index ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm mb-2 font-medium">Prompt:</p>
                        <p className="text-sm bg-muted/30 p-2 rounded border-l-2 border-blue-500">
                          {prompt.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <strong>Expected:</strong> {prompt.expectedOutput}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Expected Outcome</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {generatedPrompts.expectedOutcome}
                  </p>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
