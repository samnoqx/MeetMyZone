import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/components/Footer';
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL('https://meetmyzone.com'),
  title: "Time Zone Converter, World Clock & Meeting Planner | MeetMyZone",
  description: "Compare time zones, check live world clocks and plan international meetings with MeetMyZone. Find local times, DST changes and working-hour overlaps for free.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  appleWebApp: {
    title: "MeetMyZone"
  },
  openGraph: {
    siteName: "MeetMyZone",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "MeetMyZone time tools" }]
  },
  twitter: { card: "summary_large_image", images: ["/og-default.png"] },
  alternates: {
    canonical: "https://meetmyzone.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-9430236853794521" />
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9430236853794521"
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://meetmyzone.com/#website",
              "name": "MeetMyZone",
              "alternateName": "Meet My Zone",
              "inLanguage": "en",
              "url": "https://meetmyzone.com"
            })
          }}
        />
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            function applyTheme() {
              try {
                var t = sessionStorage.getItem('meetmyzone-theme') || 'light';
                document.documentElement.setAttribute('data-theme', t);
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            }
            
            // Apply immediately on load
            applyTheme();
            
            // FORCE re-apply on back/forward navigation (BFCache)
            window.addEventListener('pageshow', function(e) {
              if (e.persisted) applyTheme();
            });
            
            // Re-apply when tab becomes visible again
            document.addEventListener('visibilitychange', function() {
              if (document.visibilityState === 'visible') applyTheme();
            });
          })();
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-txt-primary transition-colors duration-150 font-sans">
        <Analytics />

        {/* Spotlight Glow Effect */}
        <div className="fixed inset-0 pointer-events-none z-0 spotlight-glow" />

        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
