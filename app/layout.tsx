import "./globals.css";
import { Providers } from "./providers";
import { Inter as FontSans } from "next/font/google";
import NavBar from "@/components/NavBar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Crayobois - Le stylo qu'il vous faut",
  description: `Crayobois est une microentreprise de menuiserie québécoise spécialisée dans la fabrication de stylos en bois divers de haute qualité.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={cn(
            "bg-background-content text-foreground font-sans antialiased min-h-screen",
            fontSans.variable
          )}
          suppressHydrationWarning={true}
        >
          <NavBar />
          <main className="flex flex-col min-h-[calc(100vh-72px)] max-w-screen-xl mx-auto px-3 md:px-4 lg:px-6">
            <div className="flex-grow py-3 md:py-6">{children}</div>
            <footer className="w-full border-t p-8 mt-auto">
              <p className="text-center text-xs">
                © {new Date().getFullYear()} Crayobois
              </p>
            </footer>
          </main>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
