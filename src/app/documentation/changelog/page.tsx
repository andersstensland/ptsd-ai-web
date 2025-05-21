import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  ChevronRight,
  Book,
  History,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

export default function ChangelogPage() {
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
                Changelog
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-2 mb-6">
        <History className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Changelog</h1>
      </div>

      <div className="prose max-w-none">
        <p className="lead">
          Track the latest updates, improvements, and bug fixes to the AI
          Playground. This changelog helps you stay informed about new features
          and changes to the platform.
        </p>

        <div className="mt-8 space-y-12">
          {/* Version 1.2.0 */}
          <div className="border-l-2 border-primary pl-6 pb-2 relative">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1"></div>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                v1.2.0
              </span>
              <span className="text-sm text-muted-foreground">
                May 15, 2024
              </span>
            </div>
            <h2 className="text-xl font-semibold mt-2 mb-4">RAG Integration</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>
                <strong>Added:</strong> Retrieval-Augmented Generation (RAG)
                capabilities for enhanced responses
              </li>
              <li>
                <strong>Added:</strong> Knowledge Base management with document
                upload and web crawling
              </li>
              <li>
                <strong>Added:</strong> Vector database integration with
                multiple provider options
              </li>
              <li>
                <strong>Added:</strong> Document processing with customizable
                chunking settings
              </li>
              <li>
                <strong>Added:</strong> Source citation in generated responses
              </li>
              <li>
                <strong>Improved:</strong> Settings page with advanced RAG
                configuration options
              </li>
            </ul>
            <div className="mt-4 bg-muted p-4 rounded-md">
              <h3 className="text-base font-medium mb-2">Developer Notes</h3>
              <p className="text-sm">
                This release introduces a major new feature set around
                Retrieval-Augmented Generation. The RAG implementation uses
                vector embeddings to find relevant information in your documents
                and enhances the model's responses with this information. This
                significantly improves accuracy for domain-specific queries.
              </p>
            </div>
          </div>

          {/* Version 1.1.0 */}
          <div className="border-l-2 border-primary pl-6 pb-2 relative">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1"></div>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                v1.1.0
              </span>
              <span className="text-sm text-muted-foreground">
                April 3, 2024
              </span>
            </div>
            <h2 className="text-xl font-semibold mt-2 mb-4">
              Enhanced UI and New Models
            </h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>
                <strong>Added:</strong> Support for GPT-4 and other new models
              </li>
              <li>
                <strong>Added:</strong> Ability to save and load presets
              </li>
              <li>
                <strong>Added:</strong> Dark mode support
              </li>
              <li>
                <strong>Improved:</strong> Response rendering with better
                formatting
              </li>
              <li>
                <strong>Improved:</strong> UI responsiveness on mobile devices
              </li>
              <li>
                <strong>Fixed:</strong> Issues with copying long responses
              </li>
            </ul>
          </div>

          {/* Version 1.0.0 */}
          <div className="border-l-2 border-primary pl-6 pb-2 relative">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1"></div>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                v1.0.0
              </span>
              <span className="text-sm text-muted-foreground">
                February 10, 2024
              </span>
            </div>
            <h2 className="text-xl font-semibold mt-2 mb-4">Initial Release</h2>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>
                <strong>Added:</strong> Basic text generation interface
              </li>
              <li>
                <strong>Added:</strong> Support for temperature, top-p, and
                maximum length parameters
              </li>
              <li>
                <strong>Added:</strong> Model selection (text-davinci-003,
                gpt-3.5-turbo)
              </li>
              <li>
                <strong>Added:</strong> Copy to clipboard functionality
              </li>
              <li>
                <strong>Added:</strong> Settings page for API key configuration
              </li>
              <li>
                <strong>Added:</strong> Responsive design for desktop and mobile
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-md mt-12">
          <div>
            <h4 className="font-medium">Looking for older versions?</h4>
            <p className="text-sm text-muted-foreground">
              View the complete version history in our archives
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            View Archives
          </Button>
        </div>
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t">
        <Link href="/docs/get-started">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Previous: Get Started
          </Button>
        </Link>
        <div></div>
      </div>
    </div>
  );
}
