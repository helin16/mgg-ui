import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey, AdminPageTabsTestId } from '../../../layouts/__mocks__/AdminPageTabs';
import MggDevicesAdminPage from '../../../pages/devices/MggDevicesAdminPage';
import {MGGS_MODULE_ID_MGG_APP_DEVICES} from '../../../types/modules/iModuleUser';
jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');

describe('MggDevicesAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition with bypass hosts tab', () => {
    const onNavBack = jest.fn();
    const {container} = render(<MggDevicesAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(screen.getByTestId(AdminPageTabsTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageTabsKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_MGG_APP_DEVICES,
        extraTabs: [
          expect.objectContaining({
            key: 'bypass-hosts',
            title: 'Bypass Hosts',
          }),
        ],
      }),
    ]);
    expect(container).not.toBeEmptyDOMElement();
  });
});
