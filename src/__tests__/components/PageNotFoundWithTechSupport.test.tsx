import React from 'react';
import {render, screen} from '@testing-library/react';
import ComponentTestHelper from '../helper/ComponentTestHelper';
import {PageNotFoundKey, PageNotFoundTestId} from '../../components/__mocks__/PageNotFound';
import PageNotFoundWithTechSupport from '../../components/PageNotFoundWithTechSupport';

jest.mock('../../components/PageNotFound');

describe('PageNotFoundWithTechSupport', () => {
  ComponentTestHelper.prepare();

  test('wires the tech support props into PageNotFound', () => {
    process.env.REACT_APP_MAIN_WEBSITE_URL = 'https://mggs.example';

    render(<PageNotFoundWithTechSupport />);

    expect(screen.getByTestId(PageNotFoundTestId)).toBeInTheDocument();
    expect(ComponentTestHelper.get(PageNotFoundKey)[0]).toMatchObject({
      title: 'Service Support',
      description: "Mentone Girls' Grammar Service Support",
    });
  });
});
