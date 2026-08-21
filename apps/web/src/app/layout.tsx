import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "N5Deal — M&A Marketplace",
  description: "Buy-side and sell-side matching for M&A opportunities and financial assets.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "N5Deal",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1220",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
