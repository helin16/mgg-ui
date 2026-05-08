import YouTubeHelper from '../../helper/YouTubeHelper';

describe('YouTubeHelper', () => {
  describe('getThumbnail', () => {
    test.each([
      ['https://www.youtube.com/watch?v=abc123', 'https://img.youtube.com/vi/abc123/maxresdefault.jpg'],
      ['https://youtu.be/watch?v=abc123', 'https://img.youtube.com/vi/abc123/maxresdefault.jpg'],
      ['https://www.youtube.com/watch?x=1', 'https://www.youtube.com/watch?x=1'],
      ['notaurl youtube', 'notaurl youtube'],
      ['https://cdn.example.test/video', 'https://cdn.example.test/video'],
    ])('%s', (url, expected) => {
      expect(YouTubeHelper.getThumbnail(url)).toBe(expected);
    });
  });
});
