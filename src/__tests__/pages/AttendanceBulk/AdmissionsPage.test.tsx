import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import AdmissionsPage from '../../../pages/AttendanceBulk/AdmissionsPage';
import {MGGS_MODULE_ID_ADMISSIONS} from '../../../types/modules/iModuleUser';
import { TabKey, TabsKey, TabsTestId } from '../../../../__mocks__/react-bootstrap';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';


jest.mock('../../../layouts/Page');

jest.mock('react-bootstrap');

jest.mock('../../../components/Attendance/AttendancesListWithSearchPanel');

jest.mock('../../../components/student/StudentRetainingRate');

describe('AdmissionsPage', () => {
  mockComponentTestHelper.prepare();

  test('renders the admissions page shell and tab content', () => {
    render(<AdmissionsPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();

    expect(mockComponentTestHelper.get(PageKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_ADMISSIONS,
        className: 'attendances-bulk-page',
        AdminPage: expect.any(Function),
        children: expect.anything(),
        title: expect.any(Object),
      }),
    ]);
  });
});
