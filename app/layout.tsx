import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://crayobois.ca"),
  title: "Crayobois - Le stylo qu'il vous faut",
  description:
    "Crayobois est une microentreprise de menuiserie québécoise spécialisée dans la fabrication de stylos en bois divers de haute qualité.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={cn(
            "bg-background-content text-foreground font-sans antialiased min-h-screen",
            fontSans.variable,
          )}
          suppressHydrationWarning={true}
        >
          <NavBar />
          <main className="flex flex-col min-h-[calc(100vh-72px)] max-w-screen-xl mx-auto px-3 md:px-4 lg:px-6">
            <div className="flex flex-col flex-auto py-3 md:py-6">{children}</div>
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
