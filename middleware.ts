import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Check if it's the workers.dev domain or wildcard subdomains
  const isWorkersDev = 
    host === 'meetmyzone.shamsher2812003.workers.dev' || 
    host.endsWith('-meetmyzone.shamsher2812003.workers.dev') ||
    host.endsWith('.meetmyzone.shamsher2812003.workers.dev');

  const response = NextResponse.next();

  if (isWorkersDev) {
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
