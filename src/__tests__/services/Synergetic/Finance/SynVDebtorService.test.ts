import AppService from '../../../../services/AppService';
import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVDebtorService from '../../../../services/Synergetic/Finance/SynVDebtorService';
import SynVStudentService from '../../../../services/Synergetic/Student/SynVStudentService';
import SynVStudentContactAllAddressService from '../../../../services/Synergetic/Student/SynVStudentContactAllAddressService';

jest.mock('../../../../services/Synergetic/Student/SynVStudentService');
jest.mock('../../../../services/Synergetic/Student/SynVStudentContactAllAddressService');

describe('SynVDebtorService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVDebtorService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/vDebtor"),
  });

  describe('getFinanceDebitors', () => {
    const mockedStudentService = SynVStudentService as jest.Mocked<typeof SynVStudentService>;
    const mockedContactService = SynVStudentContactAllAddressService as jest.Mocked<typeof SynVStudentContactAllAddressService>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('enriches debtors with linked students and spouse email fields', async () => {
      (AppService.get as any) = jest.fn().mockResolvedValueOnce({
        data: {
          currentPage: 1,
          perPage: 10,
          from: 1,
          to: 1,
          total: 1,
          pages: 1,
          data: [{
            DebtorID: 501,
            DebtorNameExternal: 'Ada Parent',
            DebtorHomeEmail: 'home@example.com',
            DebtorOccupEmail: 'work@example.com',
            DebtorHomePhone: '1234',
            DebtorMobilePhone: '0400',
            DebtorOccupPhone: '5678',
            DebtorOccupMobilePhone: '0499',
            DebtorSpouseNameExternal: 'Grace Parent',
            DebtorSpouseLegalFullName: '',
            DebtorSpouseGiven1: '',
            DebtorSpouseSurname: '',
            DebtorSpouseMobilePhone: '0411',
            DebtorSpouseOccupPhone: '9012',
            DebtorSpouseOccupMobilePhone: '0488',
            DebtorAddressFull: '1 Main St',
            DebtorCurrentBalance: 44.5,
            DebtorLastPaymentAmount: 20,
          }],
        },
      });
      mockedStudentService.getVPastAndCurrentStudentAll.mockResolvedValueOnce({
        currentPage: 1,
        perPage: 99999,
        from: 1,
        to: 1,
        total: 1,
        pages: 1,
        data: [{
          StudentID: 301,
          StudentGiven1: 'Student',
          StudentSurname: 'One',
          DebtorID: 501,
        }],
      } as any);
      mockedContactService.getAll.mockResolvedValueOnce({
        currentPage: 1,
        perPage: 99999,
        from: 1,
        to: 1,
        total: 1,
        pages: 1,
        data: [{
          StudentID: 301,
          StudentContactSpouseEmail: 'spouse@example.com',
          StudentContactSpouseDefaultEmail: 'spouse-default@example.com',
          StudentContactSpouseOccupEmail: 'spouse-work@example.com',
          StudentContactSpouseMobilePhone: '0411',
          StudentContactSpouseOccupPhone: '9012',
          StudentContactSpouseOccupMobilePhone: '0488',
        }],
      } as any);

      const result = await SynVDebtorService.getFinanceDebitors({
        currentPage: 1,
        perPage: 10,
        searchText: '',
        selectedStudentId: null,
        selectedStudentDebtorId: null,
      });

      expect((AppService.get as any).mock.calls[0]).toEqual([
        '/syn/vDebtor',
        expect.objectContaining({
          currentPage: 1,
          perPage: 10,
          sort: 'DebtorNameExternal:ASC',
        }),
      ]);
      expect(result.data[0]).toEqual(expect.objectContaining({
        DebtorID: 501,
        DebtorNameExternal: 'Ada Parent',
        DebitorSpouseEmail: 'spouse@example.com',
        DebitorSpouseOccupEmail: 'spouse-work@example.com',
        students: [expect.objectContaining({
          StudentID: 301,
          StudentGiven1: 'Student',
          StudentSurname: 'One',
        })],
      }));
    });

    test('includes spouse email matches in the debtor search query', async () => {
      mockedContactService.getAll
        .mockResolvedValueOnce({
          currentPage: 1,
          perPage: 99999,
          from: 1,
          to: 1,
          total: 1,
          pages: 1,
          data: [{StudentID: 301}],
        } as any)
        .mockResolvedValueOnce({
          currentPage: 1,
          perPage: 99999,
          from: 0,
          to: 0,
          total: 0,
          pages: 0,
          data: [],
        } as any);
      mockedStudentService.getVPastAndCurrentStudentAll
        .mockResolvedValueOnce({
          currentPage: 1,
          perPage: 99999,
          from: 1,
          to: 1,
          total: 1,
          pages: 1,
          data: [{StudentID: 301, DebtorID: 501}],
        } as any)
        .mockResolvedValueOnce({
          currentPage: 1,
          perPage: 99999,
          from: 0,
          to: 0,
          total: 0,
          pages: 0,
          data: [],
        } as any);
      (AppService.get as any) = jest.fn().mockResolvedValueOnce({
        data: {
          currentPage: 1,
          perPage: 10,
          from: 0,
          to: 0,
          total: 0,
          pages: 0,
          data: [],
        },
      });

      await SynVDebtorService.getFinanceDebitors({
        currentPage: 1,
        perPage: 10,
        searchText: 'spouse@example.com',
        selectedStudentId: null,
        selectedStudentDebtorId: null,
      });

      const [, params] = (AppService.get as any).mock.calls[0];
      const where = JSON.parse(params.where);
      expect(JSON.stringify(where)).toContain('"DebtorID":[501]');
    });
  });
});
