import React from "react";

interface BarGraphProps {
  label: string;
  percentage: number;
  color?: string;
  showPercentage?: boolean;
}

/**
 * Bar graph visualization component
 * Displays a horizontal bar with label and percentage
 */
export function BarGraph({
  label,
  percentage,
  color = "bg-blue-500",
  showPercentage = true,
}: BarGraphProps) {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
        {showPercentage && (
          <span className="text-neutral-600 dark:text-neutral-400">
            {clampedPercentage}%
          </span>
        )}
      </div>
      <div className="h-6 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
          role="progressbar"
          aria-valuenow={clampedPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${clampedPercentage}%`}
        />
      </div>
    </div>
  );
}

interface BarGraphGroupProps {
  title: string;
  data: Array<{
    label: string;
    percentage: number;
    color?: string;
  }>;
  className?: string;
}

/**
 * Group of related bar graphs with a title
 */
export function BarGraphGroup({ title, data, className = "" }: BarGraphGroupProps) {
  return (
    <div className={className}>
      <h4 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h4>
      {data.map((item) => (
        <BarGraph
          key={item.label}
          label={item.label}
          percentage={item.percentage}
          color={item.color}
        />
      ))}
    </div>
  );
}

