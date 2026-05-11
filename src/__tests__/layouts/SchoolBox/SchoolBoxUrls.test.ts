describe('SchoolBoxUrls', () => {
  test('exposes the expected schoolbox route constants without duplicates', () => {
    const SchoolBoxUrls = require('../../../layouts/SchoolBox/SchoolBoxUrls').default;
    const values = Object.values(SchoolBoxUrls);

    expect(SchoolBoxUrls.BudgetTracker).toBe('/bt');
    expect(SchoolBoxUrls.Finance).toBe('/finance');
    expect(SchoolBoxUrls.DataSubmission).toBe('/school_data_submission');
    expect(SchoolBoxUrls.PowerBI).toBe('/powerbi/manager');
    expect(new Set(values).size).toBe(values.length);
  });
});
