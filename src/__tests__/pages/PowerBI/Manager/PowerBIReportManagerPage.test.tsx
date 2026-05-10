import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../../helper/ComponentTestHelper';
import PowerBIReportManagerPage from '../../../../pages/PowerBI/Manager/PowerBIReportManagerPage';
import { MGGS_MODULE_ID_POWER_BI_REPORT } from '../../../../types/modules/iModuleUser';
import { PageKey, PageTestId } from '../../../../layouts/__mocks__/Page';
import { ExplanationPanelKey, ExplanationPanelTestId } from '../../../../components/__mocks__/ExplanationPanel';
import { PowerBIListPanelTestId } from '../../../../components/powerBI/__mocks__/PowerBIListPanel';


jest.mock('../../../../layouts/Page');

jest.mock('../../../../components/ExplanationPanel');

jest.mock('../../../../components/powerBI/PowerBIListPanel');

describe('PowerBIReportManagerPage', () => {
  mockComponentTestHelper.prepare();

  test('renders the power bi manager page shell', () => {
    render(<PowerBIReportManagerPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(screen.getByTestId(ExplanationPanelTestId)).toBeInTheDocument();
    expect(screen.getByTestId(PowerBIListPanelTestId)).toBeInTheDocument();

    expect(mockComponentTestHelper.get(PageKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_POWER_BI_REPORT,
        AdminPage: expect.any(Function),
        title: expect.any(Object),
      }),
    ]);

    expect(mockComponentTestHelper.get(ExplanationPanelKey)).toEqual([
      expect.objectContaining({
        text: 'This is the management page for managing all integrating Power BI report into mConnect.',
      }),
    ]);
  });
});
