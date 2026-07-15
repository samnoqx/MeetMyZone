import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/components/Footer';
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL('https://meetmyzone.com'),
  title: "MeetMyZone — Global Time Zone Converter & Plan Perfect Meetings Worldwide",
  description: "Instantly check live times across 190+ countries with MeetMyZone's precision World Clock, or visualize working-hour overlaps to find the perfect meeting slot. Save your favorite locations, share schedules with one click, and coordinate global teams—all for free, with no login required.",
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
    siteName: "MeetMyZone"
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MeetMyZone",
              "url": "https://meetmyzone.com"
            })
          }}
        />
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            function applyTheme() {
              try {
                var t = localStorage.getItem('meetmyzone-theme') || localStorage.getItem('theme') || 'light';
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
        {/* Google AdSense / CMP Integration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-W62TK5ME01"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W62TK5ME01');
          `}
        </Script>

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
