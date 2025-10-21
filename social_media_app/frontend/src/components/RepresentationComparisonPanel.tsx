import React from "react";
import { BarGraph } from "./BarGraph";
import type { AudienceStatistics } from "@/types/audienceStats";
import {
  calculateDivergence,
  getWarningMessage,
  compareDominantAttitudes,
} from "@/lib/comparisonUtils";

interface RepresentationComparisonPanelProps {
  stats: AudienceStatistics;
  commenterCount: number;
  className?: string;
}

/**
 * Representation Comparison Panel (Variant C - Comparison)
 * Shows side-by-side comparison of commenter vs all viewer attitudes
 */
export function RepresentationComparisonPanel({
  stats,
  commenterCount,
  className = "",
}: RepresentationComparisonPanelProps) {
  const divergence = calculateDivergence(
    stats.commenterAttitudes,
    stats.attitudes
  );
  const comparison = compareDominantAttitudes(
    stats.commenterAttitudes,
    stats.attitudes
  );
  const warningMessage = getWarningMessage(divergence);

  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-sm dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          <span>📊</span>
          <span>Representation Comparison</span>
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          How do commenters compare to all viewers?
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Commenters Column */}
        <div>
          <div className="mb-4 rounded-lg bg-white p-4 dark:bg-neutral-800">
            <h4 className="mb-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Among COMMENTERS
            </h4>
            <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
              {commenterCount} {commenterCount === 1 ? "person" : "people"}
            </p>
            <BarGraph
              label="Support"
              percentage={stats.commenterAttitudes.support}
              color="bg-green-500"
            />
            <BarGraph
              label="Neutral"
              percentage={stats.commenterAttitudes.neutral}
              color="bg-gray-500"
            />
            <BarGraph
              label="Oppose"
              percentage={stats.commenterAttitudes.oppose}
              color="bg-orange-500"
            />
          </div>
          <div className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Dominant: <span className="capitalize">{comparison.commenters}</span>
          </div>
        </div>

        {/* All Viewers Column */}
        <div>
          <div className="mb-4 rounded-lg bg-white p-4 dark:bg-neutral-800">
            <h4 className="mb-1 text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Among ALL VIEWERS
            </h4>
            <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
              {stats.viewerCount.toLocaleString()}{" "}
              {stats.viewerCount === 1 ? "person" : "people"}
            </p>
            <BarGraph
              label="Support"
              percentage={stats.attitudes.support}
              color="bg-green-500"
            />
            <BarGraph
              label="Neutral"
              percentage={stats.attitudes.neutral}
              color="bg-gray-500"
            />
            <BarGraph
              label="Oppose"
              percentage={stats.attitudes.oppose}
              color="bg-orange-500"
            />
          </div>
          <div className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Dominant: <span className="capitalize">{comparison.viewers}</span>
          </div>
        </div>
      </div>

      {/* Divergence Indicator */}
      <div className="mb-4 rounded-lg bg-purple-100 p-3 text-center dark:bg-purple-900/20">
        <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
          Divergence Level: {Math.round(divergence)}%
          {comparison.areDifferent && (
            <span className="ml-2 text-xs">
              (Commenters lean {comparison.commenters}, viewers lean {comparison.viewers})
            </span>
          )}
        </p>
      </div>

      {/* Warning Message */}
      <div
        className={`rounded-lg border p-4 text-sm ${
          divergence > 20
            ? "border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200"
            : divergence > 10
              ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200"
              : "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
        }`}
      >
        <p className="font-medium">{warningMessage}</p>
        {comparison.areDifferent && (
          <p className="mt-2 text-xs">
            The people commenting on this post have notably different views than
            those who are just viewing it.
          </p>
        )}
      </div>
    </div>
  );
}

