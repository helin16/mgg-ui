import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import { PageKey, PageTestId } from '../../../layouts/__mocks__/Page';
import SchoolDataSubmissionsPage from '../../../pages/dataSubmissions/SchoolDataSubmissionsPage';
import { SchoolDataSubmissionsAdminPageKey, SchoolDataSubmissionsAdminPageTestId } from '../../../pages/dataSubmissions/__mocks__/SchoolDataSubmissionsAdminPage';
import { SchoolDataSubmissionsPanelKey, SchoolDataSubmissionsPanelTestId } from '../../../pages/dataSubmissions/components/__mocks__/SchoolDataSubmissionsPanel';
jest.mock('../../../layouts/Page');
jest.mock('../../../pages/dataSubmissions/SchoolDataSubmissionsAdminPage');
jest.mock('../../../pages/dataSubmissions/components/SchoolDataSubmissionsPanel');

describe('SchoolDataSubmissionsPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    const {container} = render(<SchoolDataSubmissionsPage />);

    expect(screen.getByTestId(PageTestId)).toBeInTheDocument();
    expect(mockComponentTestHelper.get(PageKey).length).toBeGreaterThan(0);

    expect(container).not.toBeEmptyDOMElement();
  });
});
