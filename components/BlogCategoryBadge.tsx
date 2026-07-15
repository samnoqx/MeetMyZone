import React from 'react';

interface BlogCategoryBadgeProps {
  category: string;
  className?: string;
}

export default function BlogCategoryBadge({ category, className = '' }: BlogCategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black tracking-[0.12em] uppercase bg-brand-accent-surface border border-brand-accent-surface-strong text-brand-accent-deep dark:text-brand-accent w-fit transition-colors duration-200 ${className}`}
    >
      {category}
    </span>
  );
}
