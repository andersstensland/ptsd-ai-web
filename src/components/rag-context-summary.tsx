"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, FileText, Loader2 } from "lucide-react";

interface Document {
  id: string;
  title: string;
  snippet: string;
  relevanceScore: number;
}

interface RagContextSummaryProps {
  documents?: Document[];
  query?: string;
}

export function RagContextSummary({
  documents = [],
  query = "",
}: RagContextSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search for relevant documents when query changes
  useEffect(() => {
    if (query.trim().length > 0) {
      const searchDocuments = async () => {
        setIsSearching(true);
        try {
          const response = await fetch('/api/documents/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, topK: 3 }),
          });

          if (response.ok) {
            const data = await response.json();
            const results = data.results?.map((result: { document: { id: string; title: string; content: string }; score: number }) => ({
              id: result.document.id,
              title: result.document.title,
              snippet: result.document.content.substring(0, 150) + '...',
              relevanceScore: result.score,
            })) || [];
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };

      const debounceTimer = setTimeout(searchDocuments, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  // Use provided documents or search results
  const contextDocuments = documents.length > 0 ? documents : searchResults;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">RAG Context Summary</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Always Enabled
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <div className="flex items-center justify-between mb-2">
            {isSearching ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Searching knowledge base...
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {contextDocuments.length > 0 
                  ? `${contextDocuments.length} documents will be used to augment the response`
                  : query.trim().length > 0 
                    ? "No relevant documents found for this query"
                    : "Enter a query to see relevant documents"
                }
              </p>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {contextDocuments.length > 0 ? (
                <div className="space-y-3">
                  {contextDocuments.map((doc) => (
                    <div key={doc.id} className="border-b pb-2 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium text-sm">{doc.title}</p>
                        </div>
                        <Badge variant="outline">
                          {Math.round(doc.relevanceScore * 100)}% relevant
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {doc.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {query.trim().length > 0 
                        ? "No documents match your query"
                        : "Documents will appear here when you type a query"
                      }
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
