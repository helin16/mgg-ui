import React from 'react';
import {render, screen} from '@testing-library/react';
import CampusDisplayLocationList from '../../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationList';
import {PageLoadingSpinnerTestId} from '../../../../components/common/__mocks__/PageLoadingSpinner';
import {
  setUseListCrudHookMock,
  useListCrudHookKey,
  useListCrudHookTestId,
} from '../../../../components/hooks/useListCrudHook/useListCrudHook';
import ComponentTestHelper from '../../../helper/ComponentTestHelper';
import TestHelper from '../../../helper/TestHelper';

jest.mock('../../../../components/common/PageLoadingSpinner');
jest.mock('../../../../components/hooks/useListCrudHook/useListCrudHook');
jest.mock('../../../../components/CampusDisplay/DisplayLocation/CampusDisplayLocationEditPopupBtn');
jest.mock('../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn');
jest.mock('../../../../components/common/UserAndDateTimePanel');

describe('CampusDisplayLocationList', () => {
  ComponentTestHelper.prepare();

  test('shows a loading spinner while the list hook is loading', () => {
    setUseListCrudHookMock({state: {isLoading: true}});

    render(<CampusDisplayLocationList />);

    expect(screen.getByTestId(PageLoadingSpinnerTestId)).toBeInTheDocument();
  });

  test('renders location rows through the list hook table output', () => {
    const fakeName = TestHelper.faker.location.city();
    setUseListCrudHookMock({
      state: {
        isLoading: false,
        data: {
          data: [{id: 'location-1', name: fakeName, CampusDisplay: {name: 'Display One'}}],
        },
      },
    });

    render(<CampusDisplayLocationList />);

    expect(screen.getByTestId(useListCrudHookTestId)).toBeInTheDocument();
    expect(screen.getByText(fakeName)).toBeInTheDocument();
    expect(ComponentTestHelper.get(useListCrudHookKey)[0]?.perPage).toBe(99999);
  });
});
