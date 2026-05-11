import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVMedicalIncidentsAllService from '../../../../services/Synergetic/Medical/SynVMedicalIncidentsAllService';

describe('SynVMedicalIncidentsAllService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVMedicalIncidentsAllService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/vMedicalIncidentsAll"),
  });
});
