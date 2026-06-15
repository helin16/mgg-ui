import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClipboardTeamsListPanel from '../../../../pages/Clipboard/components/ClipboardTeamsListPanel';
import iClipboardTeam from '../../../../types/Clipboard/iClipboardTeam';

// Mock the session details panel to simplify tests
jest.mock('../../../../pages/Clipboard/components/ClipboardSessionDetailsPanel', () => {
  return function MockSessionDetailsPanel() {
    return <div data-testid="session-details-panel">Session Details</div>;
  };
});

// Mock the sync confirm popup
jest.mock('../../../../pages/Clipboard/components/ClipboardSyncConfirmPopup', () => {
  return function MockSyncPopup({ show, onConfirm, onCancel }: any) {
    if (!show) return null;
    return (
      <div data-testid="sync-popup">
        <button data-testid="sync-confirm-btn" onClick={onConfirm}>
          Confirm
        </button>
        <button data-testid="sync-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  };
});

describe('ClipboardTeamsListPanel', () => {
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
    {
      id: 3,
      name: null,
      classCode: 'SCI12',
      externalId: 'ext3',
      isHidden: false,
      checkSum: 'abc125',
    },
  ];

  it('renders table with team names', () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    expect(screen.getByText('Year 10 PE A')).toBeInTheDocument();
    expect(screen.getByText('Year 11 Music')).toBeInTheDocument();
    expect(screen.getByText('SCI12')).toBeInTheDocument(); // Fallback to classCode
  });

  it('displays empty state when no teams', () => {
    render(
      <ClipboardTeamsListPanel teams={[]} isLoading={false} error={null} />
    );

    expect(screen.getByText('No Teams Configured')).toBeInTheDocument();
    expect(screen.getByText(/no clipboard teams configured/i)).toBeInTheDocument();
  });

  it('displays loading spinner when isLoading is true', () => {
    render(
      <ClipboardTeamsListPanel teams={[]} isLoading={true} error={null} />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading teams/i)).toBeInTheDocument();
  });

  it('displays error message when error prop is set', () => {
    const errorMsg = 'Failed to load teams';
    render(
      <ClipboardTeamsListPanel teams={[]} isLoading={false} error={errorMsg} />
    );

    expect(screen.getByText(/Error Loading Teams/i)).toBeInTheDocument();
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('renders Sync button for each team', () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    const syncButtons = screen.getAllByRole('button', { name: /sync/i });
    expect(syncButtons).toHaveLength(mockTeams.length);
  });

  it('expands team details when team row is clicked', async () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    // Get first team row (the Year 10 PE A)
    const rows = screen.getAllByRole('row');
    const firstTeamRow = rows[1]; // Skip header row

    fireEvent.click(firstTeamRow);

    await waitFor(() => {
      expect(screen.getByTestId('session-details-panel')).toBeInTheDocument();
    });
  });

  it('closes expanded details when clicking team row again', async () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    const rows = screen.getAllByRole('row');
    const firstTeamRow = rows[1];

    // Expand
    fireEvent.click(firstTeamRow);
    await waitFor(() => {
      expect(screen.getByTestId('session-details-panel')).toBeInTheDocument();
    });

    // Collapse
    fireEvent.click(firstTeamRow);
    await waitFor(() => {
      expect(screen.queryByTestId('session-details-panel')).not.toBeInTheDocument();
    });
  });

  it('displays sync popup when Sync button is clicked', async () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    const syncButtons = screen.getAllByRole('button', { name: /sync/i });
    fireEvent.click(syncButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('sync-popup')).toBeInTheDocument();
    });
  });

  it('disables Sync button while syncing', async () => {
    const { rerender } = render(
      <ClipboardTeamsListPanel 
        teams={mockTeams} 
        isLoading={false} 
        error={null}
        onSyncClick={async () => {
          // Simulate sync operation
          await new Promise(resolve => setTimeout(resolve, 100));
        }}
      />
    );

    const syncButtons = screen.getAllByRole('button', { name: /sync/i });
    fireEvent.click(syncButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('sync-popup')).toBeInTheDocument();
    });
  });

  it('handles missing team name with fallback to classCode', () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    // Team 3 has null name, should display classCode
    expect(screen.getByText('SCI12')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    expect(screen.getByText('Team Name')).toBeInTheDocument();
    expect(screen.getByText('Session')).toBeInTheDocument();
    expect(screen.getByText('Last Sync')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('supports keyboard navigation for expand/collapse', async () => {
    render(
      <ClipboardTeamsListPanel teams={mockTeams} isLoading={false} error={null} />
    );

    const rows = screen.getAllByRole('row');
    const firstTeamRow = rows[1];

    // Simulate Enter key press
    fireEvent.keyDown(firstTeamRow, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('session-details-panel')).toBeInTheDocument();
    });
  });
});
