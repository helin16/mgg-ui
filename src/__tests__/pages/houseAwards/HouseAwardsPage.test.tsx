import React from 'react';
import { render } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import HouseAwardsPage from '../../../pages/houseAwards/HouseAwardsPage';
jest.mock('../../../pages/houseAwards/components/HouseAwardEventTypes');
jest.mock('../../../pages/houseAwards/components/HouseAwardScoreBoard');
jest.mock('../../../components/module/ModuleAdminBtn');
jest.mock('../../../pages/houseAwards/HouseAwardAdminPage');

describe('HouseAwardsPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<HouseAwardsPage />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
