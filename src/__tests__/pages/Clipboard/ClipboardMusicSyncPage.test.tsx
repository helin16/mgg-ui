import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClipboardMusicSyncPage from '../../../../pages/Clipboard/ClipboardMusicSyncPage';
import ClipboardTeamService from '../../../../services/Clipboard/ClipboardTeamService';
import iClipboardTeam from '../../../../types/Clipboard/iClipboardTeam';

// Mock the Page component
jest.mock('../../../../layouts/Page', () => {
  return function MockPage({ title, children, moduleId }: any) {
    return (
      <div data-testid="page-wrapper" data-module-id={moduleId}>
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

// Mock the teams list panel
jest.mock('../../../../pages/Clipboard/components/ClipboardTeamsListPanel', () => {
  return function MockTeamsListPanel({ teams, isLoading, error }: any) {
    return (
      <div data-testid="teams-list-panel">
        {isLoading && <div>Loading teams...</div>}
        {error && <div>Error: {error}</div>}
        {teams && <div>Teams count: {teams.length}</div>}
      </div>
    );
  };
});

// Mock the team service
jest.mock('../../../../services/Clipboard/ClipboardTeamService');

// Mock PageLoadingSpinner
jest.mock('../../../../components/PageLoadingSpinner', () => {
  return function MockPageLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock Toaster
jest.mock('../../../../components/notifications/Toaster', () => ({
  error: jest.fn(),
}));

describe('ClipboardMusicSyncPage', () => {
  const mockTeams: iClipboardTeam[] = [
    {
      id: 1,
      name: 'Year 10 PE A',
      classCode: 'PE10A',
      externalId: 'ext1',
      isHidden: false,
      checkSum: 'abc123',
    },
    {
      id: 2,
      name: 'Year 11 Music',
      classCode: 'MUS11',
      externalId: 'ext2',
      isHidden: false,
      checkSum: 'abc124',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page with correct title and moduleId', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('page-wrapper')).toHaveAttribute('data-module-id', '21');
    });

    expect(screen.getByText(/Clipboard Management/i)).toBeInTheDocument();
  });

  it('fetches teams on component mount', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(ClipboardTeamService.getAll).toHaveBeenCalledWith({ perPage: 100 });
    });
  });

  it('displays loading spinner initially', () => {
    (ClipboardTeamService.getAll as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: mockTeams }), 100))
    );

    render(<ClipboardMusicSyncPage />);

    // Initially should show loading spinner
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays teams list after loading completes', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByTestId('teams-list-panel')).toBeInTheDocument();
      expect(screen.getByText('Teams count: 2')).toBeInTheDocument();
    });
  });

  it('handles pagination response format', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
      total: 2,
      perPage: 100,
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByText('Teams count: 2')).toBeInTheDocument();
    });
  });

  it('handles direct array response format', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue(mockTeams);

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByText('Teams count: 2')).toBeInTheDocument();
    });
  });

  it('displays error state when fetch fails', async () => {
    const errorMessage = 'Failed to load teams';
    (ClipboardTeamService.getAll as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage))).toBeInTheDocument();
    });
  });

  it('displays error alert with retry button when fetch fails', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('renders Music Sync tab as active tab', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByText('Music Sync')).toBeInTheDocument();
    });
  });

  it('renders placeholder tabs for future features', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      const logsTabs = screen.getAllByText('Logs');
      const settingsTabs = screen.getAllByText('Settings');
      expect(logsTabs.length).toBeGreaterThan(0);
      expect(settingsTabs.length).toBeGreaterThan(0);
    });
  });

  it('passes teams and loading state to ClipboardTeamsListPanel', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByTestId('teams-list-panel')).toBeInTheDocument();
      expect(screen.getByText('Teams count: 2')).toBeInTheDocument();
    });
  });

  it('handles empty teams array', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: [],
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByText('Teams count: 0')).toBeInTheDocument();
    });
  });

  it('shows detailed error response message from API', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockRejectedValue({
      response: {
        data: {
          message: 'Unauthorized: Missing valid authentication',
        },
      },
    });

    render(<ClipboardMusicSyncPage />);

    await waitFor(() => {
      expect(screen.getByText(/Unauthorized: Missing valid authentication/)).toBeInTheDocument();
    });
  });

  it('clears loading state after successful fetch', async () => {
    (ClipboardTeamService.getAll as jest.Mock).mockResolvedValue({
      data: mockTeams,
    });

    const { rerender } = render(<ClipboardMusicSyncPage />);

    // Initially loading
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // After fetch completes
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('teams-list-panel')).toBeInTheDocument();
    });
  });
});
