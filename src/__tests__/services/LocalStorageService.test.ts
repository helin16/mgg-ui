import LocalStorageService from '../../services/LocalStorageService';

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    delete process.env.REACT_APP_LOCAL_USER_TOKEN_NAME;
  });

  test('stores and removes the auth token with the configured key', () => {
    process.env.REACT_APP_LOCAL_USER_TOKEN_NAME = 'mgg-token';

    LocalStorageService.setToken('abc123');
    expect(LocalStorageService.getToken()).toBe('abc123');

    LocalStorageService.removeToken();
    expect(LocalStorageService.getToken()).toBeNull();
  });

  test('serializes JSON values and falls back to raw strings', () => {
    LocalStorageService.setItem('profile', {name: 'Ada'});
    expect(LocalStorageService.getItem('profile')).toEqual({name: 'Ada'});

    localStorage.setItem('raw', 'hello');
    expect(LocalStorageService.getItem('raw')).toBe('hello');
  });

  test('falls back to direct storage when serialization throws', () => {
    const circular: any = {};
    circular.self = circular;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    LocalStorageService.setItem('circular', circular);

    expect(errorSpy).toHaveBeenCalled();
    expect(localStorage.getItem('circular')).toBe('[object Object]');
    errorSpy.mockRestore();
  });

  test('removes stored values', () => {
    LocalStorageService.setItem('profile', {name: 'Ada'});
    LocalStorageService.removeItem('profile');

    expect(localStorage.getItem('profile')).toBeNull();
  });
});
