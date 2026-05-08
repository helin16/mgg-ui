import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynPhotoService from '../../../services/Synergetic/SynPhotoService';

describe('SynPhotoService', () => {
  const endPoint = '/syn/photo';

  ServiceTestHelper.testCustom({
    name: 'getPhoto',
    serviceFn: SynPhotoService.getPhoto,
    appMethod: 'get',
    callArgs: ['123', {fakeParams: 'value'}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}],
  });

  describe('convertBufferToUrl', () => {
    test('converts binary photo data to a data URL', () => {
      expect(SynPhotoService.convertBufferToUrl(Uint8Array.from([97, 98, 99]), 'jpg')).toBe(
        'data::image/jpg;base64,YWJj'
      );
      expect(SynPhotoService.convertBufferToUrl(Uint8Array.from([97, 98, 99]))).toBe(
        'data::image/png;base64,YWJj'
      );
    });
  });
});
