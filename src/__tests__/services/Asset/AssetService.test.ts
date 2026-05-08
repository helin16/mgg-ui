import axios from 'axios';
import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetService from '../../../services/Asset/AssetService';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AssetService', () => {
  const endPoint = '/asset';

  ServiceTestHelper.testCreate(endPoint, AssetService.create);
  ServiceTestHelper.testGetAll(endPoint, AssetService.getAll);
  ServiceTestHelper.testCustom({
    name: 'upload',
    serviceFn: AssetService.upload,
    appMethod: 'post',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/upload`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testDeactivate(endPoint, AssetService.deactivate);

  describe('download methods', () => {
    beforeEach(() => {
      mockedAxios.get.mockReset().mockResolvedValue({data: new Blob(['asset'])});
    });

    test('downloads remote assets and converts blobs to base64', async () => {
      class FileReaderMock {
        result: string | null = 'data:text/plain;base64,YXNzZXQ=';
        onload: null | (() => void) = null;
        onerror: null | ((err: Error) => void) = null;

        readAsDataURL() {
          if (this.onload) {
            this.onload();
          }
        }
      }

      // @ts-ignore
      global.FileReader = FileReaderMock;

      await expect(AssetService.downloadFromUrl('https://example.com/file')).resolves.toEqual({
        data: new Blob(['asset']),
      });
      await expect(AssetService.downloadAssetToBeBase64('https://example.com/file')).resolves.toBe(
        'data:text/plain;base64,YXNzZXQ='
      );
    });

    test('rejects when FileReader finishes without a result', async () => {
      class FileReaderMock {
        result: string | null = null;
        onload: null | (() => void) = null;
        onerror: null | ((err: Error) => void) = null;

        readAsDataURL() {
          if (this.onload) {
            this.onload();
          }
        }
      }

      // @ts-ignore
      global.FileReader = FileReaderMock;

      await expect(AssetService.downloadAssetToBeBase64('https://example.com/file')).rejects.toThrow(
        'Failed to read the blob as Data URL.'
      );
    });
  });
});
