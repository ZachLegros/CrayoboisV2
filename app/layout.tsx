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
  title: "Crayobois - Le stylo qu'il vous faut",
  description: `Crayobois est une microentreprise de menuiserie québécoise spécialisée dans la fabrication de stylos en bois divers de haute qualité.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main
            className={twMerge(
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
              <p>© {new Date().getFullYear()} Crayobois</p>
            </footer>
          </main>
        </Providers>
      </body>
    </html>
  );
}
