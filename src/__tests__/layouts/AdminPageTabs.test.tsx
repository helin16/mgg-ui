import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../helper/ComponentTestHelper';
import AdminPageTabs from '../../layouts/AdminPageTabs';
import {ROLE_ID_ADMIN, ROLE_ID_NORMAL} from '../../types/modules/iRole';

const TabsKey = 'Tabs';
const TabsTestId = 'Tabs';
const TabKey = 'Tab';
const TabTestId = 'Tab';
const ModuleUserListKey = 'ModuleUserList';
const ModuleUserListTestId = 'ModuleUserList';

jest.mock('react-bootstrap', () => ({
  Tab: mockComponentTestHelper.mockComponent(TabKey, TabTestId),
  Tabs: mockComponentTestHelper.mockComponent(TabsKey, TabsTestId),
}));

jest.mock('../../components/module/ModuleUserList', () => ({
  __esModule: true,
  default: mockComponentTestHelper.mockComponent(ModuleUserListKey, ModuleUserListTestId),
}));

describe('AdminPageTabs', () => {
  mockComponentTestHelper.prepare();

  test('renders default user and admin tabs', () => {
    render(<AdminPageTabs moduleId={88} />);

    expect(screen.getByTestId(TabsTestId)).toBeInTheDocument();
    expect(screen.getAllByTestId(TabTestId)).toHaveLength(2);
    expect(screen.getAllByTestId(ModuleUserListTestId)).toHaveLength(2);

    expect(mockComponentTestHelper.get(TabsKey)).toEqual([
      expect.objectContaining({
        activeKey: 'Users',
        onSelect: expect.any(Function),
        unmountOnExit: true,
      }),
    ]);

    expect(mockComponentTestHelper.get(TabKey).map((tab: any) => ({
      eventKey: tab.eventKey,
      title: tab.title,
    }))).toEqual([
      {eventKey: 'Users', title: 'Users'},
      {eventKey: 'Admins', title: 'Admins'},
    ]);

    expect(mockComponentTestHelper.get(ModuleUserListKey)).toEqual([
      expect.objectContaining({
        moduleId: 88,
        roleId: ROLE_ID_NORMAL,
        showDeletingBtn: true,
        showCreatingPanel: true,
      }),
      expect.objectContaining({
        moduleId: 88,
        roleId: ROLE_ID_ADMIN,
        showDeletingBtn: true,
        showCreatingPanel: true,
      }),
    ]);
  });
});
