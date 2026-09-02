/**
 * Isolated Highcharts loader.
 *
 * Highcharts 10.3.3 registers itself as `jQuery.fn.highcharts` at module init
 * whenever a global jQuery is present. On Schoolbox pages the shared mgg-ui
 * bundle then overwrites Schoolbox's own Highcharts plugin, so Schoolbox's
 * Class Results boxplot request reaches our core (which has no boxplot series)
 * and throws Highcharts error #17 until a hard refresh.
 *
 * This module snapshots the host page's exact `jQuery.fn.highcharts` property
 * descriptor, loads our private Highcharts copy synchronously, then restores the
 * host descriptor (or removes the property if the host had none). Load order
 * between Schoolbox and this bundle no longer matters.
 *
 * Contract: specs/019-fix-highcharts-conflict/contracts/runtime-coexistence.md
 * Do NOT assign window.Highcharts, import highcharts-more, or touch Schoolbox
 * modules here.
 */
import type * as HighchartsNS from 'highcharts';

type JQueryFn = Record<string, unknown> & { highcharts?: unknown };

const hostFn: JQueryFn | undefined = (
  window as unknown as { jQuery?: { fn?: JQueryFn } }
).jQuery?.fn;

const hadOwn = hostFn
  ? Object.prototype.hasOwnProperty.call(hostFn, 'highcharts')
  : false;
const savedDescriptor = hadOwn
  ? Object.getOwnPropertyDescriptor(hostFn, 'highcharts')
  : undefined;

let Highcharts: typeof HighchartsNS;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Highcharts = require('highcharts');
} finally {
  if (hostFn) {
    if (hadOwn && savedDescriptor) {
      Object.defineProperty(hostFn, 'highcharts', savedDescriptor);
    } else if (
      !hadOwn &&
      Object.prototype.hasOwnProperty.call(hostFn, 'highcharts')
    ) {
      delete hostFn.highcharts;
    }
  }
}

export default Highcharts;
