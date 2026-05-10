import React from 'react';
import { render } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import OnlineDonationPage from '../../../pages/OnlineDonation/OnlineDonationPage';
jest.mock('../../../pages/OnlineDonation/OnlineDonation');

describe('OnlineDonationPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<OnlineDonationPage />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
