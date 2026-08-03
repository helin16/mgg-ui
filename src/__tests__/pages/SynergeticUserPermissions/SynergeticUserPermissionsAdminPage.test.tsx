import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import {AdminPageKey, AdminPageTestId} from '../../../layouts/__mocks__/AdminPage';
import {AdminPageTabsKey} from '../../../layouts/__mocks__/AdminPageTabs';
import SynergeticUserPermissionsAdminPage
  from '../../../pages/SynergeticUserPermissions/SynergeticUserPermissionsAdminPage';
import {MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS} from '../../../types/modules/iModuleUser';

jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');

describe('SynergeticUserPermissionsAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders module administration tabs with settings', () => {
    const onNavBack = jest.fn();

    render(<SynergeticUserPermissionsAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey)[0]).toMatchObject({
      moduleId: MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS,
      onNavBack,
    });
    expect(mockComponentTestHelper.get(AdminPageTabsKey)[0]).toMatchObject({
      moduleId: MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS,
      extraTabs: [expect.objectContaining({
        key: 'settings',
        title: 'Settings',
      })],
    });
  });
});
