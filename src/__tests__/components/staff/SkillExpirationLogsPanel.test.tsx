import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import SkillExpirationLogsPanel from '../../../components/staff/components/SkillExpirationLogsPanel';
import StaffSkillExpirationService from '../../../services/StaffSkillExpiration/StaffSkillExpirationService';
import Toaster from '../../../services/Toaster';

jest.mock('../../../services/StaffSkillExpiration/StaffSkillExpirationService');
jest.mock('../../../services/Toaster');

const mockedService = StaffSkillExpirationService as jest.Mocked<typeof StaffSkillExpirationService>;
const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

const buildLog = (id: string, subject: string) => ({
  id,
  status: 'SUCCESS',
  notificationType: 'individual' as const,
  recipient: 'staff@example.com',
  subject,
  staffId: 501,
  staffName: 'Jane Doe',
  skillCodes: ['CPR'],
  staffIds: [],
  createdAt: '2026-06-03T00:22:00.000Z',
  updatedAt: '2026-06-03T00:22:00.000Z',
  error: null,
});

describe('SkillExpirationLogsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads the first page and fetches a new page when pagination is clicked', async () => {
    mockedService.getLogs
      .mockResolvedValueOnce({
        data: [buildLog('1', 'Page 1 subject')],
        total: 40,
        page: 1,
        pageSize: 20,
      })
      .mockResolvedValueOnce({
        data: [buildLog('2', 'Page 2 subject')],
        total: 40,
        page: 2,
        pageSize: 20,
      });

    render(<SkillExpirationLogsPanel />);

    await waitFor(() => {
      expect(mockedService.getLogs).toHaveBeenCalledWith({page: 1, pageSize: 20});
    });
    expect(await screen.findByText('Page 1 subject')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: '2'}));

    await waitFor(() => {
      expect(mockedService.getLogs).toHaveBeenLastCalledWith({page: 2, pageSize: 20});
    });
    expect(await screen.findByText('Page 2 subject')).toBeInTheDocument();
  });

  test('shows api errors from the logs request', async () => {
    const error = new Error('request failed');
    mockedService.getLogs.mockRejectedValueOnce(error);

    render(<SkillExpirationLogsPanel />);

    await waitFor(() => {
      expect(mockedToaster.showApiError).toHaveBeenCalledWith(error);
    });
  });
});
