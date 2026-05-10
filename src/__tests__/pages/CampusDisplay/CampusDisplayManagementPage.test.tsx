import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import CampusDisplayManagementPage from '../../../pages/CampusDisplay/CampusDisplayManagementPage';
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
