import React from "react";
import { BarGraphGroup } from "./BarGraph";
import { MethodologyTooltip, PrivacyTooltip } from "./TrustIndicator";
import type { AudienceStatistics } from "@/types/audienceStats";

interface AudienceStatisticsPanelProps {
  stats: AudienceStatistics;
  className?: string;
}

/**
 * Audience Statistics Panel (Variant B - Treatment)
 * Displays political breakdown, attitudes, and trust indicators
 */
export function AudienceStatisticsPanel({
  stats,
  className = "",
}: AudienceStatisticsPanelProps) {
  const politicalData = [
    {
      label: "Liberal",
      percentage: stats.political.liberal,
      color: "bg-blue-500",
    },
    {
      label: "Moderate",
      percentage: stats.political.moderate,
      color: "bg-purple-500",
    },
    {
      label: "Conservative",
      percentage: stats.political.conservative,
      color: "bg-red-500",
    },
  ];

  const attitudeData = [
    {
      label: "Support",
      percentage: stats.attitudes.support,
      color: "bg-green-500",
    },
    {
      label: "Neutral",
      percentage: stats.attitudes.neutral,
      color: "bg-gray-500",
    },
    {
      label: "Oppose",
      percentage: stats.attitudes.oppose,
      color: "bg-orange-500",
    },
  ];

  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
            <span>👁️</span>
            <span>Audience Statistics</span>
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {stats.viewerCount.toLocaleString()} people viewed this post
          </p>
        </div>
      </div>

      {/* Political Breakdown */}
      <BarGraphGroup
        title="Political Breakdown"
        data={politicalData}
        className="mb-5"
      />

      {/* Attitudes on This Post */}
      <BarGraphGroup
        title="Attitudes on This Post"
        data={attitudeData}
        className="mb-5"
      />

      {/* Trust Indicators */}
      <div className="flex flex-wrap gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
        <MethodologyTooltip viewerCount={stats.viewerCount} />
        <PrivacyTooltip />
      </div>

      {/* Important Note */}
      <div className="mt-4 rounded-lg bg-blue-100 p-3 text-xs text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
        <p className="font-medium">
          ℹ️ These statistics show ALL viewers, not just those who commented.
        </p>
      </div>
    </div>
  );
}

interface CommentsWarningBannerProps {
  className?: string;
}

/**
 * Warning banner to display above comments section
 */
export function CommentsWarningBanner({ className = "" }: CommentsWarningBannerProps) {
  return (
    <div
      className={`rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-900/20 ${className}`}
    >
      <p className="font-medium text-amber-900 dark:text-amber-200">
        ⚠️ Note: Comments may not represent all viewers. See audience statistics above.
      </p>
    </div>
  );
}

