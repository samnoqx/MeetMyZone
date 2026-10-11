'use client';
import Script from 'next/script';

export default function Analytics() {
  // Keep the site's existing public GA4 property when build variables are absent.
  // An explicit empty/invalid override still disables analytics.
  const id = process.env.NEXT_PUBLIC_GA_ID ?? 'G-W62TK5ME01';
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    <Script id="analytics-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)}, {anonymize_ip:true});`}</Script>
  </>;
}
