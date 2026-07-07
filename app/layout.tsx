import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "MeetMyZone | Visual Timezone Meeting Planner",
  description: "Find perfect meeting overlaps across global timezones. Free tool for remote teams.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "MeetMyZone"
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
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            function applyTheme() {
              try {
                var t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  // System preference fallback
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
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
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-250">
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
