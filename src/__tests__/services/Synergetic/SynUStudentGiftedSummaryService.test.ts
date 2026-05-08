import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynUStudentGiftedSummaryService from '../../../services/Synergetic/SynUStudentGiftedSummaryService';

describe('SynUStudentGiftedSummaryService', () => {
  const endPoint = '/syn/uStudentGiftedSummary';

  ServiceTestHelper.testGetAll(endPoint, SynUStudentGiftedSummaryService.getAll);
});
