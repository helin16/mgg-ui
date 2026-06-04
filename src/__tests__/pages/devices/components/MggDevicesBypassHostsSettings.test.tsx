import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../../helper/ComponentTestHelper';
import MggDevicesBypassHostsSettings, {
  getHostsFromValue,
} from '../../../../pages/devices/components/MggDevicesBypassHostsSettings';
import {MGGS_MODULE_ID_MGG_APP_DEVICES} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../../../types/modules/iRole';
import {
  ModuleEditPanelKey,
  ModuleEditPanelTestId,
} from '../../../../components/module/__mocks__/ModuleEditPanel';

jest.mock('../../../../components/module/ModuleEditPanel');

describe('MggDevicesBypassHostsSettings', () => {
  mockComponentTestHelper.prepare();

  test('renders the devices bypass hosts editor through ModuleEditPanel', () => {
    render(<MggDevicesBypassHostsSettings />);

    expect(screen.getByTestId(ModuleEditPanelTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(ModuleEditPanelKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_MGG_APP_DEVICES,
        roleId: ROLE_ID_ADMIN,
        getChildren: expect.any(Function),
        getSubmitData: expect.any(Function),
      }),
    ]);
  });

  test('normalizes bypass hosts input', () => {
    expect(getHostsFromValue(' WWW.MCBSCHOOLS.COM \nwww.mcbschools.com\n school.example.com ')).toEqual([
      'www.mcbschools.com',
      'school.example.com',
    ]);
  });
});
