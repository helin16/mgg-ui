import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClipboardSyncConfirmPopup from '../../../../pages/Clipboard/components/ClipboardSyncConfirmPopup';
import ClipboardMusicSyncService from '../../../../services/Clipboard/ClipboardMusicSyncService';
import Toaster from '../../../../components/notifications/Toaster';

// Mock the sync service
jest.mock('../../../../services/Clipboard/ClipboardMusicSyncService');

// Mock Toaster
jest.mock('../../../../components/notifications/Toaster', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('ClipboardSyncConfirmPopup', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const teamName = 'Year 10 PE A';

  const mockSyncResponse = {
    id: 1,
    type: 'MUSIC',
    status: 'NEW' as const,
    createdAt: '2026-06-15T14:00:00Z',
    updatedAt: '2026-06-15T14:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(Toaster.success).toHaveBeenCalledWith(
        expect.stringContaining(teamName)
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
});
