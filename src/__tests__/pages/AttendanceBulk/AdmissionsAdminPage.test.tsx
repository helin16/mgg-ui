import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import AdmissionsAdminPage from '../../../pages/AttendanceBulk/AdmissionsAdminPage';
import {MGGS_MODULE_ID_ADMISSIONS} from '../../../types/modules/iModuleUser';
import {
  AdminPageKey,
  AdminPageTestId,
} from '../../../layouts/__mocks__/AdminPage';
import {
  AdminPageTabsKey,
  AdminPageTabsTestId,
} from '../../../layouts/__mocks__/AdminPageTabs';

jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');

describe('AdmissionsAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders the admissions admin page shell', () => {
    const onNavBack = jest.fn();

    render(<AdmissionsAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(screen.getByTestId(AdminPageTabsTestId)).toBeInTheDocument();

    expect(mockComponentTestHelper.get(AdminPageKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_ADMISSIONS,
        onNavBack,
        title: expect.any(Object),
      }),
    ]);

    expect(mockComponentTestHelper.get(AdminPageTabsKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_ADMISSIONS,
      }),
    ]);
  });
});
