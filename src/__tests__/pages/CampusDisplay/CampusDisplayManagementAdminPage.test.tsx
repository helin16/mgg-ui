import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey, AdminPageTabsTestId } from '../../../layouts/__mocks__/AdminPageTabs';
import CampusDisplayManagementAdminPage from '../../../pages/CampusDisplay/CampusDisplayManagementAdminPage';
import { CampusDisplayListKey, CampusDisplayListTestId } from '../../../components/CampusDisplay/Playlist/__mocks__/CampusDisplayList';
import { CampusDisplayLocationListKey, CampusDisplayLocationListTestId } from '../../../components/CampusDisplay/DisplayLocation/__mocks__/CampusDisplayLocationList';
import { PlayListEditPanelKey, PlayListEditPanelTestId } from '../../../components/CampusDisplay/Playlist/__mocks__/PlayListEditPanel';
import { AssetListPanelKey, AssetListPanelTestId } from '../../../components/Asset/__mocks__/AssetListPanel';
import { AssetInfoPanelKey, AssetInfoPanelTestId } from '../../../components/Asset/__mocks__/AssetInfoPanel';
import { SectionDivKey, SectionDivTestId } from '../../../components/common/__mocks__/SectionDiv';
jest.mock('../../../layouts/AdminPage');
jest.mock('../../../layouts/AdminPageTabs');
jest.mock('../../../components/CampusDisplay/Playlist/CampusDisplayList');
jest.mock('../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationList');
jest.mock('../../../components/CampusDisplay/Playlist/PlayListEditPanel');
jest.mock('../../../components/Asset/AssetListPanel');
jest.mock('../../../components/Asset/AssetInfoPanel');
jest.mock('../../../components/common/SectionDiv');

describe('CampusDisplayManagementAdminPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const onNavBack = jest.fn();
    const {container} = render(<CampusDisplayManagementAdminPage onNavBack={onNavBack} />);

    expect(screen.getByTestId(AdminPageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(AdminPageKey).length).toBeGreaterThan(0);

    expect(mockComponentTestHelper.get(AdminPageTabsKey).length).toBeGreaterThan(0);
    expect(container).not.toBeEmptyDOMElement();
  });
});
