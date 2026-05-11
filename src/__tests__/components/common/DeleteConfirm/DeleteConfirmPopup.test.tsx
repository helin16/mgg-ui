import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import DeleteConfirmPopup from '../../../../components/common/DeleteConfirm/DeleteConfirmPopup';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');

describe('DeleteConfirmPopup', () => {
  test('requires the confirmation string before allowing delete', () => {
    const onConfirm = jest.fn();

    render(
      <DeleteConfirmPopup
        isOpen
        confirmString="DELETE"
        onConfirm={onConfirm}
      />
    );

    const input = screen.getByPlaceholderText('DELETE');
    fireEvent.change(input, {target: {value: 'delete'}});
    fireEvent.click(screen.getByTestId('LoadingBtnTestId'));

    expect(onConfirm).toHaveBeenCalled();
  });
});
