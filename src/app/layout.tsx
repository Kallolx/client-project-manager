import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "kallol.me — Digital Solutions & Development",
  description:
    "Professional web development, UI/UX design, and digital solutions. Start your project with kallol.me today.",
  keywords: ["web development", "UI/UX", "SaaS", "freelance developer", "kallol.me"],
  authors: [{ name: "Kallol", url: "https://kallol.me" }],
  openGraph: {
    title: "kallol.me — Digital Solutions & Development",
    description:
      "Professional web development, UI/UX design, and digital solutions.",
    url: "https://kallol.me",
    siteName: "kallol.me",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.18 0.025 250)",
              border: "1px solid oklch(0.30 0.04 250)",
              color: "oklch(0.97 0.005 250)",
            },
          }}
        />
      </body>
    </html>
  );
}
