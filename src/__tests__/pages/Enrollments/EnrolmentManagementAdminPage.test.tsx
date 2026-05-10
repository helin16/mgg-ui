import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey } from '../../../layouts/__mocks__/AdminPageTabs';
import EnrolmentManagementAdminPage from '../../../pages/Enrollments/EnrolmentManagementAdminPage';
jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');
jest.mock('../../../pages/Enrollments/components/EnrolmentManagementAdminSettings');
jest.mock('../../../components/common/Message/MessageListPanel');

describe('EnrolmentManagementAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<EnrolmentManagementAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(mockComponentTestHelper.get(AdminPageTabsKey).length).toBeGreaterThan(0);
    expect(container).not.toBeEmptyDOMElement();
  });
});
