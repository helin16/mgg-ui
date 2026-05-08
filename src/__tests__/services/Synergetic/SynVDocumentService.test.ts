import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynVDocumentService, {
  getDocumentUrl,
  openDocument,
} from '../../../services/Synergetic/SynVDocumentService';

describe('SynVDocumentService', () => {
  const endPoint = '/syn/vDocument';

  ServiceTestHelper.testCustom({
    name: 'getVDocuments',
    serviceFn: SynVDocumentService.getVDocuments,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [endPoint, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getVDocumentBySeq',
    serviceFn: SynVDocumentService.getVDocumentBySeq,
    appMethod: 'get',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'createVDocument',
    serviceFn: SynVDocumentService.createVDocument,
    appMethod: 'post',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });

  describe('document helpers', () => {
    test('builds browser object URLs and opens them', () => {
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = jest.fn().mockImplementation((blob: Blob) => `blob:${blob.type || 'unknown'}`);
      const openSpy = jest.spyOn(window, 'open').mockReturnValue(null);
      const makeDocument = (DocumentType: string) =>
        ({
          DocumentType,
          Document: {
            data: [80, 68, 70],
          },
        } as any);

      expect(SynVDocumentService.getFileExtensionFromFileName('report.PDF')).toBe('pdf');
      expect(SynVDocumentService.getFileExtensionFromFileName('image.jpeg')).toBe('jpg');
      expect(SynVDocumentService.getFileExtensionFromFileName('image.png')).toBe('png');
      expect(SynVDocumentService.getFileExtensionFromFileName('archive.bin')).toBe('');
      expect(getDocumentUrl(makeDocument('PDF'))).toBe('blob:application/pdf');
      expect(getDocumentUrl(makeDocument('JPEG'))).toBe('blob:image/jpg');
      expect(getDocumentUrl(makeDocument('PNG'))).toBe('blob:image/png');
      expect(getDocumentUrl(makeDocument('TXT'))).toBe('blob:unknown');
      expect(openDocument(makeDocument('PDF'))).toBeNull();
      expect(openSpy).toHaveBeenCalledWith('blob:application/pdf');

      URL.createObjectURL = originalCreateObjectURL;
      openSpy.mockRestore();
    });
  });
});
