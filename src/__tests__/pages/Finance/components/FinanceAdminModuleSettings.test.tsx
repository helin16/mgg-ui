import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../../helper/ComponentTestHelper';
import FinanceAdminModuleSettings from '../../../../pages/Finance/components/FinanceAdminModuleSettings';
import {MGGS_MODULE_ID_FINANCE} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';
import { ModuleEditPanelKey, ModuleEditPanelTestId } from '../../../../components/module/__mocks__/ModuleEditPanel';


jest.mock('../../../../components/module/ModuleEditPanel');

describe('FinanceAdminModuleSettings', () => {
  mockComponentTestHelper.prepare();

  test('renders the finance module settings editor through ModuleEditPanel', () => {
    render(<FinanceAdminModuleSettings />);

    expect(screen.getByTestId(ModuleEditPanelTestId)).toBeInTheDocument();

    expect(mockComponentTestHelper.get(ModuleEditPanelKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_FINANCE,
        roleId: ROLE_ID_ADMIN,
        getChildren: expect.any(Function),
        getSubmitData: expect.any(Function),
      }),
    ]);
  });
});
