"use client";
import React, { useState } from 'react';

export default function ContactForm() {
  const [topic, setTopic] = useState('Bug Report');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = `MeetMyZone - ${topic}`;
    const mailtoBody = message;
    window.location.href = `mailto:support@meetmyzone.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
  };

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-xl flex flex-col gap-6">
      <form onSubmit={handleSendMessage} className="flex flex-col gap-5 text-xs sm:text-sm">
        
        {/* Field 1: Email Support */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-slate-700 dark:text-slate-200">
            Email Support Address
          </span>
          <div className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-mono">
            support@meetmyzone.com
          </div>
        </div>

        {/* Field 2: Topic */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="topic-select" className="font-bold text-slate-700 dark:text-slate-200">
            Topic
          </label>
          <select
            id="topic-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General Inquiry">General Inquiry / Hello</option>
          </select>
        </div>

        {/* Field 3: Message Preview */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message-textarea" className="font-bold text-slate-700 dark:text-slate-200">
            Message Preview
          </label>
          <textarea
            id="message-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder="Write your message here..."
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold py-3 rounded-full transition-all active:scale-[0.98] shadow-md text-xs sm:text-sm cursor-pointer mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Send Message
        </button>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
          Clicking send will construct and open a message inside your default email client.
        </p>
      </form>
    </div>
  );
}
