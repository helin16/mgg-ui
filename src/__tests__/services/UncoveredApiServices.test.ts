import AlumniRequestService from '../../services/AlumniRequestService';
import AssetRecordTypeService from '../../services/Asset/AssetRecordTypeService';
import JiraAssetService from '../../services/Asset/JiraAssetService';
import ClipboardSessionService from '../../services/Clipboard/ClipboardSessionService';
import ClipboardTeamService from '../../services/Clipboard/ClipboardTeamService';
import ConfirmationOfDetailsResponseService from '../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService';
import DefaultService from '../../services/DefaultService';
import HouseAwardStudentYearService from '../../services/HouseAwards/HouseAwardStudentYearService';
import MggAppService from '../../services/Settings/MggAppService';
import SynVStudentAttendanceHistoryService from '../../services/Synergetic/Attendance/SynVStudentAttendanceHistoryService';
import SynCommunityConsentService from '../../services/Synergetic/Community/SynCommunityConsentService';
import SynCommunityLegalService from '../../services/Synergetic/Community/SynCommunityLegalService';
import SynRelationshipService from '../../services/Synergetic/Community/SynRelationshipService';
import SynGeneralLedgerUserService from '../../services/Synergetic/Finance/SynGeneralLedgerUserService';
import SynVDebtorStudentConcessionService from '../../services/Synergetic/Finance/SynVDebtorStudentConcessionService';
import SynVGeneralLedgerService from '../../services/Synergetic/Finance/SynVGeneralLedgerService';
import SynLuConsentTypeService from '../../services/Synergetic/Lookup/SynLuConsentTypeService';
import SynLuDocumentClassificationService from '../../services/Synergetic/Lookup/SynLuDocumentClassificationService';
import SynLuLearningPathwayService from '../../services/Synergetic/Lookup/SynLuLearningPathwayService';
import SynLuRelationshipService from '../../services/Synergetic/Lookup/SynLuRelationshipService';
import SynLuVisaService from '../../services/Synergetic/Lookup/SynLuVisaService';
import SynMedicalDetailsService from '../../services/Synergetic/Medical/SynMedicalDetailsService';
import SynJobPositionService from '../../services/Synergetic/Staff/SynJobPositionService';
import SynStudentClassesHistoryService from '../../services/Synergetic/Student/SynStudentClassesHistoryService';
import SynStudentStaticService from '../../services/Synergetic/Student/SynStudentStaticService';
import SynStudentYearService from '../../services/Synergetic/Student/SynStudentYearService';
import SynConfigUserService from '../../services/Synergetic/SynConfigUserService';
import SynPastStudentService from '../../services/Synergetic/SynPastStudentService';
import SynTagListService from '../../services/Synergetic/Tag/SynTagListService';
import SynTagListCommunityService from '../../services/Synergetic/Tag/SynTagListCommunityService';
import SynCalendarEventService from '../../services/Synergetic/TimeTable/SynCalendarEventService';
import AppService from '../../services/AppService';

