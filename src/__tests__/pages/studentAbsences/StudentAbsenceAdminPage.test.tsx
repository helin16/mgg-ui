import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey, AdminPageTabsTestId } from '../../../layouts/__mocks__/AdminPageTabs';
import StudentAbsenceAdminPage from '../../../pages/studentAbsences/StudentAbsenceAdminPage';
import { ModuleUserListKey, ModuleUserListTestId } from '../../../components/module/__mocks__/ModuleUserList';
import { ExplanationPanelKey, ExplanationPanelTestId } from '../../../components/__mocks__/ExplanationPanel';
import { SectionDivKey, SectionDivTestId } from '../../../components/common/__mocks__/SectionDiv';
import { SchoolManagementTableKey, SchoolManagementTableTestId } from '../../../components/SchoolManagement/__mocks__/SchoolManagementTable';
import { StudentAbsenceModuleEditPanelKey, StudentAbsenceModuleEditPanelTestId } from '../../../pages/studentAbsences/components/__mocks__/StudentAbsenceModuleEditPanel';
import { MessageListPanelKey, MessageListPanelTestId } from '../../../components/common/Message/__mocks__/MessageListPanel';
import { TableKey, TableTestId } from '../../../components/common/__mocks__/Table';
import { ToggleBtnKey, ToggleBtnTestId } from '../../../components/common/__mocks__/ToggleBtn';
jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');
jest.mock('../../../components/module/ModuleUserList');
jest.mock('../../../components/ExplanationPanel');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../components/SchoolManagement/SchoolManagementTable');
jest.mock('../../../pages/studentAbsences/components/StudentAbsenceModuleEditPanel');
jest.mock('../../../components/common/Message/MessageListPanel');
jest.mock('../../../components/common/Table');
jest.mock('../../../components/common/ToggleBtn');

describe('StudentAbsenceAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<StudentAbsenceAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(mockComponentTestHelper.get(AdminPageTabsKey).length).toBeGreaterThan(0);
    expect(container).not.toBeEmptyDOMElement();
  });
});
