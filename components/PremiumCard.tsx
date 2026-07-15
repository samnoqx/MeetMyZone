import React from 'react';

interface PremiumCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
}

export default function PremiumCard({ icon, title, description, children, cta, className = '' }: PremiumCardProps) {
  return (
    <article className={`premium-interactive-card h-full ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-base sm:text-lg font-black text-txt-heading leading-snug">
            {title}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed font-medium">
          {description}
        </p>
        {children}
      </div>
      {cta}
    </article>
  );
}
