import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey, AdminPageTabsTestId } from '../../../layouts/__mocks__/AdminPageTabs';
import HouseAwardAdminPage from '../../../pages/houseAwards/HouseAwardAdminPage';
import { HouseAwardEventTableKey, HouseAwardEventTableTestId } from '../../../pages/houseAwards/components/__mocks__/HouseAwardEventTable';
import { HouseAwardEventTypeTableKey, HouseAwardEventTypeTableTestId } from '../../../pages/houseAwards/components/__mocks__/HouseAwardEventTypeTable';
import { SectionDivKey, SectionDivTestId } from '../../../components/common/__mocks__/SectionDiv';
import { SynLuHouseTableKey, SynLuHouseTableTestId } from '../../../components/HouseAwards/__mocks__/SynLuHouseTable';
jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');
jest.mock('../../../pages/houseAwards/components/HouseAwardEventTable');
jest.mock('../../../pages/houseAwards/components/HouseAwardEventTypeTable');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../components/HouseAwards/SynLuHouseTable');

describe('HouseAwardAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<HouseAwardAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(mockComponentTestHelper.get(AdminPageTabsKey).length).toBeGreaterThan(0);
    expect(container).not.toBeEmptyDOMElement();
  });
});
