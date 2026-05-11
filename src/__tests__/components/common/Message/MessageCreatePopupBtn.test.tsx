import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import MessageCreatePopupBtn from '../../../../components/common/Message/MessageCreatePopupBtn';
import MessageService from '../../../../services/MessageService';

jest.mock('../../../../components/common/LoadingBtn');
jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../services/MessageService', () => ({
  __esModule: true,
  default: {
    getMessages: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('MessageCreatePopupBtn', () => {
  test('checks running jobs and triggers a new job when none exists', async () => {
    const createMsgFn = jest.fn().mockResolvedValue({id: 'msg-1', error: null, response: null});
    (MessageService.getMessages as jest.Mock).mockResolvedValue({data: []});

    render(<MessageCreatePopupBtn msgType="REPORT" createMsgFn={createMsgFn}>Trigger Job</MessageCreatePopupBtn>);

    fireEvent.click(screen.getAllByTestId('LoadingBtnTestId')[0]);

    await waitFor(() => expect(MessageService.getMessages).toHaveBeenCalled());
    fireEvent.click(screen.getAllByTestId('LoadingBtnTestId')[1]);

    await waitFor(() => expect(createMsgFn).toHaveBeenCalled());
  });
});
