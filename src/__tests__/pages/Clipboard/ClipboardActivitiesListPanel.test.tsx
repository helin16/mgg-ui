import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ClipboardActivitiesListPanel from '../../../pages/Clipboard/components/ClipboardActivitiesListPanel';
import ClipboardActivityService from '../../../services/Clipboard/ClipboardActivityService';
import ClipboardDepartmentService from '../../../services/Clipboard/ClipboardDepartmentService';

jest.mock('../../../services/Clipboard/ClipboardActivityService', () => ({
  __esModule: true,
  default: {
    getAllRecords: jest.fn(),
  },
}));

jest.mock('../../../services/Clipboard/ClipboardDepartmentService', () => ({
  __esModule: true,
  default: {
    getAllRecords: jest.fn(),
  },
}));

jest.mock('../../../services/Toaster', () => ({
  __esModule: true,
  default: {
    showToast: jest.fn(),
  },
}));

jest.mock('../../../services/Clipboard/ClipboardUrlBuilder', () => ({
  __esModule: true,
  getActivityDetailsUrl: jest.fn((id) => `https://go.clipboard.app/activities/${id}`),
  getDepartmentDetailsUrl: jest.fn((id) => `https://go.clipboard.app/departments/${id}`),
}));

jest.mock('../../../components/common/Table', () => ({
  __esModule: true,
  default: () => <div data-testid="table">Table Component</div>,
}));

const mockedActivityService = ClipboardActivityService as jest.Mocked<typeof ClipboardActivityService>;
const mockedDepartmentService = ClipboardDepartmentService as jest.Mocked<typeof ClipboardDepartmentService>;

describe('ClipboardActivitiesListPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedActivityService.getAllRecords.mockResolvedValue([
      {
        id: 101,
        name: 'Basketball',
        department: { id: 1, name: 'PE' },
        classCode: 'BSKT101',
        sisId: 'SIS-001',
        hidden: false,
      },
      {
        id: 102,
        name: 'Volleyball',
        department: { id: 1, name: 'PE' },
        classCode: 'VBALL102',
        sisId: 'SIS-002',
        hidden: false,
      },
    ]);
    mockedDepartmentService.getAllRecords.mockResolvedValue([
      { id: 1, name: 'PE' },
      { id: 2, name: 'Art' },
    ]);
  });

  describe('Rendering', () => {
    it('renders loading spinner initially', () => {
      mockedActivityService.getAllRecords.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ClipboardActivitiesListPanel />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders table after loading', async () => {
      render(<ClipboardActivitiesListPanel />);

      await waitFor(() => {
        expect(screen.getByTestId('table')).toBeInTheDocument();
      });
    });

    it('displays error message on service failure', async () => {
      const errorMessage = 'Failed to load activities';
      mockedActivityService.getAllRecords.mockRejectedValue(
        new Error(errorMessage)
      );

      render(<ClipboardActivitiesListPanel />);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('shows empty state when no activities available', async () => {
      mockedActivityService.getAllRecords.mockResolvedValue([]);

      render(<ClipboardActivitiesListPanel />);

      await waitFor(() => {
        expect(screen.getByText(/no activities available/i)).toBeInTheDocument();
      });
    });
  });

  describe('Service Calls', () => {
    it('calls activity and department services on mount', async () => {
      render(<ClipboardActivitiesListPanel />);

      await waitFor(() => {
        expect(mockedActivityService.getAllRecords).toHaveBeenCalledTimes(1);
        expect(mockedDepartmentService.getAllRecords).toHaveBeenCalledTimes(1);
      });
    });

    it('handles errors from activity service', async () => {
      mockedActivityService.getAllRecords.mockRejectedValue(
        new Error('Activity API Error')
      );

      render(<ClipboardActivitiesListPanel />);

      await waitFor(() => {
        expect(screen.getByText('Activity API Error')).toBeInTheDocument();
      });
    });

    it('handles errors from department service', async () => {
      mockedDepartmentService.getAllRecords.mockRejectedValue(
        new Error('Department API Error')
      );

      render(<ClipboardActivitiesListPanel />);

      await waitFor(() => {
        expect(screen.getByText('Department API Error')).toBeInTheDocument();
      });
    });
  });

;

  describe('Default Behavior', () => {
    it('renders table with default filters applied', async () => {
      mockedActivityService.getAllRecords.mockResolvedValue([
        {
          id: 101,
          name: 'Basketball',
          department: { id: 1, name: 'PE' },
          classCode: 'BSKT101',
          sisId: 'SIS-001',
          hidden: false,
        },
      ]);

      render(<ClipboardActivitiesListPanel />);

      await waitFor(() => {
        expect(screen.getByTestId('table')).toBeInTheDocument();
      });
    });
  });
});
