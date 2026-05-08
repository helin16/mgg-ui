describe('iAcaraData', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/ACARA/iAcaraData');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
