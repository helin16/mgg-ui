import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClipboardTeamsListPanel from '../../../../pages/Clipboard/components/ClipboardTeamsListPanel';
import ClipboardTeamService from '../../../../services/Clipboard/ClipboardTeamService';
import ClipboardDepartmentService from '../../../../services/Clipboard/ClipboardDepartmentService';
import ClipboardActivityService from '../../../../services/Clipboard/ClipboardActivityService';
import Toaster from '../../../../services/Toaster';

jest.mock('../../../../services/Clipboard/ClipboardTeamService');
jest.mock('../../../../services/Clipboard/ClipboardDepartmentService');
jest.mock('../../../../services/Clipboard/ClipboardActivityService');
jest.mock('../../../../services/Toaster');

describe('ClipboardTeamsListPanel', () => {
  const mockTeamService = ClipboardTeamService as jest.Mocked<typeof ClipboardTeamService>;
  const mockDepartmentService = ClipboardDepartmentService as jest.Mocked<typeof ClipboardDepartmentService>;
  const mockActivityService = ClipboardActivityService as jest.Mocked<typeof ClipboardActivityService>;
  const mockToaster = Toaster as jest.Mocked<typeof Toaster>;

  const mockDepartments = [
    { id: 1, name: 'Sports' },
    { id: 2, name: 'Music' },
  ];

  const mockActivities = [
    { id: 10, name: 'Basketball', department: { id: 1, name: 'Sports' } },
    { id: 20, name: 'Orchestra', department: { id: 2, name: 'Music' } },
  ];

  const mockTeams = [
    {
      id: 1,
      name: 'Year 10 PE A',
      classCode: 'PE10A',
      sisId: 'PE10A',
      hidden: false,
      activity: { id: 10, name: 'Basketball', department: { id: 1, name: 'Sports' } },
      assignedStaff: [{ firstName: 'Alex', lastName: 'Coach' }],
      students: [{ firstName: 'Jane', lastName: 'Doe', smsId: '54610', yearGroup: { name: 'Year 10' }, captain: true }],
    },
    {
      id: 2,
      name: 'Year 11 Music',
      classCode: 'MUS11',
      sisId: 'MUS11',
      hidden: false,
      activity: { id: 20, name: 'Orchestra', department: { id: 2, name: 'Music' } },
      assignedStaff: [],
      students: [],
    },
    {
      id: 3,
      name: null,
      classCode: 'SCI12',
      sisId: 'SCI12',
      hidden: true,
      activity: { id: 10, name: 'Basketball', department: { id: 1, name: 'Sports' } },
      assignedStaff: [],
      students: [],
    },
  ] as any[];

  beforeEach(() => {
    jest.clearAllMocks();
    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments as any);
    mockActivityService.getAllRecords.mockResolvedValue(mockActivities as any);
    mockTeamService.getAllRecords.mockResolvedValue(mockTeams as any);
  });

  it('renders loading spinner initially', () => {
    mockDepartmentService.getAllRecords.mockImplementation(() => new Promise(() => {}));
    mockActivityService.getAllRecords.mockImplementation(() => new Promise(() => {}));
    mockTeamService.getAllRecords.mockImplementation(() => new Promise(() => {}));

    render(<ClipboardTeamsListPanel />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders team rows after loading', async () => {
    render(<ClipboardTeamsListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Year 10 PE A')).toBeInTheDocument();
      expect(screen.getByText('Year 11 Music')).toBeInTheDocument();
    });

    expect(screen.queryByRole('link', { name: 'SCI12' })).not.toBeInTheDocument();
  });

  it('falls back to classCode when name is missing', async () => {
    render(<ClipboardTeamsListPanel />);

    const hiddenSelect = await screen.findByDisplayValue('Non-Hidden Only');
    fireEvent.change(hiddenSelect, { target: { value: 'all' } });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'SCI12' })).toBeInTheDocument();
    });
  });

  it('shows empty-state alert when no teams are returned', async () => {
    mockTeamService.getAllRecords.mockResolvedValue([]);

    render(<ClipboardTeamsListPanel />);

    await waitFor(() => {
      expect(screen.getByText('No teams available.')).toBeInTheDocument();
    });
  });

  it('shows filter-empty alert when no teams match the filters', async () => {
    render(<ClipboardTeamsListPanel />);

    const departmentSelect = await screen.findByDisplayValue('All Departments');
    const sisIdSelect = await screen.findByDisplayValue('All SIS IDs');
    fireEvent.change(departmentSelect, { target: { value: '2' } });
    fireEvent.change(sisIdSelect, { target: { value: 'PE10A' } });

    await waitFor(() => {
      expect(screen.getByText('No teams match your filters. Try adjusting your search criteria.')).toBeInTheDocument();
    });
  });

  it('filters teams by department', async () => {
    render(<ClipboardTeamsListPanel />);

    const departmentSelect = await screen.findByDisplayValue('All Departments');
    fireEvent.change(departmentSelect, { target: { value: '2' } });

    await waitFor(() => {
      expect(screen.getByText('Year 11 Music')).toBeInTheDocument();
      expect(screen.queryByText('Year 10 PE A')).not.toBeInTheDocument();
    });
  });

  it('opens the students modal from the students-count button', async () => {
    render(<ClipboardTeamsListPanel />);

    const studentsButton = await screen.findByRole('button', { name: '1' });
    fireEvent.click(studentsButton);

    await waitFor(() => {
      expect(screen.getByText('Students in Year 10 PE A')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('54610')).toBeInTheDocument();
    });
  });

  it('shows an error alert when loading fails', async () => {
    mockTeamService.getAllRecords.mockRejectedValue(new Error('Failed to load teams'));

    render(<ClipboardTeamsListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load teams')).toBeInTheDocument();
      expect(mockToaster.showToast).toHaveBeenCalled();
    });
  });
});
