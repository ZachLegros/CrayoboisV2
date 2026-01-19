// Root layout - children are rendered by [locale]/layout.tsx
// This file is required by Next.js but the actual layout is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
