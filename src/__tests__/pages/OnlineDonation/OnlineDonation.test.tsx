import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import OnlineDonation from '../../../pages/OnlineDonation/OnlineDonation';
import { FormLabelKey, FormLabelTestId } from '../../../components/form/__mocks__/FormLabel';
import { WestpacCreditCardInputPanelKey, WestpacCreditCardInputPanelTestId } from '../../../components/Payments/Westpac/__mocks__/WestpacCreditCardInputPanel';
import { LoadingBtnKey, LoadingBtnTestId } from '../../../components/common/__mocks__/LoadingBtn';
import { FormErrorDisplayKey, FormErrorDisplayTestId } from '../../../components/form/__mocks__/FormErrorDisplay';
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
