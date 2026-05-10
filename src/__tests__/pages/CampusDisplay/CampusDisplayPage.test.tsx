import React from 'react';
import { render } from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import CampusDisplayPage from '../../../pages/CampusDisplay/CampusDisplayPage';
jest.mock('../../../components/form/FormLabel');
jest.mock('../../../components/SchoolLogo');
jest.mock('../../../components/common/SectionDiv');
jest.mock('../../../components/common/PageLoadingSpinner');

describe('CampusDisplayPage', () => {
  mockComponentTestHelper.prepare();

  test('renders page composition', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(() => undefined);

    const {container} = render(<CampusDisplayPage />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
