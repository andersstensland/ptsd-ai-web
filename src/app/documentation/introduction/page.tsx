import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  ChevronRight,
  Book,
  FileText,
  ArrowRight,
  History,
} from "lucide-react";

export default function IntroductionPage() {
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
                Introduction
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Introduction</h1>
      </div>

      <div className="prose max-w-none">
        <p className="lead">
          Welcome to the AI Playground documentation. This guide will help you
          understand the capabilities and features of our AI text generation
          platform.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          What is AI Playground?
        </h2>
        <p>
          AI Playground is a powerful interface for interacting with
          state-of-the-art language models. It allows you to generate text,
          explore different parameters, and leverage Retrieval-Augmented
          Generation (RAG) to enhance responses with your own knowledge base.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Text Generation:</strong> Create content, answer questions,
            and generate creative text formats.
          </li>
          <li>
            <strong>Parameter Customization:</strong> Fine-tune model behavior
            with temperature, top-p, and maximum length settings.
          </li>
          <li>
            <strong>Multiple Models:</strong> Access various AI models including
            GPT-3.5, GPT-4, and more.
          </li>
          <li>
            <strong>Retrieval-Augmented Generation (RAG):</strong> Enhance
            responses with your own knowledge base for more accurate and
            contextual answers.
          </li>
          <li>
            <strong>Knowledge Base Management:</strong> Upload documents and manage your sources for RAG.
          </li>
          <li>
            <strong>Customizable Settings:</strong> Configure default behaviors
            and advanced options to suit your workflow.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Use Cases</h2>
        <p>AI Playground can be used for a variety of purposes, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Content creation and copywriting</li>
          <li>Question answering and research assistance</li>
          <li>Code generation and explanation</li>
          <li>Creative writing and brainstorming</li>
          <li>Document summarization and analysis</li>
          <li>Building custom AI applications with the API</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">About RAG</h2>
        <p>
          Retrieval-Augmented Generation (RAG) is a technique that enhances
          large language models by retrieving relevant information from external
          sources before generating responses. This allows the AI to provide
          more accurate, up-to-date, and contextually relevant answers based on
          your specific knowledge base.
        </p>
        <p>
          With our RAG implementation, you can upload documents, connect to
          databases, or crawl websites to create a custom knowledge base that
          the AI will reference when generating responses.
        </p>

        <div className="bg-muted p-6 rounded-lg mt-8">
          <h3 className="text-lg font-medium mb-2">Key Benefits of RAG</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reduces hallucinations and factual errors in AI responses</li>
            <li>
              Provides up-to-date information beyond the AI's training data
            </li>
            <li>Allows for domain-specific knowledge integration</li>
            <li>Improves response relevance and accuracy</li>
            <li>Enables source citation for better transparency</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t">
        <div></div>
        <Link href="/docs/get-started">
          <Button className="flex items-center gap-2">
            Next: Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
