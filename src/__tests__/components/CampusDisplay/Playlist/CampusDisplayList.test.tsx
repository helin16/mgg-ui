import React from 'react';
import {render, screen} from '@testing-library/react';
import CampusDisplayList from '../../../../components/CampusDisplay/Playlist/CampusDisplayList';
import {
  setUseListCrudHookMock,
  useListCrudHookTestId,
} from '../../../../components/hooks/useListCrudHook/useListCrudHook';
import TestHelper from '../../../helper/TestHelper';

jest.mock('../../../../components/hooks/useListCrudHook/useListCrudHook');
jest.mock('../../../../components/common/PageLoadingSpinner');
jest.mock('../../../../components/CampusDisplay/Playlist/CampusDisplayEditPopupBtn');
jest.mock('../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn');
jest.mock('../../../../components/common/UserAndDateTimePanel');
jest.mock('../../../../services/CampusDisplay/CampusDisplayLocationService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn().mockResolvedValue({data: []}),
  },
}));
jest.mock('../../../../services/Toaster');

describe('CampusDisplayList', () => {
  test('renders playlist rows through the list hook output', () => {
    const fakeName = TestHelper.faker.company.name();
    setUseListCrudHookMock({
      state: {
        isLoading: false,
        data: {
          data: [{id: 'display-1', name: fakeName}],
        },
      },
    });

    render(<CampusDisplayList narrowMode />);

    expect(screen.getByTestId(useListCrudHookTestId)).toBeInTheDocument();
    expect(screen.getByText(fakeName)).toBeInTheDocument();
  });
});
