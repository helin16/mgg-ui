import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClipboardSessionDetailsPanel from '../../../../pages/Clipboard/components/ClipboardSessionDetailsPanel';
import ClipboardSessionService from '../../../../services/Clipboard/ClipboardSessionService';
import iClipboardSession from '../../../../types/Clipboard/iClipboardSession';

// Mock the session service
jest.mock('../../../../services/Clipboard/ClipboardSessionService');

// Mock moment
jest.mock('moment-timezone', () => {
  return {
    __esModule: true,
    default: (date: string) => ({
      tz: () => ({
        format: (fmt: string) => '01/06/2026 14:30',
      }),
    }),
  };
});

describe('ClipboardSessionDetailsPanel', () => {
  const mockSession: iClipboardSession = {
    id: 1,
    title: 'Team Practice - Monday Evening',
    startDateTime: '2026-06-15T14:00:00Z',
    endDateTime: '2026-06-15T15:30:00Z',
    activity: {
      id: 10,
      name: 'Music',
      department: {
        id: 5,
        name: 'Performing Arts',
      },
    },
    teams: [{ id: 1 }],
    assignedStaff: [
      { id: 100, name: 'John Smith', firstName: 'John' },
      { id: 101, name: 'Jane Doe', firstName: 'Jane' },
    ],
    cancelled: false,
    scored: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    (ClipboardSessionService.get as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockSession), 100))
    );

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    expect(screen.getByText(/loading session details/i)).toBeInTheDocument();
  });

  it('displays session details after loading', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Team Practice - Monday Evening')).toBeInTheDocument();
    });
  });

  it('fetches session for the correct team ID', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={42} />);

    await waitFor(() => {
      expect(ClipboardSessionService.get).toHaveBeenCalledWith(42);
    });
  });

  it('displays session title correctly', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Team Practice - Monday Evening')).toBeInTheDocument();
    });
  });

  it('displays activity name correctly', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Music')).toBeInTheDocument();
    });
  });

  it('displays department name correctly', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Performing Arts')).toBeInTheDocument();
    });
  });

  it('displays formatted start and end times', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      // Should display formatted times
      expect(screen.getAllByText('01/06/2026 14:30').length).toBeGreaterThan(0);
    });
  });

  it('displays assigned staff names', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/John Smith.*Jane Doe|Jane Doe.*John Smith/)).toBeInTheDocument();
    });
  });

  it('displays active status badge when not cancelled', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  it('displays cancelled status badge when cancelled', async () => {
    const cancelledSession = { ...mockSession, cancelled: true };
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(cancelledSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });
  });

  it('handles missing null fields with N/A', async () => {
    const sessionWithNulls: iClipboardSession = {
      ...mockSession,
      activity: undefined as any,
      assignedStaff: undefined as any,
    };
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(sessionWithNulls);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      // Should display N/A for missing fields
      expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
    });
  });

  it('displays error message when fetch fails', async () => {
    const errorMessage = 'Failed to load session';
    (ClipboardSessionService.get as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/No session details available/i)).toBeInTheDocument();
    });
  });

  it('displays error from API response', async () => {
    (ClipboardSessionService.get as jest.Mock).mockRejectedValue({
      response: {
        data: {
          message: 'Session not found',
        },
      },
    });

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Session not found/)).toBeInTheDocument();
    });
  });

  it('handles invalid date formats gracefully', async () => {
    const sessionWithBadDates = { 
      ...mockSession, 
      startDateTime: 'invalid-date',
      endDateTime: 'also-invalid' 
    };
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(sessionWithBadDates);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Team Practice - Monday Evening')).toBeInTheDocument();
    });
  });

  it('displays session details in proper layout', async () => {
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(mockSession);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      // Should have proper section labels
      expect(screen.getByText('Session Title')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Start Time')).toBeInTheDocument();
      expect(screen.getByText('End Time')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Assigned Staff')).toBeInTheDocument();
    });
  });

  it('handles empty staff list', async () => {
    const sessionWithoutStaff = { 
      ...mockSession, 
      assignedStaff: [] 
    };
    (ClipboardSessionService.get as jest.Mock).mockResolvedValue(sessionWithoutStaff);

    render(<ClipboardSessionDetailsPanel teamId={1} />);

    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });
});
