'use client';

import React, { useState, useEffect, useRef } from 'react';

type ThemeType = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const syncThemeState = () => {
      const savedTheme = localStorage.getItem('meetmyzone-theme') || localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme as ThemeType);
      } else {
        setTheme('light');
      }
    };

    syncThemeState();
    
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
    });

    window.addEventListener('storage', syncThemeState);
    window.addEventListener('pageshow', syncThemeState);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('storage', syncThemeState);
      window.removeEventListener('pageshow', syncThemeState);
    };
  }, []);

  // Listen for click-outside and Escape key when popover is open
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setIsOpen(false);
    
    // Apply stable root attribute data-theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Toggle standard tailwind .dark class for backwards compatibility
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Persist user selection
    try {
      localStorage.setItem('meetmyzone-theme', newTheme);
      // Deprecate legacy key
      localStorage.removeItem('theme');
    } catch {}
  };

  if (!mounted) {
    return (
      <div className="w-[38px] h-[38px] rounded-lg border border-border-custom bg-surf-1" />
    );
  }

  // Icons based on selected state
  const sunIcon = (
    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const moonIcon = (
    <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  const getActiveIcon = () => {
    switch (theme) {
      case 'light': return sunIcon;
      case 'dark': return moonIcon;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      
      {/* Popover trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="p-2.5 rounded-lg border border-border-custom bg-surf-1 hover:bg-surf-2 hover:border-brand-accent transition-all duration-150 shadow-xs active:scale-[0.95] cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        title="Change Appearance Mode"
        aria-label="Change Appearance Mode"
      >
        <span className="hover:rotate-12 transition-transform duration-300">
          {getActiveIcon()}
        </span>
      </button>

      {/* Popover list options */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-border-custom bg-surf-1 shadow-lg p-2.5 z-50 origin-top-right focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150 select-none"
        >
          
          <div className="text-[10px] font-mono font-black text-txt-muted uppercase tracking-widest px-3 py-1.5 border-b border-border-custom mb-1.5 leading-none">
            APPEARANCE
          </div>

          <div className="flex flex-col gap-1">
            
            {/* LIGHT option */}
            <button
              onClick={() => selectTheme('light')}
              role="option"
              aria-selected={theme === 'light'}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                theme === 'light'
                  ? 'bg-brand-accent-surface border border-brand-accent/20 text-brand-accent-deep'
                  : 'hover:bg-surf-2 border border-transparent hover:border-brand-accent text-txt-primary'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/10 flex items-center justify-center shrink-0">
                {sunIcon}
              </div>
              <div className="flex flex-col gap-0.5 leading-tight">
                <span className="text-xs font-black">LIGHT</span>
                <span className="text-[10px] text-txt-muted font-bold">Clean and professional</span>
              </div>
              {theme === 'light' && (
                <svg className="w-4 h-4 ml-auto text-brand-accent-hover shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* DARK option */}
            <button
              onClick={() => selectTheme('dark')}
              role="option"
              aria-selected={theme === 'dark'}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                theme === 'dark'
                  ? 'bg-brand-accent-surface border border-brand-accent/20 text-brand-accent-deep'
                  : 'hover:bg-surf-2 border border-transparent hover:border-brand-accent text-txt-primary'
              }`}
            >
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/10 flex items-center justify-center shrink-0">
                {moonIcon}
              </div>
              <div className="flex flex-col gap-0.5 leading-tight">
                <span className="text-xs font-black">DARK</span>
                <span className="text-[10px] text-txt-muted font-bold">Deep night appearance</span>
              </div>
              {theme === 'dark' && (
                <svg className="w-4 h-4 ml-auto text-brand-accent-hover shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
