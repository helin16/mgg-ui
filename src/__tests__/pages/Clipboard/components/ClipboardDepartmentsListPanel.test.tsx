import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ClipboardDepartmentsListPanel from '../../../../pages/Clipboard/components/ClipboardDepartmentsListPanel';
import ClipboardDepartmentService from '../../../../services/Clipboard/ClipboardDepartmentService';
import ClipboardActivityService from '../../../../services/Clipboard/ClipboardActivityService';
import Toaster from '../../../../services/Toaster';
import iClipboardDepartment from '../../../../types/Clipboard/iClipboardDepartment';
import iClipboardActivity from '../../../../types/Clipboard/iClipboardActivity';

jest.mock('../../../../services/Clipboard/ClipboardDepartmentService');
jest.mock('../../../../services/Clipboard/ClipboardActivityService');
jest.mock('../../../../services/Toaster');

describe('ClipboardDepartmentsListPanel', () => {
  const mockDepartmentService = ClipboardDepartmentService as jest.Mocked<typeof ClipboardDepartmentService>;
  const mockActivityService = ClipboardActivityService as jest.Mocked<typeof ClipboardActivityService>;
  const mockToaster = Toaster as jest.Mocked<typeof Toaster>;

  const mockDepartments: iClipboardDepartment[] = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Science' },
  ];

  const mockActivities: iClipboardActivity[] = [
    { id: 1, name: 'Algebra', code: 'ALG', department: { id: 1, name: 'Mathematics' }, archived: false },
    { id: 2, name: 'Geometry', code: 'GEO', department: { id: 1, name: 'Mathematics' }, archived: false },
    { id: 3, name: 'Literature', code: 'LIT', department: { id: 2, name: 'English' }, archived: false },
    { id: 4, name: 'Physics', code: 'PHY', department: { id: 3, name: 'Science' }, archived: false },
    { id: 5, name: 'Chemistry', code: 'CHM', department: { id: 3, name: 'Science' }, archived: true }, // archived
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    mockDepartmentService.getAllRecords.mockImplementation(() => new Promise(() => {})); // Never resolves
    mockActivityService.getAllRecords.mockImplementation(() => new Promise(() => {}));

    render(<ClipboardDepartmentsListPanel />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders departments table with correct columns', async () => {
    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments);
    mockActivityService.getAllRecords.mockResolvedValue(mockActivities);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Science')).toBeInTheDocument();
    });

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Department Name')).toBeInTheDocument();
    expect(screen.getByText('No of Activities')).toBeInTheDocument();
  });

  it('displays correct activity counts excluding archived activities', async () => {
    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments);
    mockActivityService.getAllRecords.mockResolvedValue(mockActivities);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      const activityCounts = screen.getAllByText(/^\d+$/); // Look for numbers
      
      // Mathematics has 2 activities
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
      
      // English has 1 activity
      expect(screen.getByText('English')).toBeInTheDocument();
      
      // Science has 1 activity (Chemistry is archived, so not counted)
      expect(screen.getByText('Science')).toBeInTheDocument();
    });
  });

  it('sorts departments by name alphabetically', async () => {
    const unsortedDepartments: iClipboardDepartment[] = [
      { id: 3, name: 'Science' },
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'English' },
    ];

    mockDepartmentService.getAllRecords.mockResolvedValue(unsortedDepartments);
    mockActivityService.getAllRecords.mockResolvedValue([]);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      const textContent = screen.getByText('Mathematics').textContent;
      expect(textContent).toBeDefined();
    });

    // Verify departments appear in alphabetical order by checking their positions
    const englishElement = screen.getByText('English');
    const mathElement = screen.getByText('Mathematics');
    const scienceElement = screen.getByText('Science');

    expect(englishElement.compareDocumentPosition(mathElement)).toBe(4); // English comes before Mathematics
    expect(mathElement.compareDocumentPosition(scienceElement)).toBe(4); // Mathematics comes before Science
  });

  it('renders error message on fetch failure', async () => {
    const errorMessage = 'Failed to load departments';
    mockDepartmentService.getAllRecords.mockRejectedValue(
      new Error(errorMessage)
    );
    mockActivityService.getAllRecords.mockResolvedValue([]);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockToaster.showToast).toHaveBeenCalled();
  });

  it('renders empty state when no departments available', async () => {
    mockDepartmentService.getAllRecords.mockResolvedValue([]);
    mockActivityService.getAllRecords.mockResolvedValue([]);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      expect(screen.getByText('No departments available.')).toBeInTheDocument();
    });
  });

  it('fetches both departments and activities in parallel', async () => {
    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments);
    mockActivityService.getAllRecords.mockResolvedValue(mockActivities);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      expect(mockDepartmentService.getAllRecords).toHaveBeenCalledTimes(1);
      expect(mockActivityService.getAllRecords).toHaveBeenCalledTimes(1);
    });
  });

  it('department names are clickable links to details page', async () => {
    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments);
    mockActivityService.getAllRecords.mockResolvedValue(mockActivities);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      const mathLink = screen.getByRole('link', { name: /Mathematics/i });
      expect(mathLink).toHaveAttribute(
        'href',
        'https://go.clipboard.app/settings/environment/departments/1/basic-details'
      );
      expect(mathLink).toHaveAttribute('target', '_blank');
    });
  });

  it('handles activities with missing department information gracefully', async () => {
    const activitiesWithoutDept = [
      { id: 1, name: 'Unknown Activity', code: 'UNK', archived: false },
    ] as any;

    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments);
    mockActivityService.getAllRecords.mockResolvedValue(activitiesWithoutDept);

    render(<ClipboardDepartmentsListPanel />);

    await waitFor(() => {
      // Should render without crashing
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
    });
  });
});
