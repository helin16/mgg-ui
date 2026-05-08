import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import MggDevicesPage from '../../../pages/devices/MggDevicesPage';
import { ExplanationPanelKey, ExplanationPanelTestId } from '../../../components/__mocks__/ExplanationPanel';
import { SectionDivKey, SectionDivTestId } from '../../../components/common/__mocks__/SectionDiv';
import { MggDeviceListKey, MggDeviceListTestId } from '../../../pages/devices/components/__mocks__/MggDeviceList';
import { MggDevicesAdminPageKey, MggDevicesAdminPageTestId } from '../../../pages/devices/__mocks__/MggDevicesAdminPage';
jest.mock('../../../layouts/Page');
jest.mock('../../../components/ExplanationPanel');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../pages/devices/components/MggDeviceList');
jest.mock('../../../pages/devices/MggDevicesAdminPage');

describe('MggDevicesPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<MggDevicesPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
