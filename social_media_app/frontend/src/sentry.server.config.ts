import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || "development",
  // Organization: northwestern-university-40
  // Project: social-media-lurkers
});

