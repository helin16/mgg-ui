import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { AdminPageKey, AdminPageTestId } from '../../../layouts/__mocks__/AdminPage';
import { AdminPageTabsKey } from '../../../layouts/__mocks__/AdminPageTabs';
import CampusDisplayManagementAdminPage from '../../../pages/CampusDisplay/CampusDisplayManagementAdminPage';
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
