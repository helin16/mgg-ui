describe('ENewsViewingPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/ENews/ENewsViewingPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
