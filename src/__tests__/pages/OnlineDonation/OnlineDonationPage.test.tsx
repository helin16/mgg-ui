import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import OnlineDonationPage from '../../../pages/OnlineDonation/OnlineDonationPage';
import { OnlineDonationKey, OnlineDonationTestId } from '../../../pages/OnlineDonation/__mocks__/OnlineDonation';
jest.mock('../../../pages/OnlineDonation/OnlineDonation');

describe('OnlineDonationPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<OnlineDonationPage />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
