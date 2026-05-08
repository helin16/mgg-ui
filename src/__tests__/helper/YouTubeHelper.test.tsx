describe('YouTubeHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../helper/YouTubeHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
