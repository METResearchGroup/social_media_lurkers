"use client";

import React, { useState } from "react";

interface TrustIndicatorProps {
  icon?: string;
  label: string;
  tooltipContent: string;
  className?: string;
}

/**
 * Trust indicator component with tooltip
 * Displays information icon with hover tooltip for methodology and privacy
 */
export function TrustIndicator({
  icon = "ℹ️",
  label,
  tooltipContent,
  className = "",
}: TrustIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={`More information: ${label}`}
      >
        <span>{icon}</span>
        <span className="underline decoration-dotted">{label}</span>
      </button>

      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 transform"
          role="tooltip"
        >
          <div className="rounded-lg border border-neutral-300 bg-white p-3 text-xs text-neutral-700 shadow-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200">
            <div className="whitespace-pre-line">{tooltipContent}</div>
            {/* Arrow */}
            <div className="absolute left-1/2 top-full -ml-2 border-8 border-transparent border-t-white dark:border-t-neutral-800"></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MethodologyTooltipProps {
  viewerCount: number;
  className?: string;
}

/**
 * Pre-configured methodology tooltip
 */
export function MethodologyTooltip({ viewerCount, className }: MethodologyTooltipProps) {
  const tooltipContent = `These statistics are based on ${viewerCount} viewers who accessed this post in the last 24 hours.

Political affiliations and attitudes are derived from user profile data and engagement patterns.

Updated every hour to reflect current audience.`;

  return (
    <TrustIndicator
      icon="ℹ️"
      label="How is this calculated?"
      tooltipContent={tooltipContent}
      className={className}
    />
  );
}

interface PrivacyTooltipProps {
  className?: string;
}

/**
 * Pre-configured privacy tooltip
 */
export function PrivacyTooltip({ className }: PrivacyTooltipProps) {
  const tooltipContent = `Your privacy is protected:

• Individual views are never shown
• Data is aggregated and anonymized
• Only statistical summaries are displayed
• No personally identifiable information is revealed`;

  return (
    <TrustIndicator
      icon="🔒"
      label="Privacy guarantee"
      tooltipContent={tooltipContent}
      className={className}
    />
  );
}

