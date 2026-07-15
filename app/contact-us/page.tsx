import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from '../../components/ContactForm';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: "Contact Us | MeetMyZone",
  description: "Get in touch with the MeetMyZone support team. Submit bug reports, feature requests, or general inquiries directly to our developer.",
  alternates: {
    canonical: "https://meetmyzone.com/contact-us"
  }
};

const ArrowLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);


export default function ContactUsPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us | MeetMyZone",
    "description": "Get in touch with the MeetMyZone support team. Submit bug reports, feature requests, or general inquiries.",
    "url": "https://meetmyzone.com/contact-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "MeetMyZone",
      "url": "https://meetmyzone.com",
      "logo": "https://meetmyzone.com/logo.png"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MeetMyZone",
    "url": "https://meetmyzone.com",
    "logo": "https://meetmyzone.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@meetmyzone.com",
      "contactType": "customer service"
    }
  };

  return (
    <div className="min-h-screen bg-background text-txt-primary flex flex-col font-sans transition-colors duration-200">
      
      {/* Sanitize and inject JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-border-custom flex justify-between items-center bg-background">
        <Link href="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-brand-accent transition duration-200">
          <ArrowLeftIcon size={16} />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center pr-8 sm:pr-10">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center gap-6">
        
        {/* Brand & Centered Header (Card/Box Style) */}
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-xl flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2 justify-center select-none">
            <img
              src="/logo.png"
              alt="MeetMyZone Logo"
              className="h-[42px] md:h-12 w-auto object-contain"
            />
            <div className="h-[20px] md:h-[22px] flex items-center translate-y-[4px]">
              <img
                src="/wordmark.png"
                alt="MeetMyZone"
                className="h-[20px] md:h-[22px] w-auto object-contain dark:hidden"
              />
              <img
                src="/wordmark-dark.png"
                alt="MeetMyZone"
                className="h-[20px] md:h-[22px] w-auto object-contain hidden dark:block"
              />
            </div>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
            We&apos;re here to help. Whether you have a question, found an issue, or would like to discuss a partnership, our team is ready to assist.
          </p>
        </div>

        {/* The Client Form Component */}
        <ContactForm />

        {/* Detailed Copy & AdSense Compliance Sections */}
        <div className="w-full max-w-lg mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-6 border-t border-slate-200 dark:border-slate-800 pt-8 leading-relaxed font-sans">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              Response Standards & Support
            </h2>
            <p>
              MeetMyZone is committed to providing reliable, professional support for users of our platform. We review inquiries related to technical issues, feature suggestions, partnership opportunities, business inquiries, and general questions.
            </p>
            <p>
              Our goal is to respond to most legitimate requests within <strong>1–3 business days</strong>. Security-related reports and critical platform issues are prioritized whenever possible.
            </p>
            <p>
              When reporting a timezone calculation issue, please include the affected locations, dates, times, and a clear description of the expected result. Providing complete information helps our team investigate and resolve issues more efficiently.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              Privacy & Secure Communication
            </h2>
            <p>
              Protecting user privacy is one of MeetMyZone&apos;s core commitments.
            </p>
            <p>
              Support communications are handled using trusted infrastructure and industry-standard security practices. MeetMyZone does not sell personal information, and support requests are used solely to provide assistance and improve the platform.
            </p>
            <p>
              For complete information about how user data is handled, please review our <Link href="/privacy-policy" className="hover:text-teal-600 hover:underline font-semibold">Privacy Policy</Link> and <Link href="/terms-of-service" className="hover:text-teal-600 hover:underline font-semibold">Terms of Service</Link>.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              Continuous Improvement
            </h2>
            <p>
              MeetMyZone is continuously improving through ongoing development, platform optimization, and user feedback.
            </p>
            <p>
              Our mission is to simplify global time coordination by providing accurate, reliable, and user-friendly tools for individuals, businesses, remote teams, educators, freelancers, and organizations worldwide.
            </p>
            <p>
              Every platform update is focused on improving performance, usability, reliability, and the overall user experience.
            </p>
          </section>

          {/* Internal Footer Navigation Links */}
          <section className="flex flex-wrap justify-center gap-x-8 gap-y-2 border-t border-slate-200 dark:border-slate-800 pt-6 text-xs sm:text-sm font-semibold">
            <Link href="/about-us" className="text-slate-500 dark:text-slate-400 hover:text-brand-accent transition duration-150">
              About Us
            </Link>
            <Link href="/privacy-policy" className="text-slate-500 dark:text-slate-400 hover:text-brand-accent transition duration-150">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-slate-500 dark:text-slate-400 hover:text-brand-accent transition duration-150">
              Terms of Service
            </Link>
          </section>
        </div>

      </main>
    </div>
  );
}
