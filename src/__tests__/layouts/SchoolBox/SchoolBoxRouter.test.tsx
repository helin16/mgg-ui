import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import '../../testUtils/layoutModuleMocks';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {ModuleAccessWrapperKey, ModuleAccessWrapperTestId} from '../../../components/module/__mocks__/ModuleAccessWrapper';
import {PageNotFoundTestId} from '../../../components/__mocks__/PageNotFound';
import {CustomScriptUrlGenPageKey, CustomScriptUrlGenPageTestId} from '../../../pages/tools/__mocks__/CustomScriptUrlGenPage';
import {HOYChatManagePageKey, HOYChatManagePageTestId} from '../../../pages/HOYChat/__mocks__/HOYChatManagePage';
import {PowerBIReportViewingPageKey, PowerBIReportViewingPageTestId} from '../../../pages/PowerBI/__mocks__/PowerBIReportViewingPage';
import {FinancePageKey, FinancePageTestId} from '../../../pages/Finance/__mocks__/FinancePage';
import {StudentSubjectListKey, StudentSubjectListTestId} from '../../../components/timeTable/__mocks__/StudentSubjectList';
import SchoolBoxUrls from '../../../layouts/SchoolBox/SchoolBoxUrls';
import {MGGS_MODULE_ID_FINANCE, MGGS_MODULE_ID_HOY_CHAT_EMAIL} from '../../../types/modules/iModuleUser';

jest.mock('../../../pages/studentReport/StudentReport');
jest.mock('../../../components/module/ModuleAccessWrapper');
jest.mock('../../../pages/houseAwards/HouseAwardsPage');
jest.mock('../../../pages/medicalReports/MedicalReportPage');
jest.mock('../../../pages/tools/CustomScriptUrlGenPage');
jest.mock('../../../pages/students/MyClassList/MyClassListPage');
jest.mock('../../../pages/BudgetTracker/BudgetTrackerPage');
jest.mock('../../../pages/parent/ParentDirectoryPage');
jest.mock('../../../pages/dataSubmissions/SchoolDataSubmissionsPage');
jest.mock('../../../components/StudentAbsence/StudentAbsenceParentSubmissionForm');
jest.mock('../../../pages/studentAbsences/StudentAbsencePage');
jest.mock('../../../pages/devices/MggDevicesPage');
jest.mock('../../../pages/Finance/FinancePage');
jest.mock('../../../pages/reports/StudentAttendanceReport/StudentAttendanceRateReportPage');
jest.mock('../../../pages/OnlineDonation/OnlineDonationMangerPage');
jest.mock('../../../pages/Staff/StaffListPage');
jest.mock('../../../pages/Enrollments/EnrolmentManagementPage');
jest.mock('../../../pages/students/StudentList/StudentListPage');
jest.mock('../../../pages/SynergeticEmailTemplate/SynergeticEmailTemplateManagerPage');
jest.mock('../../../pages/CampusDisplay/CampusDisplayManagementPage');
jest.mock('../../../pages/PowerBI/PowerBIReportViewingPage');
jest.mock('../../../pages/PowerBI/Manager/PowerBIReportManagerPage');
jest.mock('../../../components/PageNotFound');
jest.mock('../../../pages/AttendanceBulk/AdmissionsPage');
jest.mock('../../../pages/HOYChat/HOYChatManagePage');
jest.mock('../../../pages/HOYChat/components/HOYChatForm');
jest.mock('../../../components/timeTable/StudentSubjectList');

const SchoolBoxRouter = require('../../../layouts/SchoolBox/SchoolBoxRouter').default;

describe('SchoolBoxRouter', () => {
  ComponentTestHelper.prepare();

  const renderRouter = (path: string, entry = '/') =>
    render(
      <MemoryRouter
          initialEntries={[entry]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
      >
        <SchoolBoxRouter path={path} remoteUrl="https://remote.schoolbox" />
      </MemoryRouter>
    );

  const appendIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'remote';
    document.body.appendChild(iframe);
  };

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders the Power BI viewer for dynamic powerbi display urls', () => {
    appendIframe();

    renderRouter('/powerbi/report/report-123');

    expect(screen.getByTestId(PowerBIReportViewingPageTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(PowerBIReportViewingPageKey)[0]).toMatchObject({
      reportId: 'report-123',
    });
    expect(document.getElementById('remote')).toBeNull();
  });

  test('wraps the finance page with module access', () => {
    appendIframe();

    renderRouter(SchoolBoxUrls.Finance);

    expect(screen.getByTestId(ModuleAccessWrapperTestId)).toBeInTheDocument();
    expect(screen.getByTestId(FinancePageTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(ModuleAccessWrapperKey)[0]).toMatchObject({
      moduleId: MGGS_MODULE_ID_FINANCE,
    });
    expect(ComponentTestHelper.get(FinancePageKey).length).toBeGreaterThan(0);
    expect(document.getElementById('remote')).toBeNull();
  });

  test('passes the remote url and path through to the helper page route', () => {
    renderRouter(SchoolBoxUrls.ModuleUrlHelper);

    expect(screen.getByTestId(CustomScriptUrlGenPageTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(CustomScriptUrlGenPageKey)[0]).toMatchObject({
      customUrl: 'https://remote.schoolbox',
      customUrlPath: SchoolBoxUrls.ModuleUrlHelper,
    });
  });

  test('passes custom props for the HOY chat admin page', () => {
    renderRouter(SchoolBoxUrls.HOYChatAdmin);

    expect(screen.getByTestId(HOYChatManagePageTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(ModuleAccessWrapperKey)[0]).toMatchObject({
      moduleId: MGGS_MODULE_ID_HOY_CHAT_EMAIL,
    });
    expect(ComponentTestHelper.get(HOYChatManagePageKey)[0]).toMatchObject({
      customFormPath: '/hoyChatForm',
      customUrl: 'https://remote.schoolbox',
    });
  });

  test('passes the synId search param into the student subject list route', () => {
    renderRouter(SchoolBoxUrls.StudentBookList, '/?synId=5001');

    expect(screen.getByTestId(StudentSubjectListTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(StudentSubjectListKey)[0]).toMatchObject({
      studentSynId: '5001',
    });
  });

  test('falls back to page not found for unknown routes', () => {
    renderRouter('/unknown/path');

    expect(screen.getByTestId(PageNotFoundTestId)).toBeInTheDocument();
  });
});
