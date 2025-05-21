import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  ChevronRight,
  Book,
  FileText,
  ArrowRight,
  History,
  ArrowUpRight,
} from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-5xl mx-auto">
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
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="ml-1 text-sm font-medium text-foreground md:ml-2">
                Documentation
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-2 mb-6">
        <Book className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Documentation</h1>
      </div>

      <p className="text-muted-foreground mb-8 max-w-3xl">
        Welcome to the AI Playground documentation. Here you'll find
        comprehensive guides and documentation to help you start working with
        our AI text generation platform as quickly as possible.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Introduction Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Introduction
            </CardTitle>
            <CardDescription>
              Learn about AI Playground and its capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get an overview of the AI Playground platform, its key features,
              and common use cases. Learn about Retrieval-Augmented Generation
              (RAG) and how it enhances AI responses.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/docs/introduction" className="w-full">
              <Button
                variant="outline"
                className="w-full justify-between group"
              >
                Read Introduction
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Get Started Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Get Started
            </CardTitle>
            <CardDescription>Start using AI Playground quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Follow our step-by-step guide to set up your environment,
              configure your API key, generate your first texts, and learn how
              to use RAG with your own knowledge base.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/docs/get-started" className="w-full">
              <Button
                variant="outline"
                className="w-full justify-between group"
              >
                View Guide
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Changelog Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Changelog
            </CardTitle>
            <CardDescription>Track updates and improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stay informed about the latest features, improvements, and bug
              fixes. Our detailed changelog helps you keep track of all updates
              to the AI Playground platform.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/docs/changelog" className="w-full">
              <Button
                variant="outline"
                className="w-full justify-between group"
              >
                View Changelog
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 border rounded-lg p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <p className="mb-6">
          Can't find what you're looking for? Check out these additional
          resources or contact our support team.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            FAQ
          </Button>
          <Button variant="outline" className="justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
            API Reference
          </Button>
          <Button variant="outline" className="justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
