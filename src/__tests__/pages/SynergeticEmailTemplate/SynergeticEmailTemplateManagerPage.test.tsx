import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import SynergeticEmailTemplateManagerPage from '../../../pages/SynergeticEmailTemplate/SynergeticEmailTemplateManagerPage';
import { TabKey, TabTestId, TabsKey, TabsTestId } from '../../../../__mocks__/react-bootstrap';
import { SynergeticEmailTemplateListKey, SynergeticEmailTemplateListTestId } from '../../../pages/SynergeticEmailTemplate/components/__mocks__/SynergeticEmailTemplateList';
import { SynergeticEmailTemplateManagerAdminPageKey, SynergeticEmailTemplateManagerAdminPageTestId } from '../../../pages/SynergeticEmailTemplate/__mocks__/SynergeticEmailTemplateManagerAdminPage';
import { MessageListPanelKey, MessageListPanelTestId } from '../../../components/common/Message/__mocks__/MessageListPanel';
jest.mock('react-bootstrap');
jest.mock('../../../layouts/Page');
jest.mock('../../../pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList');
jest.mock('../../../pages/SynergeticEmailTemplate/SynergeticEmailTemplateManagerAdminPage');
jest.mock('../../../components/common/Message/MessageListPanel');

describe('SynergeticEmailTemplateManagerPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<SynergeticEmailTemplateManagerPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
