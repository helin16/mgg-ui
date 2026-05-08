import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../../helper/ComponentTestHelper';
import PowerBIReportManagerAdminPage from '../../../../pages/PowerBI/Manager/PowerBIReportManagerAdminPage';
import {MGGS_MODULE_ID_POWER_BI_REPORT} from '../../../../types/modules/iModuleUser';
import {
  AdminPageKey,
  AdminPageTestId,
} from '../../../../layouts/__mocks__/AdminPage';
import {
  AdminPageTabsKey,
  AdminPageTabsTestId,
} from '../../../../layouts/__mocks__/AdminPageTabs';

jest.mock('../../../../layouts/AdminPage');
jest.mock('../../../../layouts/AdminPageTabs');

describe('PowerBIReportManagerAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders the power bi manager admin shell', () => {
    const onNavBack = jest.fn();

    render(<PowerBIReportManagerAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(screen.getByTestId(AdminPageTabsTestId)).toBeInTheDocument();

    expect(mockComponentTestHelper.get(AdminPageKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_POWER_BI_REPORT,
        onNavBack,
        title: expect.any(Object),
      }),
    ]);

    expect(mockComponentTestHelper.get(AdminPageTabsKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_POWER_BI_REPORT,
      }),
    ]);
  });
});
