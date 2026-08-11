import AppService from '../../../services/AppService';
import StudentAbsenceDailySummaryService from '../../../services/StudentAbsences/StudentAbsenceDailySummaryService';

describe('StudentAbsenceDailySummaryService', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('sends the selected Count as Absent value to live results and direct export', async () => {
    jest.spyOn(AppService, 'get').mockResolvedValue({data: {rows: []}} as any);
    jest.spyOn(AppService, 'post').mockResolvedValue({data: {id: 'asset-1'}} as any);
    const filters = {
      yearLevelCode: '12',
      formCode: '12A',
      countAsAbsent: 'NO' as const,
      dateRange: {from: '2026-08-11', to: '2026-08-11'},
    };

    await StudentAbsenceDailySummaryService.getLiveReport(filters);
    await StudentAbsenceDailySummaryService.exportReport(filters);

    expect(AppService.get).toHaveBeenCalledWith('/studentAbsence/dailySummary/live', {
      yearLevelCode: '12',
      formCode: '12A',
      countAsAbsent: 'NO',
      dateFrom: '2026-08-11',
      dateTo: '2026-08-11',
    });
    expect(AppService.post).toHaveBeenCalledWith('/studentAbsence/dailySummary/export', {
      yearLevelCode: '12',
      formCode: '12A',
      countAsAbsent: 'NO',
      dateFrom: '2026-08-11',
      dateTo: '2026-08-11',
    });
  });

  test('does not send the screen Count as Absent selection to manual email', async () => {
    jest.spyOn(AppService, 'post').mockResolvedValue({data: {assetId: 'asset-1'}} as any);

    await StudentAbsenceDailySummaryService.emailReport({
      countAsAbsent: 'NO',
      dateRange: {from: '2026-08-11', to: '2026-08-11'},
    }, 'teacher@example.com', 'Please review');

    expect(AppService.post).toHaveBeenCalledWith('/studentAbsence/dailySummary/email', {
      yearLevelCode: undefined,
      formCode: undefined,
      recipientEmails: 'teacher@example.com',
      emailBody: 'Please review',
      dateFrom: '2026-08-11',
      dateTo: '2026-08-11',
    });
  });
});