jest.mock('../../services/AppService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAppService = AppService as jest.Mocked<typeof AppService>;

describe('uncovered API services', () => {
  beforeEach(() => {
    mockedAppService.get.mockReset().mockResolvedValue({data: {} as any});
    mockedAppService.post.mockReset().mockResolvedValue({data: {} as any});
    mockedAppService.put.mockReset().mockResolvedValue({data: {} as any});
    mockedAppService.delete.mockReset().mockResolvedValue({data: {} as any});
  });

  test('covers alumni request endpoints', async () => {
    await AlumniRequestService.getAll({page: 2});
    expect(mockedAppService.get).toHaveBeenCalledWith('/alumniRequest', {page: 2}, undefined);

    await AlumniRequestService.create({title: 'Ms'});
    expect(mockedAppService.post).toHaveBeenCalledWith('/alumniRequest', {title: 'Ms'}, undefined);

    await AlumniRequestService.approve(4, {});
    expect(mockedAppService.put).toHaveBeenCalledWith('/alumniRequest/4/approve', {}, undefined);

    await AlumniRequestService.deactivate(4);
    expect(mockedAppService.delete).toHaveBeenCalledWith('/alumniRequest/4', undefined, undefined);
  });

  test('covers asset and clipboard endpoints', async () => {
    await AssetRecordTypeService.getAll({page: 1});
    await AssetRecordTypeService.get(3);
    await JiraAssetService.triggerDownload({});
    await ClipboardSessionService.getAll({searchTxt: 'term'});
    await ClipboardSessionService.get(2);
    await ClipboardTeamService.getAll();
    await ClipboardTeamService.get(7);

    expect(mockedAppService.get).toHaveBeenCalledWith('/assetRecordType', {page: 1}, undefined);
    expect(mockedAppService.get).toHaveBeenCalledWith('/assetRecordType/3', {}, undefined);
    expect(mockedAppService.post).toHaveBeenCalledWith('/jiraAssets', {}, undefined);
    expect(mockedAppService.get).toHaveBeenCalledWith('/clipboard/session', {searchTxt: 'term'}, undefined);
    expect(mockedAppService.get).toHaveBeenCalledWith('/clipboard/session/2', {}, undefined);
    expect(mockedAppService.get).toHaveBeenCalledWith('/clipboard/team', {}, undefined);
    expect(mockedAppService.get).toHaveBeenCalledWith('/clipboard/team/7', {}, undefined);
  });

  test('covers default root endpoint', async () => {
    await DefaultService.getRoot();
    expect(mockedAppService.get).toHaveBeenCalledWith('/', {}, undefined);
  });

  test('covers confirmation of details endpoints', async () => {
    await ConfirmationOfDetailsResponseService.getAll({page: 1});
    await ConfirmationOfDetailsResponseService.get(9);
    await ConfirmationOfDetailsResponseService.create({StudentID: 10});
    await ConfirmationOfDetailsResponseService.update(9, {response: {}});
    await ConfirmationOfDetailsResponseService.submit(9);
    await ConfirmationOfDetailsResponseService.sync(9, 'student');
    await ConfirmationOfDetailsResponseService.deactivate(9);

    expect(mockedAppService.get).toHaveBeenCalledWith('/cod/response', {page: 1}, {});
    expect(mockedAppService.get).toHaveBeenCalledWith('/cod/response/9', undefined, {});
    expect(mockedAppService.post).toHaveBeenCalledWith('/cod/response', {StudentID: 10}, {});
    expect(mockedAppService.put).toHaveBeenCalledWith('/cod/response/9', {response: {}}, {});
    expect(mockedAppService.put).toHaveBeenCalledWith('/cod/response/submit/9', {}, {});
    expect(mockedAppService.put).toHaveBeenCalledWith('/cod/response/sync/9/student', {}, {});
    expect(mockedAppService.delete).toHaveBeenCalledWith('/cod/response/9', undefined, {});
  });

  test('covers house award student year and app endpoints', async () => {
    await HouseAwardStudentYearService.getStudentYears({active: true});
    await HouseAwardStudentYearService.getStudentYear(5);
    await HouseAwardStudentYearService.createStudentYear({StudentID: 1});
    await HouseAwardStudentYearService.updateStudentYear(5, {Score: 10});
    await HouseAwardStudentYearService.deleteStudentYear(5);
    await MggAppService.getAll({page: 1});
    await MggAppService.get(2);
    await MggAppService.create({name: 'App'});
    await MggAppService.update(2, {name: 'Updated'});
    await MggAppService.deactivate(2);

    expect(mockedAppService.get).toHaveBeenCalledWith('/houseAwards/studentYear', {active: true}, {});
    expect(mockedAppService.get).toHaveBeenCalledWith('/houseAwards/studentYear/5', undefined, {});
    expect(mockedAppService.post).toHaveBeenCalledWith('/houseAwards/studentYear', {StudentID: 1}, {});
    expect(mockedAppService.put).toHaveBeenCalledWith('/houseAwards/studentYear/5', {Score: 10}, {});
    expect(mockedAppService.delete).toHaveBeenCalledWith('/houseAwards/studentYear/5', undefined, {});
    expect(mockedAppService.get).toHaveBeenCalledWith('/app', {page: 1}, {});
    expect(mockedAppService.get).toHaveBeenCalledWith('/app/2', undefined, {});
    expect(mockedAppService.post).toHaveBeenCalledWith('/app', {name: 'App'}, {});
    expect(mockedAppService.put).toHaveBeenCalledWith('/app/2', {name: 'Updated'}, {});
    expect(mockedAppService.delete).toHaveBeenCalledWith('/app/2', undefined, {});
  });

  test.each([
    ['SynVStudentAttendanceHistoryService', SynVStudentAttendanceHistoryService, '/syn/vStudentAttendanceHistory'],
    ['SynCommunityConsentService', SynCommunityConsentService, '/syn/communityConsent'],
    ['SynCommunityLegalService', SynCommunityLegalService, '/syn/communityLegal'],
    ['SynRelationshipService', SynRelationshipService, '/syn/relationship'],
    ['SynGeneralLedgerUserService', SynGeneralLedgerUserService, '/syn/generalLedgerUser'],
    ['SynVDebtorStudentConcessionService', SynVDebtorStudentConcessionService, '/syn/vDebtorStudentConcession'],
    ['SynVGeneralLedgerService', SynVGeneralLedgerService, '/syn/vGeneralLedger'],
    ['SynLuConsentTypeService', SynLuConsentTypeService, '/syn/luConsentType'],
    ['SynLuDocumentClassificationService', SynLuDocumentClassificationService, '/syn/luDocumentClassification'],
    ['SynLuLearningPathwayService', SynLuLearningPathwayService, '/syn/luLearningPathway'],
    ['SynLuRelationshipService', SynLuRelationshipService, '/syn/luRelationship'],
    ['SynLuVisaService', SynLuVisaService, '/syn/luVisa'],
    ['SynMedicalDetailsService', SynMedicalDetailsService, '/syn/medicalDetails'],
    ['SynJobPositionService', SynJobPositionService, '/syn/jobPosition'],
    ['SynStudentClassesHistoryService', SynStudentClassesHistoryService, '/syn/studentClassesHistory'],
    ['SynStudentStaticService', SynStudentStaticService, '/syn/studentStatic'],
    ['SynStudentYearService', SynStudentYearService, '/syn/studentYear'],
    ['SynConfigUserService', SynConfigUserService, '/syn/configUser'],
    ['SynPastStudentService', SynPastStudentService, '/syn/pastStudent'],
    ['SynTagListService', SynTagListService, '/syn/tagList'],
    ['SynTagListCommunityService', SynTagListCommunityService, '/syn/tagListCommunity'],
    ['SynCalendarEventService', SynCalendarEventService, '/syn/calendarEvent'],
  ])('wires %s to %s', async (_name, service, path) => {
    await service.getAll({page: 3});
    expect(mockedAppService.get).toHaveBeenCalledWith(path, {page: 3}, undefined);
  });
});
