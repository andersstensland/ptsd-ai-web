"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { MobileHeader } from "@/components/mobile-header";
import { DesktopHeader } from "@/components/desktop-header";

const formSchema = z.object({
  retrievalCount: z.number().min(1).max(20),
  similarityThreshold: z.number().min(0).max(1),
  chunkSize: z.number().min(100).max(2000),
  chunkOverlap: z.number().min(0).max(500),
  includeSources: z.boolean(),
  hybridSearch: z.boolean(),
});

export default function SettingsPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      retrievalCount: 5,
      similarityThreshold: 0.7,
      chunkSize: 500,
      chunkOverlap: 50,
      includeSources: true,
      hybridSearch: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Settings saved", {
      description: "Your configuration has been updated successfully.",
    });
  }

  return (
    <>
      <MobileHeader title="Settings" />
      <DesktopHeader title="Settings" />
      <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-4xl mx-auto w-full">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure how the system retrieves and processes documents for enhanced AI responses.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Document Retrieval Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Retrieval</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="retrievalCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Documents</FormLabel>
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
                          <span className="w-12 text-right font-mono">
                            {field.value}
                          </span>
                        </div>
                        <FormDescription>
                          How many relevant documents to retrieve for each query.
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
                          <span className="w-12 text-right font-mono">
                            {field.value.toFixed(2)}
                          </span>
                        </div>
                        <FormDescription>
                          Minimum relevance score for documents to be included.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Processing Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                          <span className="w-12 text-right font-mono">
                            {field.value}
                          </span>
                        </div>
                        <FormDescription>
                          Size of text chunks in characters for document processing.
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
                          <span className="w-12 text-right font-mono">
                            {field.value}
                          </span>
                        </div>
                        <FormDescription>
                          Character overlap between consecutive chunks to maintain context.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="includeSources"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Include Source Citations
                        </FormLabel>
                        <FormDescription>
                          Add source references to AI responses showing which documents were used.
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
                          Combine semantic search with keyword matching for improved results.
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
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}