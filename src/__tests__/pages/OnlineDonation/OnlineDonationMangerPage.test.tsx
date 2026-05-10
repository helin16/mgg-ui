import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import OnlineDonationMangerPage from '../../../pages/OnlineDonation/OnlineDonationMangerPage';
jest.mock('../../../layouts/Page');
jest.mock('../../../pages/OnlineDonation/components/OnlineDonationListPanel');
jest.mock('../../../pages/OnlineDonation/OnlineDonationAdminPage');
jest.mock('../../../pages/OnlineDonation/components/DonorReceiptList');
jest.mock('../../../components/common/Message/MessageListPanel');

describe('OnlineDonationMangerPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<OnlineDonationMangerPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
