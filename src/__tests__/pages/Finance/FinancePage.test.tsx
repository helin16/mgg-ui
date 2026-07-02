import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import FinancePage from '../../../pages/Finance/FinancePage';
import { MGGS_MODULE_ID_FINANCE } from '../../../types/modules/iModuleUser';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';


jest.mock('../../../layouts/Page');

jest.mock('../../../pages/Finance/components/SynDebtorPaymentMethod/ExpiringCreditCardsPanel');

jest.mock('../../../pages/Finance/components/MonthlyBilling/MonthlyBillingReportPanel');

jest.mock('../../../components/reports/BudgetForecast/BudgetForecastPanel');

jest.mock('../../../components/BPay/CreditorBPayPanel');

jest.mock('../../../pages/Finance/components/DebitorsListPanel');

describe('FinancePage', () => {
  mockComponentTestHelper.prepare();

  test('renders the finance page shell and tabs', () => {
    render(<FinancePage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(screen.getByText('Debtors')).toBeInTheDocument();

    expect(mockComponentTestHelper.get(PageKey)).toEqual([
      expect.objectContaining({
        moduleId: MGGS_MODULE_ID_FINANCE,
        AdminPage: expect.any(Function),
        children: expect.anything(),
        title: expect.any(Object),
      }),
    ]);
  });
});
