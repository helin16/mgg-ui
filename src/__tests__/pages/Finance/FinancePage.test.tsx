import React from 'react';
import {render, screen} from '@testing-library/react';
import moment from 'moment-timezone';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import FinancePage from '../../../pages/Finance/FinancePage';
import {MGGS_MODULE_ID_FINANCE} from '../../../types/modules/iModuleUser';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import { ExpiringCreditCardsPanelKey, ExpiringCreditCardsPanelTestId } from '../../../pages/Finance/components/SynDebtorPaymentMethod/__mocks__/ExpiringCreditCardsPanel';
import { MonthlyBillingReportPanelKey, MonthlyBillingReportPanelTestId } from '../../../pages/Finance/components/MonthlyBilling/__mocks__/MonthlyBillingReportPanel';
import { BudgetForecastPanelKey, BudgetForecastPanelTestId } from '../../../components/reports/BudgetForecast/__mocks__/BudgetForecastPanel';
import { CreditorBPayPanelKey, CreditorBPayPanelTestId } from '../../../components/BPay/__mocks__/CreditorBPayPanel';


jest.mock('../../../layouts/Page');

jest.mock('../../../pages/Finance/components/SynDebtorPaymentMethod/ExpiringCreditCardsPanel');

jest.mock('../../../pages/Finance/components/MonthlyBilling/MonthlyBillingReportPanel');

jest.mock('../../../components/reports/BudgetForecast/BudgetForecastPanel');

jest.mock('../../../components/BPay/CreditorBPayPanel');

describe('FinancePage', () => {
  mockComponentTestHelper.prepare();

  test('renders the finance page shell and tabs', () => {
    render(<FinancePage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();

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
