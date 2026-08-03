import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import {PageKey, PageTestId} from '../../../layouts/__mocks__/Page';
import SynergeticUserPermissionsPage from '../../../pages/SynergeticUserPermissions/SynergeticUserPermissionsPage';
import {MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS} from '../../../types/modules/iModuleUser';
import {
  SynergeticUserPermissionsPanelTestId
} from '../../../pages/SynergeticUserPermissions/components/__mocks__/SynergeticUserPermissionsPanel';

jest.mock('../../../layouts/Page');
jest.mock('../../../pages/SynergeticUserPermissions/SynergeticUserPermissionsAdminPage');
jest.mock('../../../pages/SynergeticUserPermissions/components/SynergeticUserPermissionsPanel');

describe('SynergeticUserPermissionsPage', () => {
  mockComponentTestHelper.prepare();

  test('renders the module page and permissions panel', () => {
    render(<SynergeticUserPermissionsPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(screen.getByTestId(SynergeticUserPermissionsPanelTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey)[0]).toMatchObject({
      moduleId: MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS,
    });
  });
});
