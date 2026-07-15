"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function ContactForm() {
  const [topic, setTopic] = useState('General Question');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = `MeetMyZone - ${topic}`;
    const mailtoBody = message;
    window.location.href = `mailto:support@meetmyzone.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const options = [
    'General Question',
    'Bug Report',
    'Feature Request',
    'Partnership',
    'Business Inquiry',
    'Feedback',
    'Other'
  ];

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-xl flex flex-col gap-6">
      <form onSubmit={handleSendMessage} className="flex flex-col gap-5 text-xs sm:text-sm">
        
        {/* Field 1: Email Support */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-slate-700 dark:text-slate-200">
            Support Email
          </span>
          <div className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-mono">
            support@meetmyzone.com
          </div>
        </div>

        {/* Field 2: Topic */}
        <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
          <label htmlFor="topic-select" className="font-bold text-slate-700 dark:text-slate-200">
            Topic
          </label>
          <button
            id="topic-select"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 text-left focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 transition-all duration-150 cursor-pointer select-none"
          >
            <span>{topic}</span>
            <svg className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div
              role="listbox"
              className="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-20 p-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-100 select-none"
            >
              {options.map((opt) => {
                const isSelected = topic === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setTopic(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-accent-surface border border-brand-accent/15 text-brand-accent-deep dark:text-brand-accent'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-brand-accent-surface hover:text-brand-accent-deep dark:hover:text-brand-accent border border-transparent'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Field 3: Message Textarea */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message-textarea" className="font-bold text-slate-700 dark:text-slate-200">
            Your Message
          </label>
          <textarea
            id="message-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder="Write your message here..."
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/80 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-all duration-150"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-accent hover:bg-brand-accent-hover text-slate-955 dark:bg-slate-950 dark:text-white font-extrabold py-3 rounded-full dark:rounded-lg transition-all active:scale-[0.98] shadow-md text-xs sm:text-sm cursor-pointer mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent border border-slate-950/5 dark:border-brand-accent/40 dark:hover:bg-slate-950 dark:hover:text-brand-accent dark:hover:border-brand-accent/40"
        >
          Send Message
        </button>
        <div className="flex flex-col gap-1 text-center">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Clicking &apos;Send Message&apos; will open your default email application with your message pre-filled. No information is stored on our servers.
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            We aim to respond to most inquiries within 1–3 business days.
          </p>
        </div>
      </form>
    </div>
  );
}
