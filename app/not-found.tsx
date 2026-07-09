import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24">
      <div className="flex flex-col items-center max-w-md">
        {/* Large Branded 404 */}
        <h1 className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-300 select-none tracking-tight">
          404
        </h1>
        
        {/* Error message */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
          Timezone Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to another coordinate.
        </p>

        {/* Back link button */}
        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-900/10 active:scale-95 cursor-pointer text-sm"
        >
          Back to MeetMyZone
        </Link>
      </div>
    </div>
  );
}
