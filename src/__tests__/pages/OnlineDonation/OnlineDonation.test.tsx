import React from 'react';
import { render } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import OnlineDonation from '../../../pages/OnlineDonation/OnlineDonation';
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/Payments/Westpac/WestpacCreditCardInputPanel');
jest.mock('../../../components/common/LoadingBtn');
jest.mock('../../../components/form/FormErrorDisplay');

describe('OnlineDonation', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<OnlineDonation />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
