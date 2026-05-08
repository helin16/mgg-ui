import React from 'react';
import {render, screen} from '@testing-library/react';
import mockComponentTestHelper from '../../helper/ComponentTestHelper';
import CampusDisplayPage from '../../../pages/CampusDisplay/CampusDisplayPage';
import { FormLabelKey, FormLabelTestId } from '../../../components/form/__mocks__/FormLabel';
import { SchoolLogoKey, SchoolLogoTestId } from '../../../components/__mocks__/SchoolLogo';
import { SectionDivKey, SectionDivTestId } from '../../../components/common/__mocks__/SectionDiv';
import { PageLoadingSpinnerKey, PageLoadingSpinnerTestId } from '../../../components/common/__mocks__/PageLoadingSpinner';
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
