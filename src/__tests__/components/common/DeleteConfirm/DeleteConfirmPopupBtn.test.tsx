import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import DeleteConfirmPopupBtn from '../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import Toaster from '../../../../services/Toaster';

jest.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({auth: {user: {synergyId: '12345'}}}),
}));
jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../services/Toaster');

describe('DeleteConfirmPopupBtn', () => {
  test('returns null when deletingFn is missing', () => {
    const {container} = render(<DeleteConfirmPopupBtn>Delete</DeleteConfirmPopupBtn>);

    expect(container).toBeEmptyDOMElement();
  });

  test('confirms and runs the deletion flow', async () => {
    const deletingFn = jest.fn().mockResolvedValue({ok: true});
    const deletedCallbackFn = jest.fn();

    render(
      <DeleteConfirmPopupBtn deletingFn={deletingFn} deletedCallbackFn={deletedCallbackFn}>
        Delete
      </DeleteConfirmPopupBtn>
    );

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    fireEvent.change(screen.getByPlaceholderText('12345'), {target: {value: '12345'}});
    fireEvent.click(screen.getByTestId('LoadingBtnTestId'));

    await waitFor(() => expect(deletingFn).toHaveBeenCalled());
    expect(deletedCallbackFn).toHaveBeenCalledWith({ok: true});
    expect(Toaster.showApiError).not.toHaveBeenCalled();
  });
});
