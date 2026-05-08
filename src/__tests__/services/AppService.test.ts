import axios from 'axios';
import AppService from '../../services/AppService';
import LocalStorageService from '../../services/LocalStorageService';
import UtilsService from '../../services/UtilsService';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    CancelToken: {
      source: jest.fn(),
    },
  },
  CancelToken: {
    source: jest.fn(),
  },
}));

jest.mock('../../services/LocalStorageService', () => ({
  __esModule: true,
  default: {
    getToken: jest.fn(),
  },
}));

jest.mock('../../services/UtilsService', () => ({
  __esModule: true,
  default: {
    getUrlParams: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedLocalStorageService = LocalStorageService as jest.Mocked<typeof LocalStorageService>;
const mockedUtilsService = UtilsService as jest.Mocked<typeof UtilsService>;

describe('AppService', () => {
  beforeEach(() => {
    process.env.REACT_APP_API_END_POINT = 'https://api.example.test';
    process.env.REACT_APP_TOKEN = 'app-token';

    mockedLocalStorageService.getToken.mockReset().mockReturnValue('user-token');
    mockedUtilsService.getUrlParams.mockReset().mockReturnValue('?page=1');
    mockedAxios.get.mockReset().mockResolvedValue({data: {}});
    mockedAxios.post.mockReset().mockResolvedValue({data: {}});
    mockedAxios.put.mockReset().mockResolvedValue({data: {}});
    mockedAxios.delete.mockReset().mockResolvedValue({data: {}});
    mockedAxios.CancelToken.source = jest.fn().mockReturnValue({
      cancel: jest.fn(),
    });
  });

  test('builds request URLs and headers for CRUD methods', async () => {
    await AppService.get('/students', {page: 1}, {headers: {'x-extra': '1'}});
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.example.test/students?page=1',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer user-token',
          'X-MGGS-TOKEN': 'app-token',
          'x-extra': '1',
        }),
      })
    );

    await AppService.post('/students', {name: 'Ada'}, {headers: {'x-extra': '1'}});
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.test/students',
      {name: 'Ada'},
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer user-token',
          'X-MGGS-TOKEN': 'app-token',
          'x-extra': '1',
        }),
      })
    );

    await AppService.put('/students/1', {name: 'Grace'}, {headers: {'x-extra': '1'}});
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://api.example.test/students/1',
      {name: 'Grace'},
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer user-token',
          'X-MGGS-TOKEN': 'app-token',
          'x-extra': '1',
        }),
      })
    );

    await AppService.delete('/students/1', {hard: true}, {headers: {'x-extra': '1'}});
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://api.example.test/students/1?page=1',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer user-token',
          'X-MGGS-TOKEN': 'app-token',
          'x-extra': '1',
        }),
      })
    );
  });

  test('omits bearer auth when no token is stored', async () => {
    mockedLocalStorageService.getToken.mockReturnValue('');

    await AppService.get('/students');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.example.test/students?page=1',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    );
  });

  test('uses empty defaults when token, app token, and config headers are missing', async () => {
    mockedLocalStorageService.getToken.mockReturnValue(undefined as any);
    delete process.env.REACT_APP_TOKEN;
    mockedUtilsService.getUrlParams.mockReturnValue('');

    await AppService.post('/students', {name: 'Ada'});
    await AppService.put('/students/1', {name: 'Grace'});

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.test/students',
      {name: 'Ada'},
      {headers: {'X-MGGS-TOKEN': ''}}
    );
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://api.example.test/students/1',
      {name: 'Grace'},
      {headers: {'X-MGGS-TOKEN': ''}}
    );
  });

  test('uploadImage posts multipart form data', async () => {
    const formData = new FormData();

    await AppService.uploadImage('/upload', formData, {timeout: 1000});

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.test/upload',
      formData,
      expect.objectContaining({
        headers: expect.objectContaining({
          headers: expect.objectContaining({
            'X-MGGS-TOKEN': 'app-token',
          }),
          'Content-Type': 'multipart/form-data',
        }),
        timeout: 1000,
      })
    );
  });

  test('cancelAll cancels the active token source', () => {
    const cancel = jest.fn();
    mockedAxios.CancelToken.source = jest.fn().mockReturnValue({cancel});

    AppService.cancelAll();

    expect(cancel).toHaveBeenCalled();
  });

  test('convertArrToPaginatedArr normalizes arrays and preserves paginated objects', () => {
    expect(AppService.convertArrToPaginatedArr([{id: 1}])).toEqual({
      data: [{id: 1}],
      currentPage: 1,
      perPage: 1,
      from: 0,
      to: 1,
      total: 1,
      pages: 1,
    });

    const existing = {
      data: [{id: 2}],
      currentPage: 2,
      perPage: 25,
      from: 26,
      to: 50,
      total: 60,
      pages: 3,
    };

    expect(AppService.convertArrToPaginatedArr(existing)).toBe(existing);
  });
});
