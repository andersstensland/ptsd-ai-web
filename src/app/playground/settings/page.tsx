"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, ArrowLeft, Home, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  // General settings
  darkMode: z.boolean(),
  saveHistory: z.boolean(),
  autoSubmit: z.boolean(),

  // Model defaults
  defaultModel: z.string(),
  defaultTemperature: z.number().min(0).max(1),
  defaultMaxLength: z.number().min(1).max(4000),
  defaultTopP: z.number().min(0).max(1),

  // API settings
  apiKey: z.string().optional(),

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // General settings
      darkMode: false,
      saveHistory: true,
      autoSubmit: false,

      // Model defaults
      defaultModel: "text-davinci-003",
      defaultTemperature: 0.7,
      defaultMaxLength: 256,
      defaultTopP: 0.9,

      // API settings
      apiKey: "",

      // RAG settings
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
    toast.success("Settings saved", {
      description: "Your settings have been saved successfully.",
    });
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-4xl mx-auto w-full">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link
                href="/playground"
                className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ml-2"
              >
                Playground
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="ml-1 text-sm font-medium text-foreground md:ml-2">
                Settings
              </span>
            </div>
          </li>
        </ol>
      </nav>


      <div className="mb-6">
        <h2 className="text-xl font-semibold">Playground Settings</h2>
        <p className="text-muted-foreground">
          Configure your default settings for the AI playground.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="general"
          >
            {/* General Settings */}
            <AccordionItem
              value="general"
              className="border rounded-md px-4 py-2"
            >
              <AccordionTrigger className="text-lg font-medium py-2">
                General Settings
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2 space-y-6">
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
                  name="autoSubmit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Submit</FormLabel>
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
              </AccordionContent>
            </AccordionItem>

            {/* Model Defaults */}
            <AccordionItem
              value="model"
              className="border rounded-md px-4 py-2 mt-4"
            >
              <AccordionTrigger className="text-lg font-medium py-2">
                Model Defaults
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2 space-y-6">
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
                            onValueChange={(value) => field.onChange(value[0])}
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
                            onValueChange={(value) => field.onChange(value[0])}
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
                            onValueChange={(value) => field.onChange(value[0])}
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
              </AccordionContent>
            </AccordionItem>

            {/* Advanced Settings (combines API and RAG settings) */}
            <AccordionItem
              value="advanced"
              className="border rounded-md px-4 py-2 mt-4"
            >
              <AccordionTrigger className="text-lg font-medium py-2">
                Advanced Settings
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2 space-y-8">

                {/* RAG Settings */}
                <div>
                  <h3 className="text-base font-medium mb-4">
                    Retrieval Settings
                  </h3>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

                  <h3 className="text-base font-medium mb-4 mt-6">
                    Document Processing
                  </h3>
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

                  <h3 className="text-base font-medium mb-4 mt-6">
                    Advanced Retrieval Options
                  </h3>
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
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end pt-4 pb-8">
            <Button type="submit" size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
