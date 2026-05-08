import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import CampusDisplayManagementPage from '../../../pages/CampusDisplay/CampusDisplayManagementPage';
import { CampusDisplayManagementAdminPageKey, CampusDisplayManagementAdminPageTestId } from '../../../pages/CampusDisplay/__mocks__/CampusDisplayManagementAdminPage';
import { PlayListEditPanelKey, PlayListEditPanelTestId } from '../../../components/CampusDisplay/Playlist/__mocks__/PlayListEditPanel';
import { PageLoadingSpinnerKey, PageLoadingSpinnerTestId } from '../../../components/common/__mocks__/PageLoadingSpinner';
import { CampusDisplayLocationSelectorKey, CampusDisplayLocationSelectorTestId } from '../../../components/CampusDisplay/DisplayLocation/__mocks__/CampusDisplayLocationSelector';
import { PageNotFoundKey, PageNotFoundTestId } from '../../../components/__mocks__/PageNotFound';
import { PanelTitleKey, PanelTitleTestId } from '../../../components/__mocks__/PanelTitle';
import { TableKey, TableTestId } from '../../../components/common/__mocks__/Table';
import { CampusDisplayLocationEditPopupBtnKey, CampusDisplayLocationEditPopupBtnTestId } from '../../../components/CampusDisplay/DisplayLocation/__mocks__/CampusDisplayLocationEditPopupBtn';
import { CampusDisplayScheduleListKey, CampusDisplayScheduleListTestId } from '../../../components/CampusDisplay/DisplaySchedule/__mocks__/CampusDisplayScheduleList';
jest.mock('../../../layouts/Page');
jest.mock('../../../pages/CampusDisplay/CampusDisplayManagementAdminPage');
jest.mock('../../../components/CampusDisplay/Playlist/PlayListEditPanel');
jest.mock('../../../components/common/PageLoadingSpinner');
jest.mock('../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationSelector');
jest.mock('../../../components/PageNotFound');
jest.mock('../../../components/PanelTitle');
jest.mock('../../../components/common/Table');
jest.mock('../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationEditPopupBtn');
jest.mock('../../../components/CampusDisplay/DisplaySchedule/CampusDisplayScheduleList');

describe('CampusDisplayManagementPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(() => undefined);

    const {container} = render(<CampusDisplayManagementPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
