"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePostVariant } from "@/hooks/usePostVariant";
import { POST_VARIANTS, VARIANT_DISPLAY_NAMES, type PostVariant } from "@/types/variants";

/**
 * Variant Toggle Component
 * Allows manual switching between variants for testing purposes
 * Only visible in development mode
 */
export function VariantToggle() {
  const { variant, setManualOverride, clearOverride } = usePostVariant();
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleVariantSelect = (selectedVariant: PostVariant) => {
    setManualOverride(selectedVariant);
    setIsExpanded(false);
  };

  const handleClear = () => {
    clearOverride();
    setIsExpanded(false);
  };

  return (
    <div ref={dropdownRef} className="fixed right-4 top-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 rounded-lg border-2 border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-lg transition-all hover:bg-blue-50 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"
        aria-label="Toggle variant selector"
        aria-expanded={isExpanded}
      >
        <span className="text-lg">🧪</span>
        <span>Variant: {variant}</span>
        <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
          <div className="p-3">
            <div className="mb-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Select Test Variant
            </div>

            {/* Variant Options */}
            {POST_VARIANTS.map((v) => (
              <button
                key={v}
                onClick={() => handleVariantSelect(v)}
                className={`mb-1 w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                  variant === v
                    ? "bg-blue-500 text-white"
                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
                aria-label={`Switch to ${v} variant`}
              >
                <div className="font-medium capitalize">{v}</div>
                <div className="text-xs opacity-80">
                  {VARIANT_DISPLAY_NAMES[v]}
                </div>
              </button>
            ))}

            {/* Clear Override */}
            <button
              onClick={handleClear}
              className="mt-3 w-full rounded border border-neutral-300 px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              aria-label="Clear manual override"
            >
              Clear Override (Use Feature Flag)
            </button>
          </div>

          {/* Help Text */}
          <div className="border-t border-neutral-200 p-3 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              💡 Manual override stored in localStorage. Clear to use PostHog
              feature flag assignment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

