import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Check if it's the workers.dev domain or wildcard subdomains
  // Block search crawlers on staging/preview/workers domains, but keep production open
  const isStagingOrPreview = 
    host.endsWith('.workers.dev') ||
    host.endsWith('.pages.dev') ||
    host.endsWith('.cloudflareworkers.com') ||
    host.includes('staging') ||
    host.includes('preview') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1');

  const response = NextResponse.next();

  if (isStagingOrPreview) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: [
    // Match all page routes and special files (like robots.txt, sitemap.xml)
    // Exclude static assets (js, css, images) to avoid overhead
    '/((?!_next/static|_next/image|favicon.ico|icon.png|logo.png).*)',
  ],
};
