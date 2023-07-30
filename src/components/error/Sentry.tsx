import * as SentryLib from "@sentry/react";
import * as _ from "lodash";

const init = () => {
  const dsn = `${process.env.REACT_APP_SENTRY_DSN || ""}`.trim();
  if (dsn === "") {
    return;
  }

  const tracePropagationTargets = _.uniq(
    `${process.env.REACT_APP_TRACE_API_URLS || ""},${process.env.REACT_APP_API_END_POINT || ''}`
      .trim()
      .split(",")
      .map(url => `${url}`.trim())
      .filter(url => `${url}`.trim() !== "")
  );

  SentryLib.init({
    dsn,
    integrations: [
      ...(tracePropagationTargets.length > 0
        ? [
            new SentryLib.BrowserTracing({
              // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
              tracePropagationTargets
            })
          ]
        : []),
      new SentryLib.Replay()
    ],
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
