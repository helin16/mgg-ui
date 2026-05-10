import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import HOYChatManagePage from '../../../pages/HOYChat/HOYChatManagePage';
jest.mock('../../../layouts/Page');
jest.mock('../../../pages/HOYChat/HOYChatManageAdminPage');
jest.mock('../../../components/ExplanationPanel');

describe('HOYChatManagePage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<HOYChatManagePage customUrl="https://example.test" customFormPath="/sample/form" />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
