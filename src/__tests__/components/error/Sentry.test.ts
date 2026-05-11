import Sentry from '../../../components/error/Sentry';
import * as SentryLib from '@sentry/react';

jest.mock('@sentry/react', () => ({
  __esModule: true,
  init: jest.fn(),
  default: {init: jest.fn()},
}));

describe('Sentry', () => {
  const originalEnv = process.env.REACT_APP_SENTRY_DSN;

  afterEach(() => {
    process.env.REACT_APP_SENTRY_DSN = originalEnv;
    jest.clearAllMocks();
  });

  test('does nothing when the DSN is blank', () => {
    process.env.REACT_APP_SENTRY_DSN = '   ';

    Sentry.init();

    expect(SentryLib.init).not.toHaveBeenCalled();
  });

  test('initializes sentry when the DSN is present', () => {
    process.env.REACT_APP_SENTRY_DSN = 'https://dsn.example';

    Sentry.init();

    expect(SentryLib.init).toHaveBeenCalledWith(expect.objectContaining({
      dsn: 'https://dsn.example',
      sendDefaultPii: true,
      tracesSampleRate: 1,
    }));
  });
});
