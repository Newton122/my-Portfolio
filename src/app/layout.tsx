import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, JetBrains_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers'
import Preloader from '@/components/Preloader'

// Body face --- open and friendly, easy to read at length.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display face --- a grotesque with some character in its curves.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Data face --- everything the machine would print: dates, tags,
// periods, section markers.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

// Signature face --- used for one thing only: his name. A script next to
// mono field labels reads as the person behind the machine output.
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brighton Matikiti --- Data & AI Engineer",
  description: "Brighton Matikiti --- AI Engineering student at USTHB, building practical software with data, machine learning and modern web technologies.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e13" },
  ],
};

// Runs before first paint so the page never flashes the wrong theme.
const themeInit = `
(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${bricolage.variable} ${jetbrainsMono.variable} ${greatVibes.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-base text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-signal-solid focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-signal-on"
        >
          Skip to content
        </a>
        {/* Sits outside Providers: ClientProviders is ssr:false, so
            anything inside it only appears after hydration. The curtain
            has to be in the first paint to be worth having. */}
        <Preloader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
