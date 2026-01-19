import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter as FontSans } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Providers } from "../providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    metadataBase: new URL("https://crayobois.ca"),
    title: messages.metadata.title,
    description: messages.metadata.description,
    appleWebApp: true,
    manifest: "/site.webmanifest",
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
      { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    ],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <Providers>
        <NextIntlClientProvider messages={messages}>
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
            {process.env.VERCEL_ENV === "production" && <Analytics />}
          </body>
        </NextIntlClientProvider>
      </Providers>
    </html>
  );
}
