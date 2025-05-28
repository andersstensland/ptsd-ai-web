import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
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
                href="/docs"
                className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ml-2"
              >
                Documentation
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="ml-1 text-sm font-medium text-foreground md:ml-2">
                Get Started
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-2 mb-6">
        <ArrowRight className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Get Started</h1>
      </div>

      <div className="prose max-w-none">
        <p className="lead">
          This guide will walk you through the basic steps to start using the AI
          Workspace effectively. Follow these instructions to set up your
          environment and begin generating text.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          1. Basic Text Generation
        </h2>
        <p>To generate your first text with the AI Workspace:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Go to the Workspace page.</li>
          <li>
            Enter a prompt in the text area (e.g., "Get some PTSD data idk?").
          </li>
          <li>Click the "Submit" button to generate a response.</li>
          <li>
            The generated text will appear in the output area above the prompt.
          </li>
        </ol>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          2. Adjusting Parameters
        </h2>
        <p>
          You can customize the behavior of the AI model by adjusting various
          parameters in the sidebar of the Workspace:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Model:</strong> Select different AI models based on your
            needs and API access.
          </li>
          <li>
            <strong>Temperature:</strong> Controls randomness. Lower values
            (e.g., 0.2) make responses more deterministic, while higher values
            (e.g., 0.8) make them more creative and diverse.
          </li>
          <li>
            <strong>Maximum Length:</strong> Sets the maximum number of tokens
            in the generated response.
          </li>
          <li>
            <strong>Top P:</strong> Controls diversity via nucleus sampling.
            Lower values focus on more likely tokens.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          3. Setting Up RAG (Retrieval-Augmented Generation)
        </h2>
        <p>To enhance responses with your own knowledge base:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Click on the "Knowledge Base" tab in the Workspace.</li>
          <li>
            Select "Upload" to add documents for your knowledge base.
          </li>
          <li>
            Once your documents are processed, return to the Workspace tab.
          </li>
          <li>
            Enter a prompt related to your knowledge base content. RAG is now always enabled and will automatically enhance responses with your data.
          </li>
        </ol>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          4. Customizing Default Settings
        </h2>
        <p>To customize your default settings:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Navigate to the Settings page.</li>
          <li>
            Adjust the settings in the General Settings, Model Defaults, and
            Advanced Settings sections according to your preferences.
          </li>
          <li>Click "Save Settings" to apply your changes.</li>
        </ol>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. Next Steps</h2>
        <p>
          Once you're comfortable with the basics, you can explore more advanced
          features:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Experiment with different prompting techniques to improve results
          </li>
          <li>Create and save presets for different use cases</li>
          <li>
            Explore the API documentation to integrate the AI into your
            applications
          </li>
          <li>
            Join our community forum to share tips and learn from other users
          </li>
        </ul>

        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-md mt-8">
          <div>
            <h4 className="font-medium">Ready to try it out?</h4>
            <p className="text-sm text-muted-foreground">
              Start generating with the AI Workspace now
            </p>
          </div>
          <Link href="/workspace">
            <Button>Go to workspace</Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t">
        <Link href="/docs/introduction">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Previous: Introduction
          </Button>
        </Link>
        <Link href="/documentation/changelog">
          <Button className="flex items-center gap-2">
            Next: Changelog
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
