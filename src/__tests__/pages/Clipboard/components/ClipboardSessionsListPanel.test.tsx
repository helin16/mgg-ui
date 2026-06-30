import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ClipboardSessionsListPanel from '../../../../pages/Clipboard/components/ClipboardSessionsListPanel';
import ClipboardSessionService from '../../../../services/Clipboard/ClipboardSessionService';
import Toaster, { TOAST_TYPE_ERROR } from '../../../../services/Toaster';
import iClipboardSession from '../../../../types/Clipboard/iClipboardSession';
import iPaginatedResult from '../../../../types/iPaginatedResult';

jest.mock('../../../../services/Clipboard/ClipboardSessionService');
jest.mock('../../../../services/Toaster');
jest.mock('../../../../components/common/Table', () => {
  return function MockTable({ columns, rows }: any) {
    return (
      <table data-testid="mock-table">
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
                col.cell ? col.cell(col, row) : <td key={col.key} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
});

describe('ClipboardSessionsListPanel', () => {
  const mockSessionService = ClipboardSessionService as jest.Mocked<
    typeof ClipboardSessionService
  >;
  const mockToaster = Toaster as jest.Mocked<typeof Toaster>;

  const mockSessions: iClipboardSession[] = [
    {
      id: 1,
      title: 'PE Lesson',
      activity: { id: 1, name: 'Basketball', department: { id: 1, name: 'Sports' } },
      startDateTime: '2026-06-16T09:00:00Z',
      endDateTime: '2026-06-16T10:00:00Z',
      cancelled: false,
      scored: false,
      teams: [{ id: 1, name: 'Year 10 PE' }],
    },
    {
      id: 2,
      title: 'Music Class',
      activity: { id: 2, name: 'Orchestra', department: { id: 2, name: 'Music' } },
      startDateTime: '2026-06-16T10:00:00Z',
      endDateTime: '2026-06-16T11:00:00Z',
      cancelled: false,
      scored: true,
      teams: [{ id: 2, name: 'Year 9 Music' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildPaginatedResult = (
    data: iClipboardSession[],
    currentPage = 1,
    pages = 1,
    total = data.length
  ): iPaginatedResult<iClipboardSession> =>
    ({
      currentPage,
      perPage: 10,
      from: data.length === 0 ? 0 : (currentPage - 1) * 10 + 1,
      to: data.length === 0 ? 0 : (currentPage - 1) * 10 + data.length,
      total,
      data,
      pages,
    } as iPaginatedResult<iClipboardSession>);

  describe('Rendering and Loading', () => {
    it('renders loading spinner while fetching sessions', async () => {
      mockSessionService.getAll.mockImplementation(() => new Promise(() => {}));

      const { container } = render(<ClipboardSessionsListPanel />);

      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('fetches sessions on mount with default parameters', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(mockSessionService.getAll).toHaveBeenCalledWith(
          expect.objectContaining({
            pageLength: 10,
            page: 1,
            includeTeams: true,
            includeStaff: true,
          })
        );
      });
    });

    it('renders sessions table after loading completes', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByTestId('mock-table')).toBeInTheDocument();
      });
    });

    it('displays column headers', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Activity')).toBeInTheDocument();
        expect(screen.getByText('Department')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
      });
    });

    it('displays session data in table rows', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByText('PE Lesson')).toBeInTheDocument();
        expect(screen.getByText('Basketball')).toBeInTheDocument();
        expect(screen.getByText('Sports')).toBeInTheDocument();
      });
    });

    it('displays error message and toast on fetch failure', async () => {
      const errorMsg = 'Failed to load sessions';
      mockSessionService.getAll.mockRejectedValue(new Error(errorMsg));

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByText(errorMsg)).toBeInTheDocument();
        expect(mockToaster.showToast).toHaveBeenCalledWith(
          errorMsg,
          TOAST_TYPE_ERROR
        );
      });
    });

    it('displays empty state when no sessions found', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult([]),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByText(/No sessions available/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('shows pagination controls for multiple pages', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions, 1, 3, 25),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
      });
    });

    it('hides pagination when data fits on single page', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: '>' })).not.toBeInTheDocument();
      });
    });

    it('fetches next page on pagination click', async () => {
      mockSessionService.getAll
        .mockResolvedValueOnce(buildPaginatedResult(mockSessions, 1, 3, 25))
        .mockResolvedValueOnce(buildPaginatedResult(mockSessions, 2, 3, 25));

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: '>' }));

      await waitFor(() => {
        expect(mockSessionService.getAll).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 })
        );
      });
    });

    it('disables first page button on page 1', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions, 1, 3, 25),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: '<<' })).not.toBeInTheDocument();
      });
    });

    it('enables first page button on page > 1', async () => {
      mockSessionService.getAll
        .mockResolvedValueOnce(buildPaginatedResult(mockSessions, 1, 3, 25))
        .mockResolvedValueOnce(buildPaginatedResult(mockSessions, 2, 3, 25));

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: '>' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '<<' })).toBeInTheDocument();
      });
    });
  });

  describe('Team ID Filtering', () => {
    it('includes teamId in fetch when provided', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel teamId={42} />);

      await waitFor(() => {
        expect(mockSessionService.getAll).toHaveBeenCalledWith(
          expect.objectContaining({ teamId: 42 })
        );
      });
    });

    it('excludes teamId when not provided', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(mockSessionService.getAll).toHaveBeenCalledWith(
          expect.not.objectContaining({ teamId: expect.anything() })
        );
      });
    });

    it('refetches sessions when teamId prop changes', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      const { rerender } = render(<ClipboardSessionsListPanel teamId={1} />);

      await waitFor(() => {
        expect(mockSessionService.getAll).toHaveBeenCalledTimes(1);
      });

      rerender(<ClipboardSessionsListPanel teamId={2} />);

      await waitFor(() => {
        expect(mockSessionService.getAll).toHaveBeenCalledTimes(2);
        expect(mockSessionService.getAll).toHaveBeenLastCalledWith(
          expect.objectContaining({ teamId: 2 })
        );
      });
    });
  });

  describe('Status Display', () => {
    it('displays "Cancelled" badge for cancelled sessions', async () => {
      const cancelledSession = { ...mockSessions[0], cancelled: true };
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult([cancelledSession]),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByText('Cancelled')).toBeInTheDocument();
      });
    });

    it('displays "Scored" badge for scored sessions', async () => {
      const scoredSession = { ...mockSessions[0], scored: true };
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult([scoredSession]),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByText('Scored')).toBeInTheDocument();
      });
    });

    it('displays "Pending" badge for pending sessions', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult([mockSessions[0]]),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByText('Pending')).toBeInTheDocument();
      });
    });
  });

  describe('useEffect Dependencies', () => {
    it('refetches when currentPage changes', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions, 1, 3, 25),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: '>' }));

      await waitFor(() => {
        expect(mockSessionService.getAll).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 })
        );
      });
    });
  });

  describe('Generic getColumns Function', () => {
    it('columns are properly typed with generic parameter', async () => {
      mockSessionService.getAll.mockResolvedValue({
        ...buildPaginatedResult(mockSessions),
      });

      render(<ClipboardSessionsListPanel />);

      await waitFor(() => {
        expect(screen.getByTestId('mock-table')).toBeInTheDocument();
      });

      // Verify all expected columns are rendered
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Start Date')).toBeInTheDocument();
      expect(screen.getByText('End Date')).toBeInTheDocument();
      expect(screen.getByText('Teams')).toBeInTheDocument();
    });
  });
});
