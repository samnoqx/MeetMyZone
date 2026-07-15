'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  actions?: React.ReactNode;
}

export default function Header({ actions }: HeaderProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toolsList = [
    { name: 'Time Zone Converter', href: '/timezone-converter', desc: 'Convert time zone offsets & DST schedules.' },
    { name: 'City Time Converter', href: '/city-time-converter', desc: 'Compare live times between major global cities.' },
    { name: 'Current Time Clocks', href: '/current-time', desc: 'Check local hours, dates, and offsets worldwide.' },
    { name: 'Meeting Planner', href: '/meeting-planner', desc: 'Find perfect working hour overlaps for global teams.' },
    { name: 'All Tools', href: '/tools', desc: 'Browse all MeetMyZone time zone tools.' }
  ];

  return (
    <header className="w-full border-b border-border-custom bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2 group select-none">
          <img
            src="/logo.png"
            alt="MeetMyZone Logo"
            className="h-[38.64px] md:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          {isHomepage ? (
            <div className="h-[16.56px] md:h-5 flex items-center translate-y-[2px]">
              <img
                src="/wordmark.png"
                alt="MeetMyZone"
                className="h-[16.56px] md:h-5 w-auto object-contain dark:hidden"
              />
              <img
                src="/wordmark-dark.png"
                alt="MeetMyZone"
                className="h-[16.56px] md:h-5 w-auto object-contain hidden dark:block"
              />
            </div>
          ) : (
            <span className="font-black text-xl tracking-tight text-txt-heading">
              MeetMyZone
            </span>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary Desktop Nav" className="hidden md:flex items-center gap-6">
          
          {/* Tools Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              aria-haspopup="true"
              aria-expanded={isToolsOpen}
              className={`flex items-center gap-1.5 text-sm font-bold transition-colors py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-md ${
                isToolsOpen ? 'text-brand-accent-hover' : 'text-txt-secondary hover:text-brand-accent-hover'
              }`}
            >
              Tools
              <svg className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isToolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl bg-surf-1 border border-border-custom shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {toolsList.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    onClick={() => setIsToolsOpen(false)}
                    className="group flex flex-col gap-0.5 px-4 py-2 hover:bg-surf-2 focus:bg-surf-2 text-left transition-colors rounded-lg focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-bold text-txt-primary group-hover:text-brand-accent-hover group-focus:text-brand-accent-hover transition-colors duration-150">{tool.name}</span>
                    <span className="text-[10px] text-txt-muted leading-normal">{tool.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/meeting-planner"
            className="text-sm font-bold text-txt-secondary hover:text-brand-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-md"
          >
            Meeting Planner
          </Link>

          <Link
            href="/blog"
            className="text-sm font-bold text-txt-secondary hover:text-brand-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-md"
          >
            Guides
          </Link>

        </nav>

        {/* Global Controls & Mobile Toggle */}
        <div className="flex items-center gap-3">
          
          {/* External Action Component Slot (e.g., Planner ShareMenu) */}
          {actions}

          <ThemeToggle />

          {/* Plan a Meeting CTA */}
          <Link
            href="/meeting-planner"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.95] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent border border-slate-950/5"
          >
            Plan a Meeting
          </Link>

          {/* Hamburger Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-border-custom hover:bg-surf-2 text-txt-secondary transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>

      </div>

      {/* Accessible Mobile Menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200">
          <div className="w-full bg-surf-1 border-b border-border-custom px-6 py-6 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top duration-250">
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-txt-muted uppercase font-black">TOOLS & PRODUCTS</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {toolsList.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col gap-0.5 p-2 rounded-lg border border-border-soft bg-surf-2 hover:bg-surf-3 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-txt-primary">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <hr className="border-border-custom" />

            <Link
              href="/meeting-planner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-bold text-txt-primary hover:text-brand-accent-hover transition-colors"
            >
              Meeting Planner
            </Link>

            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-bold text-txt-primary hover:text-brand-accent-hover transition-colors"
            >
              Guides
            </Link>

            <Link
              href="/meeting-planner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-black text-sm shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              Plan a Meeting
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}
