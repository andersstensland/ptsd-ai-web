"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  defaultModel: z.string(),
  defaultTemperature: z.number().min(0).max(1),
  defaultMaxLength: z.number().min(1).max(4000),
  defaultTopP: z.number().min(0).max(1),
  apiKey: z.string().optional(),
  saveHistory: z.boolean(),
  darkMode: z.boolean(),
  autoSubmit: z.boolean(),
  // RAG settings
  vectorDbProvider: z.string(),
  embeddingModel: z.string(),
  retrievalCount: z.number().min(1).max(20),
  similarityThreshold: z.number().min(0).max(1),
  chunkSize: z.number().min(100).max(2000),
  chunkOverlap: z.number().min(0).max(500),
  includeSources: z.boolean(),
  hybridSearch: z.boolean(),
  reranking: z.boolean(),
});

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultModel: "text-davinci-003",
      defaultTemperature: 0.7,
      defaultMaxLength: 256,
      defaultTopP: 0.9,
      apiKey: "",
      saveHistory: true,
      darkMode: false,
      autoSubmit: false,
      // RAG settings default values
      vectorDbProvider: "pinecone",
      embeddingModel: "text-embedding-ada-002",
      retrievalCount: 5,
      similarityThreshold: 0.7,
      chunkSize: 500,
      chunkOverlap: 50,
      includeSources: true,
      hybridSearch: false,
      reranking: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would save to localStorage, a database, or an API
    console.log(values);
    toast("Settings saved, your settings have been saved successfully.");
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/playground">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Playground Settings</CardTitle>
          <CardDescription>
            Configure your default settings for the AI playground.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="model">Model Defaults</TabsTrigger>
              <TabsTrigger value="rag">RAG Settings</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <TabsContent value="general" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="darkMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Dark Mode</FormLabel>
                          <FormDescription>
                            Enable dark mode for the playground interface.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="saveHistory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Save History
                          </FormLabel>
                          <FormDescription>
                            Save your prompt history for future reference.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your API key"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your API key for accessing the AI models. This will
                            be stored securely.
                          </FormDescription>
                        </FormItem>
                    )}
                />

                  <FormField
                    control={form.control}
                    name="autoSubmit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Auto Submit
                          </FormLabel>
                          <FormDescription>
                            Automatically submit prompts after a period of
                            inactivity.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="model" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="defaultModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Model</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormDescription>
                          The default AI model to use in the playground.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultTemperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Temperature</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              min={0}
                              max={1}
                              step={0.01}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="flex-1"
                            />
                          </FormControl>
                          <span className="w-12 text-right">
                            {field.value.toFixed(2)}
                          </span>
                        </div>
                        <FormDescription>
                          Controls randomness: lower values are more
                          deterministic, higher values are more creative.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultMaxLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Maximum Length</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              min={1}
                              max={4000}
                              step={1}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="flex-1"
                            />
                          </FormControl>
                          <span className="w-12 text-right">{field.value}</span>
                        </div>
                        <FormDescription>
                          The maximum number of tokens to generate.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultTopP"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Top P</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              min={0}
                              max={1}
                              step={0.01}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              className="flex-1"
                            />
                          </FormControl>
                          <span className="w-12 text-right">
                            {field.value.toFixed(2)}
                          </span>
                        </div>
                        <FormDescription>
                          Controls diversity via nucleus sampling.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="rag" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="vectorDbProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vector Database</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vector database" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pinecone">Pinecone</SelectItem>
                              <SelectItem value="qdrant">Qdrant</SelectItem>
                              <SelectItem value="weaviate">Weaviate</SelectItem>
                              <SelectItem value="chroma">Chroma</SelectItem>
                              <SelectItem value="milvus">Milvus</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The vector database used for storing and retrieving
                            embeddings.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="embeddingModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Embedding Model</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an embedding model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text-embedding-ada-002">
                                text-embedding-ada-002
                              </SelectItem>
                              <SelectItem value="text-embedding-3-small">
                                text-embedding-3-small
                              </SelectItem>
                              <SelectItem value="text-embedding-3-large">
                                text-embedding-3-large
                              </SelectItem>
                              <SelectItem value="cohere-embed-english-v3.0">
                                cohere-embed-english-v3.0
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The model used to create vector embeddings of your
                            documents.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="retrievalCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retrieval Count</FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={1}
                                max={20}
                                step={1}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                                className="flex-1"
                              />
                            </FormControl>
                            <span className="w-12 text-right">
                              {field.value}
                            </span>
                          </div>
                          <FormDescription>
                            Number of documents to retrieve for each query.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="similarityThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Similarity Threshold</FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={0}
                                max={1}
                                step={0.01}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                                className="flex-1"
                              />
                            </FormControl>
                            <span className="w-12 text-right">
                              {field.value.toFixed(2)}
                            </span>
                          </div>
                          <FormDescription>
                            Minimum similarity score for retrieved documents.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="chunkSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chunk Size</FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={100}
                                max={2000}
                                step={50}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                                className="flex-1"
                              />
                            </FormControl>
                            <span className="w-12 text-right">
                              {field.value}
                            </span>
                          </div>
                          <FormDescription>
                            Size of text chunks in characters for document
                            processing.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chunkOverlap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chunk Overlap</FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={0}
                                max={500}
                                step={10}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                                className="flex-1"
                              />
                            </FormControl>
                            <span className="w-12 text-right">
                              {field.value}
                            </span>
                          </div>
                          <FormDescription>
                            Overlap between consecutive chunks in characters.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="includeSources"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Include Sources
                            </FormLabel>
                            <FormDescription>
                              Include source citations in the generated
                              responses.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hybridSearch"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Hybrid Search
                            </FormLabel>
                            <FormDescription>
                              Combine vector search with keyword search for
                              better results.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reranking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Reranking
                            </FormLabel>
                            <FormDescription>
                              Apply a reranking model to improve retrieval
                              quality.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
