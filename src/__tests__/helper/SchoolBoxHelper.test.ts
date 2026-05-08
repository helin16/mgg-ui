import SchoolBoxHelper, {THIRD_PARTY_AUTH_PATH} from '../../helper/SchoolBoxHelper';
import UtilsService from '../../services/UtilsService';

describe('SchoolBoxHelper', () => {
  beforeEach(() => {
    jest.spyOn(UtilsService, 'getUrlParams').mockReturnValue('?foo=bar');
  });

  test('builds module urls for local hosts using search params', () => {
    Object.defineProperty(window, 'location', {
      value: {
        host: 'localhost:3000',
        protocol: 'http:',
        search: '?foo=bar',
      },
      writable: true,
    });

    const result = SchoolBoxHelper.getModuleUrl('/finance');
    expect(result.relative).toContain('/modules/remote/');
    expect(result.relative).toContain('?foo=bar');
    expect(result.full).toBe(result.relative);
  });

  test('uses explicit base and auth paths for remote hosts', () => {
    Object.defineProperty(window, 'location', {
      value: {
        host: 'mgg.example.test',
        protocol: 'https:',
        search: '?foo=bar',
      },
      writable: true,
    });
    process.env.REACT_APP_PUBLIC_URL = 'https://public.example.test';

    const result = SchoolBoxHelper.getModuleUrl('/finance', '', '', 'https://mconnect.example.test');
    expect(result.relative).toContain('/modules/remote/');
    expect(result.full.startsWith('https://mconnect.example.test/modules/remote/')).toBe(true);
    expect(result.relative.endsWith('?foo=bar')).toBe(true);
  });

  test('exports the default auth path', () => {
    expect(THIRD_PARTY_AUTH_PATH).toBe('/3rdPartyAuth');
  });
});
