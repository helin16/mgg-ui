import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import HouseAwardsPage from '../../../pages/houseAwards/HouseAwardsPage';
import { HouseAwardEventTypesKey, HouseAwardEventTypesTestId } from '../../../pages/houseAwards/components/__mocks__/HouseAwardEventTypes';
import { HouseAwardScoreBoardKey, HouseAwardScoreBoardTestId } from '../../../pages/houseAwards/components/__mocks__/HouseAwardScoreBoard';
import { ModuleAdminBtnKey, ModuleAdminBtnTestId } from '../../../components/module/__mocks__/ModuleAdminBtn';
import { HouseAwardAdminPageKey, HouseAwardAdminPageTestId } from '../../../pages/houseAwards/__mocks__/HouseAwardAdminPage';
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
