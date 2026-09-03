jest.mock('@sentry/react', () => ({
  captureMessage: jest.fn(),
}));

type Loaded = {
  helper: typeof import('../../helper/ImpersonationHelper').default;
  captureMessage: jest.Mock;
};

// Fresh copy each time so the module-level `warned` guard resets between tests.
const load = (): Loaded => {
  let helper: Loaded['helper'] = undefined as any;
  let captureMessage: jest.Mock = undefined as any;
  jest.isolateModules(() => {
    helper = require('../../helper/ImpersonationHelper').default;
    captureMessage = require('@sentry/react').captureMessage;
  });
  return {helper, captureMessage};
};

describe('ImpersonationHelper', () => {
  beforeEach(() => {
    delete (window as any).schoolboxUser;
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/');
  });

  test('global present and impersonating -> true, no warning', () => {
    (window as any).schoolboxUser = {impersonated: true, communityLogin: false};
    const {helper, captureMessage} = load();

    expect(helper.isImpersonating()).toBe(true);
    expect(helper.resolveImpersonation()).toBe(true);
    expect(captureMessage).not.toHaveBeenCalled();
  });

  test('global present and not impersonating -> false, no warning (even when embedded)', () => {
    (window as any).schoolboxUser = {impersonated: false, communityLogin: true};
    document.body.innerHTML = '<div id="mgg-root" data-url="https://sb/modules/remote/x"></div>';
    const {helper, captureMessage} = load();

    expect(helper.resolveImpersonation()).toBe(false);
    expect(captureMessage).not.toHaveBeenCalled();
  });

  test('embedded (#mgg-root[data-url]) and global missing -> false + one Sentry warning', () => {
    document.body.innerHTML = '<div id="mgg-root" data-url="https://sb/modules/remote/x"></div>';
    const {helper, captureMessage} = load();

    expect(helper.resolveImpersonation()).toBe(false);
    expect(captureMessage).toHaveBeenCalledTimes(1);
    expect(captureMessage).toHaveBeenCalledWith(expect.stringContaining('schoolboxUser'), 'warning');
  });

  test('embedded and impersonated is not a boolean -> false + one Sentry warning', () => {
    (window as any).schoolboxUser = {impersonated: 'yes'};
    document.body.innerHTML = '<div id="mgg-root" data-url="https://sb/modules/remote/x"></div>';
    const {helper, captureMessage} = load();

    expect(helper.resolveImpersonation()).toBe(false);
    expect(captureMessage).toHaveBeenCalledTimes(1);
  });

  test('embedded via /modules/remote/ path and global missing -> warning', () => {
    window.history.replaceState({}, '', '/modules/remote/abc123');
    const {helper, captureMessage} = load();

    expect(helper.isEmbeddedInSchoolBox()).toBe(true);
    expect(helper.resolveImpersonation()).toBe(false);
    expect(captureMessage).toHaveBeenCalledTimes(1);
  });

  test('not embedded and global missing -> false, NO warning', () => {
    const {helper, captureMessage} = load();

    expect(helper.isEmbeddedInSchoolBox()).toBe(false);
    expect(helper.resolveImpersonation()).toBe(false);
    expect(captureMessage).not.toHaveBeenCalled();
  });

  test('warns at most once per page load', () => {
    document.body.innerHTML = '<div id="mgg-root" data-url="https://sb/modules/remote/x"></div>';
    const {helper, captureMessage} = load();

    helper.resolveImpersonation();
    helper.resolveImpersonation();
    helper.resolveImpersonation();

    expect(captureMessage).toHaveBeenCalledTimes(1);
  });

  test('never throws when window access is hostile', () => {
    (window as any).schoolboxUser = {
      get impersonated() {
        throw new Error('boom');
      },
    };
    const {helper} = load();

    expect(() => helper.isImpersonating()).not.toThrow();
    expect(helper.isImpersonating()).toBe(false);
  });
});
