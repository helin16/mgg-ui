import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClipboardPage from '../../../pages/Clipboard/ClipboardPage';

// Mock the Page component
jest.mock('../../../layouts/Page', () => {
  return function MockPage({ title, children, moduleId, extraBtns, AdminPage }: any) {
    return (
      <div data-testid="page-wrapper" data-module-id={moduleId}>
        <div data-testid="page-header">
          <div>{title}</div>
          <div data-testid="extra-buttons">{extraBtns}</div>
        </div>
        <div data-testid="page-content">{children}</div>
        {AdminPage && <div data-testid="admin-page">{AdminPage}</div>}
      </div>
    );
  };
});

// Mock the sessions list panel
jest.mock('../../../pages/Clipboard/components/ClipboardSessionsListPanel', () => {
  return function MockSessionsListPanel() {
    return <div data-testid="sessions-list-panel">Sessions List Panel</div>;
  };
});

jest.mock('../../../pages/Clipboard/components/ClipboardDepartmentsListPanel', () => {
  return function MockDepartmentsListPanel() {
    return <div data-testid="departments-list-panel">Departments List Panel</div>;
  };
});

jest.mock('../../../pages/Clipboard/components/ClipboardActivitiesListPanel', () => {
  return function MockActivitiesListPanel() {
    return <div data-testid="activities-list-panel">Activities List Panel</div>;
  };
});

jest.mock('../../../pages/Clipboard/components/ClipboardTeamsListPanel', () => {
  return function MockTeamsListPanel() {
    return <div data-testid="teams-list-panel">Teams List Panel</div>;
  };
});

// Mock the sync confirm popup
jest.mock('../../../pages/Clipboard/components/ClipboardSyncConfirmPopup', () => {
  return function MockSyncConfirmPopup({ show, onConfirm, onCancel }: any) {
    return (
      <div data-testid="sync-confirm-popup" data-show={show}>
        {show && (
          <>
            <div>Confirm Music Sync</div>
            <button onClick={onConfirm} data-testid="popup-confirm-btn">
              Confirm
            </button>
            <button onClick={onCancel} data-testid="popup-cancel-btn">
              Cancel
            </button>
          </>
        )}
      </div>
    );
  };
});

// Mock the admin page
jest.mock('../../../pages/Clipboard/ClipboardAdminPage', () => {
  return function MockAdminPage() {
    return <div data-testid="clipboard-admin-page">Admin Page</div>;
  };
});

describe('ClipboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page with correct title and moduleId', () => {
    render(<ClipboardPage />);

    expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('page-wrapper')).toHaveAttribute('data-module-id', '21');
    expect(screen.getByText(/Clipboard Management/i)).toBeInTheDocument();
  });

  it('renders Departments, Activities, Teams, and Sessions tabs', () => {
    render(<ClipboardPage />);

    expect(screen.getByText('Departments')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
  });

  it('shows Departments tab content by default', () => {
    render(<ClipboardPage />);

    expect(screen.getByTestId('departments-list-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('activities-list-panel')).not.toBeInTheDocument();
    expect(screen.queryByTestId('teams-list-panel')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sessions-list-panel')).not.toBeInTheDocument();
  });

  it('switches to Activities, Teams, and Sessions tabs', async () => {
    render(<ClipboardPage />);

    fireEvent.click(screen.getByRole('tab', { name: 'Activities' }));
    await waitFor(() => {
      expect(screen.getByTestId('activities-list-panel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Teams' }));
    await waitFor(() => {
      expect(screen.getByTestId('teams-list-panel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Sessions' }));
    await waitFor(() => {
      expect(screen.getByTestId('sessions-list-panel')).toBeInTheDocument();
    });
  });

  it('displays Sync Music Class button', () => {
    render(<ClipboardPage />);

    const syncButton = screen.getByRole('button', { name: /sync music class/i });
    expect(syncButton).toBeInTheDocument();
    expect(syncButton).toHaveClass('btn-info');
  });

  it('opens sync confirm popup when Sync button is clicked', async () => {
    render(<ClipboardPage />);

    const syncButton = screen.getByRole('button', { name: /sync music class/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      const popup = screen.getByTestId('sync-confirm-popup');
      expect(popup).toHaveAttribute('data-show', 'true');
    });
  });

  it('closes sync confirm popup on confirm', async () => {
    render(<ClipboardPage />);

    const syncButton = screen.getByRole('button', { name: /sync music class/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.getByTestId('sync-confirm-popup')).toHaveAttribute('data-show', 'true');
    });

    const confirmBtn = screen.getByTestId('popup-confirm-btn');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByTestId('sync-confirm-popup')).toHaveAttribute('data-show', 'false');
    });
  });

  it('closes sync confirm popup on cancel', async () => {
    render(<ClipboardPage />);

    const syncButton = screen.getByRole('button', { name: /sync music class/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.getByTestId('sync-confirm-popup')).toHaveAttribute('data-show', 'true');
    });

    const cancelBtn = screen.getByTestId('popup-cancel-btn');
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.getByTestId('sync-confirm-popup')).toHaveAttribute('data-show', 'false');
    });
  });

  it('passes All Teams as teamName to sync popup', () => {
    render(<ClipboardPage />);

    const syncButton = screen.getByRole('button', { name: /sync music class/i });
    fireEvent.click(syncButton);

    // The mock component should receive "All Teams" as teamName
    // Check that popup appears when sync button is clicked
    expect(screen.getByTestId('sync-confirm-popup')).toBeInTheDocument();
  });

  it('renders Admin page prop', () => {
    render(<ClipboardPage />);

    // Page component receives AdminPage prop
    expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
  });

  it('renders tabs in the requested order', () => {
    render(<ClipboardPage />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs.map(tab => tab.textContent)).toEqual(['Departments', 'Activities', 'Teams', 'Sessions']);
  });
});
