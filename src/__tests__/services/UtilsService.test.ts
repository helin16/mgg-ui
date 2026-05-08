import moment from 'moment-timezone';
import UtilsService from '../../services/UtilsService';
import SchoolBoxHelper from '../../helper/SchoolBoxHelper';
import Toaster from '../../services/Toaster';

jest.mock('../../helper/SchoolBoxHelper', () => ({
  __esModule: true,
  THIRD_PARTY_AUTH_PATH: '/auth/third-party',
  default: {
    getModuleUrl: jest.fn(),
  },
}));

jest.mock('../../services/Toaster', () => ({
  __esModule: true,
  TOAST_TYPE_WARNING: 'warn',
  default: {
    showToast: jest.fn(),
  },
}));

const mockedSchoolBoxHelper = SchoolBoxHelper as jest.Mocked<typeof SchoolBoxHelper>;
const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

describe('UtilsService', () => {
  beforeEach(() => {
    mockedSchoolBoxHelper.getModuleUrl.mockReset().mockReturnValue({full: 'https://module.example.test'});
    mockedToaster.showToast.mockReset();
    process.env.REACT_APP_PUBLIC_URL = 'https://app.example.test/';
  });

  test('validates and formats common values', () => {
    expect(UtilsService.isNumeric('12.5')).toBe(true);
    expect(UtilsService.isNumeric('abc')).toBe(false);
    expect(UtilsService.formatIntoCurrency(12.5)).toBe('$12.50');
    expect(UtilsService.validateEmail('test@example.com')).toBe(true);
    expect(UtilsService.validateEmail('bad-email')).toBe(false);
    expect(UtilsService.validateMacAddress('AA:BB:CC:DD:EE:FF')).toBe(true);
    expect(UtilsService.validateTime('23:59')).toBe(true);
    expect(UtilsService.validateTime('24:00')).toBe(false);
    expect(UtilsService.formatBytesToHuman(1024)).toBe('1 KB');
    expect(UtilsService.formatBytesToHuman(0)).toBe('0 Bytes');
    expect(UtilsService.stripQuotes("'quoted'")).toBe('quoted');
    expect(UtilsService.stripQuotes("'quoted")).toBe('quoted');
    expect(UtilsService.stripQuotes("quoted'")).toBe('quoted');
    expect(UtilsService.stripQuotes('quoted')).toBe('quoted');
  });

  test('builds URL helpers and delegates module URL creation', () => {
    expect(UtilsService.getFullUrl('/finance/bpay')).toBe('https://app.example.test/finance/bpay');
    process.env.REACT_APP_PUBLIC_URL = 'https://app.example.test';
    expect(UtilsService.getFullUrl('finance/bpay')).toBe('https://app.example.test/finance/bpay');
    expect(UtilsService.getUrlParams({page: '1', sort: 'name'})).toBe('?page=1&sort=name');
    expect(UtilsService.getUrlParams('bad' as any)).toBe('');
    expect(UtilsService.getUrlParams()).toBe('');
    expect(UtilsService.getModuleUrl('/finance')).toBe('https://module.example.test');
    expect(mockedSchoolBoxHelper.getModuleUrl).toHaveBeenCalledWith(
      '/finance',
      undefined,
      '/auth/third-party',
      undefined
    );
  });

  test('returns weekdays and letter ranges', () => {
    const weekdays = UtilsService.getWeekdaysBetweenDates(
      moment.tz('2026-05-08', 'Australia/Melbourne'),
      moment.tz('2026-05-12', 'Australia/Melbourne')
    );

    expect(weekdays.map(day => day.format('ddd'))).toEqual(['Fri', 'Mon', 'Tue']);
    expect(
      UtilsService.getWeekdaysBetweenDates(
        moment.tz('2026-05-09', 'Australia/Melbourne'),
        moment.tz('2026-05-10', 'Australia/Melbourne')
      )
    ).toEqual([]);
    expect(UtilsService.letterRange('A', 'C')).toEqual(['A', 'B', 'C']);
    expect(UtilsService.getWeekDaysShort()).toEqual(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
  });

  test('handles enter presses and strips HTML', () => {
    const onEnter = jest.fn().mockReturnValue('enter');
    const onOther = jest.fn().mockReturnValue('other');

    expect(UtilsService.handleEnterKeyPressed({key: 'Enter'}, onEnter, onOther)).toBe('enter');
    expect(UtilsService.handleEnterKeyPressed({key: 'Escape'}, onEnter, onOther)).toBe('other');
    expect(UtilsService.handleEnterKeyPressed({key: 'Enter'})).toBeUndefined();
    expect(UtilsService.stripHTMLTags('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
    expect(
      UtilsService.uniqByObjectKey(
        [
          {id: 1, name: 'Ada'},
          {id: 1, name: 'Ada 2'},
          {id: 2, name: 'Grace'},
        ],
        'id'
      )
    ).toEqual([
      {id: 1, name: 'Ada'},
      {id: 2, name: 'Grace'},
    ]);
  });

  test('opens a new window or shows a warning when blocked', () => {
    const openedWindow = {location: {href: ''}};
    const openSpy = jest.spyOn(window, 'open');

    openSpy.mockReturnValue(openedWindow as Window);
    UtilsService.openNewWindow('https://example.com');
    expect(openedWindow.location.href).toBe('https://example.com');

    openSpy.mockReturnValue(null);
    UtilsService.openNewWindow('https://blocked.example.com');
    expect(mockedToaster.showToast).toHaveBeenCalled();
  });
});
