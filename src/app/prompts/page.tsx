"use client";

import { DesktopHeader } from "@/components/desktop-header";
import { MobileHeader } from "@/components/mobile-header";
import { PromptGenerator } from "@/components/prompt-generator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SequentialPrompts } from "@/lib/prompt-generation";
import { useState } from "react";

export default function PromptGeneratorPage() {
  const [generatedPrompts, setGeneratedPrompts] = useState<SequentialPrompts | null>(null);
  const [contextMessage, setContextMessage] = useState("");

  const handlePromptsGenerated = (prompts: SequentialPrompts, context: string) => {
    setGeneratedPrompts(prompts);
    setContextMessage(context);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <MobileHeader title="Prompt Generator" />
      <DesktopHeader title="Sequential Prompt Generator" />
      <div className="flex h-full w-full flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="text-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
                Sequential Prompt Generator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generate strategic research prompts that build upon each other for comprehensive, 
                evidence-based responses in PTSD and mental health research.
              </p>
            </div>
          </div>

          {/* Main Generator */}
          <div className="max-w-4xl mx-auto w-full">
            <PromptGenerator 
              onPromptsGenerated={handlePromptsGenerated}
              className="w-full"
            />
          </div>

          {/* Example Queries */}
          {!generatedPrompts && (
            <div className="max-w-4xl mx-auto w-full">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Example Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Research Query:</p>
                      <p className="text-sm text-muted-foreground">&ldquo;Can you provide me with some PTSD research?&rdquo;</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Basic Research</Badge>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Treatment Query:</p>
                      <p className="text-sm text-muted-foreground">&ldquo;What are the most effective treatments for complex PTSD?&rdquo;</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Clinical Focus</Badge>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Implementation Query:</p>
                      <p className="text-sm text-muted-foreground">&ldquo;How can I implement trauma-informed care in my practice?&rdquo;</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Practical Application</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Generated Context Display */}
          {contextMessage && (
            <div className="max-w-4xl mx-auto w-full">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Research Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/30 p-4 rounded-lg overflow-x-auto">
                      {contextMessage}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
