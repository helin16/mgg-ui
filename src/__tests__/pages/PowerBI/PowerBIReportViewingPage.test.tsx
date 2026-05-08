import '../../testUtils/layoutModuleMocks';

describe('PowerBIReportViewingPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/PowerBI/PowerBIReportViewingPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
