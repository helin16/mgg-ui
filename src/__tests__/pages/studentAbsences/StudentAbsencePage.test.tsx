import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import StudentAbsencePage from '../../../pages/studentAbsences/StudentAbsencePage';
import {PageKey, PageTestId} from '../../../layouts/__mocks__/Page';
import {SectionDivKey} from '../../../components/common/__mocks__/SectionDiv';
import {MGGS_MODULE_ID_STUDENT_ABSENCES} from '../../../types/modules/iModuleUser';

jest.mock('../../../layouts/Page');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../pages/studentAbsences/components/StudentAbsenceList', () => ({
  __esModule: true,
  default: () => <div data-testid="StudentAbsenceList">StudentAbsenceList</div>,
}));

describe('StudentAbsencePage', () => {
  mockComponentTestHelper.prepare();

  test('wraps StudentAbsenceList in a margin-top SectionDiv inside the page', () => {
    render(<StudentAbsencePage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_STUDENT_ABSENCES,
        AdminPage: expect.any(Function),
      }),
    ]);

    expect(mockComponentTestHelper.get(SectionDivKey)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          className: 'margin-top',
        }),
      ])
    );
    expect(screen.getByTestId('StudentAbsenceList')).toBeInTheDocument();
  });
});
