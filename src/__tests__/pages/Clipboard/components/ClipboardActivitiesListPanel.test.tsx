import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ClipboardActivitiesListPanel from '../../../../../pages/Clipboard/components/ClipboardActivitiesListPanel';
import AppService from '../../../../services/AppService';
import Toaster from '../../../../services/Toaster';

jest.mock('../../../../services/AppService');
jest.mock('../../../../services/Toaster');
jest.mock('../../../../components/common/Table', () => {
  return function MockTable({ columns, rows }: any) {
    return (
      <div data-testid="mock-table">
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.map((row: any, idx: number) => (
            <tr key={idx}>
              {columns.map((col: any) => (
                <td key={col.key}>{col.cell && col.cell(col, row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </div>
    );
  };
});

describe('ClipboardActivitiesListPanel', () => {
  const mockAppService = AppService as jest.Mocked<typeof AppService>;
  const mockToaster = Toaster as jest.Mocked<typeof Toaster>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    mockAppService.get.mockResolvedValue({
      data: {
        data: [],
        pagination: { currentPage: 1, pageLength: 200, numRecords: 0, lastPage: 1 },
      },
    });

    render(<ClipboardActivitiesListPanel />);

    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
  });

  it('calls AppService.get for departments', async () => {
    mockAppService.get.mockResolvedValue({
      data: { data: [{ id: 1, name: 'Sports' }] },
    });

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/department',
        {},
        undefined
      );
    });
  });

  it('calls AppService.get for activities with pageLength 200', async () => {
    mockAppService.get.mockResolvedValue({
      data: {
        data: [],
        pagination: { currentPage: 1, pageLength: 200, numRecords: 0, lastPage: 1 },
      },
    });

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      const calls = mockAppService.get.mock.calls;
      const activityCall = calls.find((call) => call[0] === '/clipboard/activity');
      expect(activityCall).toBeTruthy();
      expect(activityCall?.[1]).toEqual(
        expect.objectContaining({ pageLength: 200, page: 1 })
      );
    });
  });

  it('renders table columns for activities', async () => {
    mockAppService.get.mockResolvedValue({
      data: {
        data: [],
        pagination: { currentPage: 1, pageLength: 200, numRecords: 0, lastPage: 1 },
      },
    });

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('SIS code')).toBeInTheDocument();
      expect(screen.getByText('Activity Type')).toBeInTheDocument();
      expect(screen.getByText('Payroll Code')).toBeInTheDocument();
      expect(screen.getByText('Archived')).toBeInTheDocument();
    });
  });

  it('renders department dropdown filter', async () => {
    mockAppService.get.mockResolvedValue({
      data: { data: [{ id: 1, name: 'Sports' }] },
    });

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      const selects = screen.queryAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('handles empty activities response', async () => {
    mockAppService.get.mockResolvedValue({
      data: {
        data: [],
        pagination: { currentPage: 1, pageLength: 200, numRecords: 0, lastPage: 1 },
      },
    });

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });
  });

  it('renders activity data when available', async () => {
    mockAppService.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            name: 'Swimming',
            code: 'PAYROLL_SWM',
            smsCode: 'SWM',
            activityType: 'Sport',
            archived: false,
            department: { id: 101, name: 'Sports' },
          },
        ],
        pagination: { currentPage: 1, pageLength: 200, numRecords: 1, lastPage: 1 },
      },
    });

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
      expect(screen.getByText('SWM')).toBeInTheDocument();
      expect(screen.getByText('PAYROLL_SWM')).toBeInTheDocument();
    });
  });
});
