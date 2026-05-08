import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVMedicalIncidentsAllService from '../../../../services/Synergetic/Medical/SynVMedicalIncidentsAllService';

describe('SynVMedicalIncidentsAllService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVMedicalIncidentsAllService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/vMedicalIncidentsAll", {"fakeParams":"value"}],
  });
});
