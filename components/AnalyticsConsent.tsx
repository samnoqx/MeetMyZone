'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { readSession, writeSession } from '@/utils/storage';

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<string | null>('loading');
  // Keep the site's existing public GA4 property when build variables are absent.
  // An explicit empty/invalid override still disables analytics.
  const id = process.env.NEXT_PUBLIC_GA_ID ?? 'G-W62TK5ME01';
  // Restore a choice from browser-only storage after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setChoice(readSession('mmz_analytics_consent')); }, []);
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  if (choice === 'yes') return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    <Script id="analytics-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)}, {anonymize_ip:true});`}</Script>
  </>;
  if (choice !== null) return null;
  const choose = (value: string) => { writeSession('mmz_analytics_consent', value); setChoice(value); };
  return <aside aria-label="Analytics preferences" className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-slate-500 bg-background p-4 shadow-xl text-txt-primary">
    <p>Allow optional analytics cookies to help improve MeetMyZone? Your planner works with either choice.</p>
    <div className="flex gap-4 mt-3">
      <button onClick={() => choose('no')} className="rounded border px-4 py-2">Decline</button>
      <button onClick={() => choose('yes')} className="rounded border px-4 py-2">Allow analytics</button>
    </div>
  </aside>;
}
