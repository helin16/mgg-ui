import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import {AdminPageKey, AdminPageTestId} from '../../../layouts/__mocks__/AdminPage';
import {AdminPageTabsKey, AdminPageTabsTestId} from '../../../layouts/__mocks__/AdminPageTabs';
import ParentTeacherInterviewAdminPage from '../../../pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage';

jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');
jest.mock('../../../pages/ParentTeacherInterview/components/ParentTeacherInterviewModuleSettingsPanel');
jest.mock('../../../components/common/Message/MessageListPanel');

describe('ParentTeacherInterviewAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<ParentTeacherInterviewAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(screen.getByTestId(AdminPageTabsTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);
    expect(mockComponentTestHelper.get(AdminPageTabsKey)).toEqual([
      expect.objectContaining({
        moduleId: 24,
        extraTabs: [
          expect.objectContaining({
            key: 'settings',
            title: 'Settings',
          }),
          expect.objectContaining({
            key: 'logs',
            title: 'Logs',
          }),
        ],
      }),
    ]);
    expect(container).not.toBeEmptyDOMElement();
  });
});
