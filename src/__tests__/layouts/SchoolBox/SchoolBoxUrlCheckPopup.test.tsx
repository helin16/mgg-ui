import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useSelector} from 'react-redux';
import ComponentTestHelper from '../../helper/ComponentTestHelper';
import {PopupModalKey, PopupModalTestId} from '../../../components/common/__mocks__/PopupModal';
import SchoolBoxUrlCheckPopup from '../../../layouts/SchoolBox/SchoolBoxUrlCheckPopup';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('../../../components/common/PopupModal');

describe('SchoolBoxUrlCheckPopup', () => {
  ComponentTestHelper.prepare();

  const mockedUseSelector = useSelector as jest.Mock;

  test('does not show the popup when the current host matches the expected host', () => {
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({app: {backendSchoolBoxUrl: 'http://localhost'}})
    );

    render(<SchoolBoxUrlCheckPopup />);

    expect(screen.queryByTestId(PopupModalTestId)).not.toBeInTheDocument();
    expect(ComponentTestHelper.get(PopupModalKey)[0]?.show).toBe(false);
  });

  test('shows the popup when the current host does not match and closes it on ok', async () => {
    mockedUseSelector.mockImplementation((selector: any) =>
      selector({app: {backendSchoolBoxUrl: 'https://expected.schoolbox'}})
    );

    render(<SchoolBoxUrlCheckPopup />);

    expect(screen.getByTestId(PopupModalTestId)).toBeInTheDocument();
    expect(screen.getByText('Current host:')).toBeInTheDocument();
    expect(screen.getByText('http://localhost')).toBeInTheDocument();
    expect(screen.getByText('Expected host:')).toBeInTheDocument();
    expect(screen.getByText('https://expected.schoolbox')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', {name: 'OK'}));

    expect(screen.queryByTestId(PopupModalTestId)).not.toBeInTheDocument();
  });
});
