import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClipboardSyncConfirmPopup from '../../../../pages/Clipboard/components/ClipboardSyncConfirmPopup';
import ClipboardMusicSyncService from '../../../../services/Clipboard/ClipboardMusicSyncService';
import Toaster, { TOAST_TYPE_SUCCESS } from '../../../../services/Toaster';

// Mock the sync service
jest.mock('../../../../services/Clipboard/ClipboardMusicSyncService');

// Mock Toaster
jest.mock('../../../../services/Toaster', () => ({
  showToast: jest.fn(),
  TOAST_TYPE_SUCCESS: 'success',
}));

describe('ClipboardSyncConfirmPopup', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const teamName = 'Year 10 PE A';
  let consoleErrorSpy: jest.SpyInstance;

  const mockSyncResponse = {
    id: 1,
    type: 'MUSIC',
    status: 'NEW' as const,
    createdAt: '2026-06-15T14:00:00Z',
    updatedAt: '2026-06-15T14:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('does not render when show is false', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={false}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Confirm Music Sync')).not.toBeInTheDocument();
  });

  it('renders modal when show is true', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Confirm Music Sync')).toBeInTheDocument();
  });

  it('displays team name in confirmation message', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(new RegExp(teamName))).toBeInTheDocument();
  });

  it('displays confirm and cancel buttons', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows loading state when Confirm button is clicked', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockSyncResponse), 100))
    );

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/syncing/i)).toBeInTheDocument();
    });
  });

  it('disables Cancel button during sync operation', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockSyncResponse), 100))
    );

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  it('calls triggerSync when Confirm button is clicked', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockResolvedValue(mockSyncResponse);

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(ClipboardMusicSyncService.triggerSync).toHaveBeenCalled();
    });
  });

  it('shows success toast after sync completes', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockResolvedValue(mockSyncResponse);

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(Toaster.showToast).toHaveBeenCalledWith(
        expect.stringContaining(teamName),
        expect.any(String)
      );
    });
  });

  it('calls onConfirm callback after successful sync', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockResolvedValue(mockSyncResponse);

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
    });
  });

  it('handles sync API error', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      // Error is handled in the service, so popup should be back to normal state
      expect(screen.getByRole('button', { name: /confirm/i })).not.toBeDisabled();
    });
  });

  it('displays informational message about sync operation', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/synchronize student roster/i)).toBeInTheDocument();
  });

  it('displays warning about operation duration', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/may take a few moments/i)).toBeInTheDocument();
  });

  it('works with PROCESSING status', async () => {
    const processingResponse = { ...mockSyncResponse, status: 'PROCESSING' as const };
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockResolvedValue(processingResponse);

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
    });
  });

  it('handles when onConfirm callback is not provided', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockResolvedValue(mockSyncResponse);

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Should not throw error
    await waitFor(() => {
      expect(ClipboardMusicSyncService.triggerSync).toHaveBeenCalled();
    });
  });

  it('handles when onCancel callback is not provided', () => {
    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Should not throw error
    expect(cancelButton).toBeInTheDocument();
  });

  it('shows proper button text during sync', async () => {
    (ClipboardMusicSyncService.triggerSync as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockSyncResponse), 100))
    );

    render(
      <ClipboardSyncConfirmPopup
        show={true}
        teamName={teamName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/syncing/i)).toBeInTheDocument();
    });
  });

  describe('SynID Display', () => {
    beforeEach(() => {
      delete (window as any).location;
      (window as any).location = { search: '' };
    });

    it('extracts synID from URL query parameter', async () => {
      (window as any).location = { search: '?synId=TEST123' };

      render(
        <ClipboardSyncConfirmPopup
          show={true}
          teamName={teamName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('TEST123')).toBeInTheDocument();
      });
    });

    it('displays Your SynID label when synID exists', async () => {
      (window as any).location = { search: '?synId=USER123' };

      render(
        <ClipboardSyncConfirmPopup
          show={true}
          teamName={teamName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Your SynID:')).toBeInTheDocument();
      });
    });

    it('handles missing synID gracefully', async () => {
      (window as any).location = { search: '' };

      render(
        <ClipboardSyncConfirmPopup
          show={true}
          teamName={teamName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Should render without error but not show synID label
      await waitFor(() => {
        expect(screen.queryByText('Your SynID:')).not.toBeInTheDocument();
      });
    });

    it('displays message mentioning classCode prefix', () => {
      render(
        <ClipboardSyncConfirmPopup
          show={true}
          teamName={teamName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/classCode start with 'X'/i)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(teamName))).toBeInTheDocument();
    });

    it('handles synid in lowercase parameter', async () => {
      (window as any).location = { search: '?synid=LOWER123' };

      render(
        <ClipboardSyncConfirmPopup
          show={true}
          teamName={teamName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('LOWER123')).toBeInTheDocument();
      });
    });

    it('trims whitespace from synID', async () => {
      (window as any).location = { search: '?synId=  SPACED123  ' };

      render(
        <ClipboardSyncConfirmPopup
          show={true}
          teamName={teamName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('SPACED123')).toBeInTheDocument();
      });
    });
  });
});
