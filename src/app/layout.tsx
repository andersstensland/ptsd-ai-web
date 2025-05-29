import { AppSidebar } from "@/components/app-sidebar";
import { GlobalUploadNotification } from "@/components/global-upload-notification";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { NotificationProvider } from "@/lib/notification-context";
import { UploadProvider } from "@/lib/upload-context";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PTSD Research Assistant",
  description: "Generate and manage knowledge bases for PTSD research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          <UploadProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                {children}
              </SidebarInset>
            </SidebarProvider>
            <GlobalUploadNotification />
            <Toaster 
              position="top-right"
              expand={false}
              richColors
              closeButton
            />
          </UploadProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
