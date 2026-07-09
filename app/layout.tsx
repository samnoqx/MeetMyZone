import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/components/Footer';
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL('https://meetmyzone.com'),
  title: "MeetMyZone — Global Time Zone Converter & Plan Perfect Meetings Worldwide",
  description: "Instantly check live times across 190+ countries with MeetMyZone's precision World Clock, or visualize working-hour overlaps to find the perfect meeting slot. Save your favorite locations, share schedules with one click, and coordinate global teams—all for free, with no login required.",
  manifest: "/site.webmanifest",
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
                var t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // Default to dark mode for everyone
                  document.documentElement.classList.add('dark');
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
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-200">
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
