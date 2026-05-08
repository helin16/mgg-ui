import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey, AdminPageTabsTestId } from '../../../../layouts/__mocks__/AdminPageTabs';
import MyClassLisAdminPage from '../../../../pages/students/MyClassList/MyClassLisAdminPage';
import { StudentSubjectListModuleSettingsKey, StudentSubjectListModuleSettingsTestId } from '../../../../components/timeTable/__mocks__/StudentSubjectListModuleSettings';
jest.mock('../../../../layouts/AdminPage');
jest.mock('../../../../layouts/AdminPageTabs');
jest.mock('../../../../components/timeTable/StudentSubjectListModuleSettings');

describe('MyClassLisAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<MyClassLisAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(mockComponentTestHelper.get(AdminPageTabsKey).length).toBeGreaterThan(0);
    expect(container).not.toBeEmptyDOMElement();
  });
});
