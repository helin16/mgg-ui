import React from 'react';
import { render, screen } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import StaffListPage from '../../../pages/Staff/StaffListPage';
jest.mock('../../../layouts/Page');
jest.mock('../../../components/staff/StaffListPanel');
jest.mock('../../../pages/Staff/StaffListAdminPage');

describe('StaffListPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<StaffListPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
