import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ColumnPopupSelector, {getSelectedColumnsFromLocalStorage} from '../../../components/common/ColumnPopupSelector';
import LocalStorageService from '../../../services/LocalStorageService';

jest.mock('../../../components/common/PopupModal');
jest.mock('../../../services/LocalStorageService', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe('ColumnPopupSelector', () => {
  const mockedLocalStorage = LocalStorageService as jest.Mocked<typeof LocalStorageService>;

  test('restores selected columns from local storage', () => {
    mockedLocalStorage.getItem.mockReturnValue(['name']);

    expect(
      getSelectedColumnsFromLocalStorage('columns', [
        {key: 'name', header: 'Name'},
        {key: 'age', header: 'Age'},
      ] as any)
    ).toEqual([expect.objectContaining({key: 'name'})]);
  });

  test('opens the popup and saves selected columns', () => {
    const onColumnSelected = jest.fn();

    render(
      <ColumnPopupSelector
        columns={[
          {key: 'name', header: 'Name', isDefault: true},
          {key: 'age', header: 'Age'},
        ] as any}
        localStorageKey="columns"
        onColumnSelected={onColumnSelected}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: /Columns/i}));
    fireEvent.click(screen.getByLabelText('Age'));

    expect(onColumnSelected).toHaveBeenCalled();
    expect(mockedLocalStorage.setItem).toHaveBeenCalled();
  });
});
