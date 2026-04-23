import * as SentryLib from "@sentry/react";

const init = () => {
  const dsn = `${process.env.REACT_APP_SENTRY_DSN || ""}`.trim();
  if (dsn === "") {
    return;
  }

  SentryLib.init({
    dsn,
    sendDefaultPii: true,
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    // replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    // replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
};

const Sentry = {
  init
};

export default Sentry;
