import AssetHelper from '../../helper/AssetHelper';
import LocalMediaHelper from '../../helper/LocalMediaHelper';
import YouTubeHelper from '../../helper/YouTubeHelper';

describe('AssetHelper', () => {
  describe('getThumbnail', () => {
    test('prefers local media thumbnails before youtube thumbnails', () => {
      jest.spyOn(LocalMediaHelper, 'getThumbnail').mockReturnValueOnce('local-thumb');
      jest.spyOn(YouTubeHelper, 'getThumbnail').mockReturnValueOnce('youtube-thumb');

      expect(AssetHelper.getThumbnail('https://example.test/video')).toBe('local-thumb');
      expect(YouTubeHelper.getThumbnail).not.toHaveBeenCalled();
    });

    test('falls back to youtube thumbnails and then original url', () => {
      jest.spyOn(LocalMediaHelper, 'getThumbnail').mockReturnValueOnce('https://example.test/video');
      jest.spyOn(YouTubeHelper, 'getThumbnail').mockReturnValueOnce('youtube-thumb');
      expect(AssetHelper.getThumbnail('https://example.test/video')).toBe('youtube-thumb');

      (LocalMediaHelper.getThumbnail as jest.Mock).mockReturnValueOnce('https://example.test/video');
      (YouTubeHelper.getThumbnail as jest.Mock).mockReturnValueOnce('https://example.test/video');
      expect(AssetHelper.getThumbnail('https://example.test/video')).toBe('https://example.test/video');
    });
  });
});
