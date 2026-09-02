/* eslint-disable @typescript-eslint/no-var-requires */
const RUNTIME = '../../../components/chart/HighchartsRuntime';

// The real Highcharts module registers `jQuery.fn.highcharts` at init time when a
// global jQuery exists. These tests stub `highcharts` with a factory that
// reproduces that side effect, so we assert OUR snapshot/restore logic rather
// than Highcharts internals.

const win = window as unknown as { jQuery?: { fn: Record<string, unknown> } };

afterEach(() => {
  delete win.jQuery;
  jest.resetModules();
  jest.dontMock('highcharts');
});

const loadRuntime = () => {
  let mod: { default: unknown } = { default: undefined };
  jest.isolateModules(() => {
    mod = require(RUNTIME);
  });
  return mod;
};

test('(a) preserves an existing host jQuery.fn.highcharts descriptor and identity', () => {
  const hostPlugin = () => 'schoolbox';
  win.jQuery = { fn: {} };
  Object.defineProperty(win.jQuery.fn, 'highcharts', {
    value: hostPlugin,
    writable: true,
    enumerable: false, // non-default, must survive
    configurable: true,
  });
  const before = Object.getOwnPropertyDescriptor(win.jQuery.fn, 'highcharts');

  jest.doMock('highcharts', () => {
    (window as any).jQuery.fn.highcharts = () => 'mgg-ui'; // Highcharts stomps it
    return { FAKE_HIGHCHARTS: 'a' };
  });
  loadRuntime();

  expect(Object.getOwnPropertyDescriptor(win.jQuery!.fn, 'highcharts')).toEqual(before);
  expect(win.jQuery!.fn.highcharts).toBe(hostPlugin);
});

test('(b) leaves jQuery.fn.highcharts absent when the host never had it', () => {
  win.jQuery = { fn: {} };

  jest.doMock('highcharts', () => {
    (window as any).jQuery.fn.highcharts = () => 'mgg-ui'; // Highcharts adds it
    return { FAKE_HIGHCHARTS: 'b' };
  });
  loadRuntime();

  expect(Object.prototype.hasOwnProperty.call(win.jQuery!.fn, 'highcharts')).toBe(false);
});

test('(c) returns the private instance and creates no jQuery when host has none', () => {
  const fake = { FAKE_HIGHCHARTS: 'c' };
  jest.doMock('highcharts', () => fake);

  const mod = loadRuntime();

  expect(mod.default).toBe(fake);
  expect(win.jQuery).toBeUndefined();
});

test('(d) restores host state and re-throws when Highcharts init fails', () => {
  const hostPlugin = () => 'schoolbox';
  win.jQuery = { fn: {} };
  Object.defineProperty(win.jQuery.fn, 'highcharts', {
    value: hostPlugin,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  const before = Object.getOwnPropertyDescriptor(win.jQuery.fn, 'highcharts');

  jest.doMock('highcharts', () => {
    throw new Error('boxplot boom');
  });

  expect(() => loadRuntime()).toThrow('boxplot boom');
  expect(Object.getOwnPropertyDescriptor(win.jQuery!.fn, 'highcharts')).toEqual(before);
  expect(win.jQuery!.fn.highcharts).toBe(hostPlugin);
});

test('(e) default export is the app\'s own highcharts module instance', () => {
  let exported: unknown;
  let expected: unknown;
  jest.isolateModules(() => {
    exported = (require(RUNTIME) as { default: unknown }).default;
    expected = require('highcharts'); // same module registry -> same instance
  });
  expect(exported).toBe(expected);
});
