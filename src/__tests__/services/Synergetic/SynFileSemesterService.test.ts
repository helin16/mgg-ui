import AppService from '../../../services/AppService';
import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynFileSemesterService from '../../../services/Synergetic/SynFileSemesterService';

describe('SynFileSemesterService', () => {
  const endPoint = '/syn/fileSemester';

  ServiceTestHelper.testCustom({
    name: 'getFileSemesters',
    serviceFn: SynFileSemesterService.getFileSemesters,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [endPoint, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getSchoolDays',
    serviceFn: SynFileSemesterService.getSchoolDays,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/schoolDays`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getSchoolDaysAll',
    serviceFn: SynFileSemesterService.getSchoolDaysAll,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/schoolDays`, {fakeParams: 'value', showAll: true}, {headers: {fakeConfig: 'value'}}],
  });

  describe('getFileSemesterFromStartAndEndDate', () => {
    test('maps semester lookups and missing lists', async () => {
      AppService.get = jest
        .fn()
        .mockResolvedValueOnce({data: {data: [{FileSemester: 1}]}})
        .mockResolvedValueOnce({data: {}}) as any;

      await expect(
        SynFileSemesterService.getFileSemesterFromStartAndEndDate({
          startDateStr: '2026-01-01',
          endDateStr: '2026-12-31',
        })
      ).resolves.toEqual({
        startDateFileSemesters: [{FileSemester: 1}],
        endDateFileSemesters: [],
      });
    });
  });
});
