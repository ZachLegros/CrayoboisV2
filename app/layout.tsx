import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import NavBar from "@/components/NavBar";
import { Toaster } from "sonner";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Providers>
          <main
            className={twMerge(
              "dark",
              GeistSans.className,
              "flex flex-col items-center min-h-screen max-w-screen-xl mx-auto"
            )}
          >
            <Toaster richColors />
            <Suspense>
              <NavBar />
            </Suspense>
            <div className="w-full h-full p-6">{children}</div>
            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs mt-auto">
              <p>
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase
                </a>
              </p>
            </footer>
          </main>
        </Providers>
      </body>
    </html>
  );
}
