import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import MessageListPanel from '../../../../components/common/Message/MessageListPanel';
import MessageService from '../../../../services/MessageService';

jest.mock('../../../../components/common/PopupModal');
jest.mock('../../../../services/MessageService', () => ({
  __esModule: true,
  default: {
    getMessages: jest.fn(),
  },
}));
jest.mock('../../../../services/Toaster');

describe('MessageListPanel', () => {
  test('loads messages and refreshes the list', async () => {
    (MessageService.getMessages as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 'msg-1',
          type: 'REPORT',
          createdAt: '2026-05-11T10:00:00',
          updatedAt: '2026-05-11T10:00:00',
          request: '{}',
          response: '{"ok":true}',
          error: null,
        },
      ],
      currentPage: 1,
      pages: 1,
    });

    render(<MessageListPanel type="REPORT" />);

    await waitFor(() => expect(MessageService.getMessages).toHaveBeenCalled());
    expect(screen.getByText('REPORT')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: /Refresh/i}));
    await waitFor(() => expect(MessageService.getMessages).toHaveBeenCalledTimes(2));
  });
});
