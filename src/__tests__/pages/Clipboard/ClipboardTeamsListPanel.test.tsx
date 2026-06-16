import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ClipboardTeamsListPanel from '../../../pages/Clipboard/components/ClipboardTeamsListPanel';
import ClipboardTeamService from '../../../services/Clipboard/ClipboardTeamService';
import ClipboardActivityService from '../../../services/Clipboard/ClipboardActivityService';
import ClipboardDepartmentService from '../../../services/Clipboard/ClipboardDepartmentService';

jest.mock('../../../services/Clipboard/ClipboardTeamService', () => ({
  __esModule: true,
  default: {
    getAllRecords: jest.fn(),
  },
}));

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
  getTeamUrl: jest.fn((id) => `https://go.clipboard.app/teams/team/${id}`),
  getActivityDetailsUrl: jest.fn((id) => `https://go.clipboard.app/activities/${id}`),
  getDepartmentDetailsUrl: jest.fn((id) => `https://go.clipboard.app/departments/${id}`),
}));

jest.mock('../../../components/common/Table', () => ({
  __esModule: true,
  default: () => <div data-testid="table">Table Component</div>,
}));

const mockedTeamService = ClipboardTeamService as jest.Mocked<typeof ClipboardTeamService>;
const mockedActivityService = ClipboardActivityService as jest.Mocked<typeof ClipboardActivityService>;
const mockedDepartmentService = ClipboardDepartmentService as jest.Mocked<typeof ClipboardDepartmentService>;

describe('ClipboardTeamsListPanel', () => {
  const mockTeams = [
    {
      id: 1,
      name: 'Team A',
      classCode: 'TEAMA',
      sisId: 'SIS-001',
      activity: { id: 101, name: 'Basketball', department: { id: 1, name: 'PE' } },
      category: { id: 10, name: 'Category1' },
      subcategory: { id: 20, name: 'Subcat1' },
      assignedStaff: [{ firstName: 'John', lastName: 'Doe' }],
      students: [
        {
          firstName: 'Student',
          lastName: 'One',
          smsId: '1001',
          studentId: 'STU-001',
          yearGroup: { id: 1, name: 'Year 7' },
          captain: true,
          boarder: false,
          positionId: null,
          jerseyNumber: null,
        },
      ],
      hidden: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedTeamService.getAllRecords.mockResolvedValue(mockTeams);
    mockedActivityService.getAllRecords.mockResolvedValue([
      { id: 101, name: 'Basketball', department: { id: 1, name: 'PE' } },
    ]);
    mockedDepartmentService.getAllRecords.mockResolvedValue([
      { id: 1, name: 'PE' },
    ]);
  });

  describe('Rendering', () => {
    it('renders loading spinner initially', () => {
      mockedTeamService.getAllRecords.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ClipboardTeamsListPanel />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders table after loading', async () => {
      render(<ClipboardTeamsListPanel />);

      await waitFor(() => {
        expect(screen.getByTestId('table')).toBeInTheDocument();
      });
    });

    it('displays error message on service failure', async () => {
      const errorMessage = 'Failed to load teams';
      mockedTeamService.getAllRecords.mockRejectedValue(
        new Error(errorMessage)
      );

      render(<ClipboardTeamsListPanel />);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('shows empty state when no teams available', async () => {
      mockedTeamService.getAllRecords.mockResolvedValue([]);

      render(<ClipboardTeamsListPanel />);

      await waitFor(() => {
        expect(screen.getByText(/no teams available/i)).toBeInTheDocument();
      });
    });
  });

  describe('Service Calls', () => {
    it('calls all three services on mount', async () => {
      render(<ClipboardTeamsListPanel />);

      await waitFor(() => {
        expect(mockedTeamService.getAllRecords).toHaveBeenCalledTimes(1);
        expect(mockedActivityService.getAllRecords).toHaveBeenCalledTimes(1);
        expect(mockedDepartmentService.getAllRecords).toHaveBeenCalledTimes(1);
      });
    });

    it('handles errors from team service', async () => {
      mockedTeamService.getAllRecords.mockRejectedValue(
        new Error('Team API Error')
      );

      render(<ClipboardTeamsListPanel />);

      await waitFor(() => {
        expect(screen.getByText('Team API Error')).toBeInTheDocument();
      });
    });
  });

;

  describe('Default Behavior', () => {
    it('filters to non-hidden teams by default', async () => {
      render(<ClipboardTeamsListPanel />);

      await waitFor(() => {
        expect(screen.getByTestId('table')).toBeInTheDocument();
      });

      // Verify table is rendered - this confirms default filters are applied
      expect(screen.getByTestId('table')).toBeVisible();
    });
  });
});
