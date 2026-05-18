import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LookMe — Social Engagement Marketplace",
  description:
    "Buy followers, likes, views, reviews and more across every major platform. Fast delivery, real results.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <ToastProvider>
          <NavBar />

          <main className="flex-1">{children}</main>

        <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
