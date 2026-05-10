import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { RedPageKey, RedPageTestId } from '../../../layouts/__mocks__/RedPage';
import AssetPickupPage from '../../../pages/assets/AssetPickupPage';
jest.mock('../../../layouts/RedPage');
jest.mock('../../../components/SchoolLogo');
jest.mock('../../../pages/assets/components/SearchPanel');
jest.mock('../../../pages/assets/components/AssetPickupConfirm');

describe('AssetPickupPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<AssetPickupPage />);

    expect(screen.getByTestId(RedPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(RedPageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
