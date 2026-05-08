import LocalMediaHelper from '../../helper/LocalMediaHelper';

describe('LocalMediaHelper', () => {
  describe('getThumbnail', () => {
    test.each([
      ['https://app.example.test/file.jpg', 'https://app.example.test/file.jpg?thumb=1'],
      ['https://mentonegirls.vic.edu.au/file.jpg', 'https://mentonegirls.vic.edu.au/file.jpg?thumb=1'],
      ['https://cdn.example.test/file.jpg', 'https://cdn.example.test/file.jpg'],
    ])('%s', (url, expected) => {
      process.env.REACT_APP_PUBLIC_URL = 'app.example.test';
      expect(LocalMediaHelper.getThumbnail(url)).toBe(expected);
    });
  });
});
