import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClipboardActivitiesListPanel from '../../../../../pages/Clipboard/components/ClipboardActivitiesListPanel';
import Toaster from '../../../../../services/Toaster';

// Mock the services
jest.mock('../../../../../services/Clipboard/ClipboardActivityService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getAllRecords: jest.fn(),
    get: jest.fn(),
    applyClientFilters: jest.fn(),
  },
}));

jest.mock('../../../../../services/Clipboard/ClipboardDepartmentService', () => ({
  __esModule: true,
  default: {
    getAllRecords: jest.fn(),
  },
}));

jest.mock('../../../../../services/Toaster');
jest.mock('../../../../../components/common/Table', () => {
  return function MockTable({ columns, rows, pagination }: any) {
    return (
      <div data-testid="mock-table">
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.map((row: any, idx: number) => (
            <tr key={idx} data-testid={`row-${idx}`}>
              {columns.map((col: any) => (
                <td key={col.key}>{col.cell && col.cell(col, row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {pagination && (
          <tfoot>
            <tr>
              <td colSpan={columns.length} data-testid="pagination">
                Page {pagination.currentPage} of {pagination.totalPages}
              </td>
            </tr>
          </tfoot>
        )}
      </div>
    );
  };
});

// Import mocked services
import ClipboardActivityService from '../../../../../services/Clipboard/ClipboardActivityService';
import ClipboardDepartmentService from '../../../../../services/Clipboard/ClipboardDepartmentService';

describe('ClipboardActivitiesListPanel', () => {
  const mockActivityService = ClipboardActivityService as jest.Mocked<typeof ClipboardActivityService>;
  const mockDepartmentService = ClipboardDepartmentService as jest.Mocked<typeof ClipboardDepartmentService>;
  const mockToaster = Toaster as jest.Mocked<typeof Toaster>;

  const mockDepartments = [
    { id: 101, name: 'Sports' },
    { id: 102, name: 'Music' },
    { id: 103, name: 'Arts' },
  ];

  const mockActivities = [
    {
      id: 1,
      name: 'Swimming',
      code: 'PAYROLL_SWM',
      smsCode: 'SWM',
      activityType: 'Sport',
      archived: false,
      department: { id: 101, name: 'Sports' },
    },
    {
      id: 2,
      name: 'Basketball',
      code: 'PAYROLL_BAS',
      smsCode: 'BAS',
      activityType: 'Sport',
      archived: false,
      department: { id: 101, name: 'Sports' },
    },
    {
      id: 3,
      name: 'Piano',
      code: 'PAYROLL_PIA',
      smsCode: 'PIA',
      activityType: 'Music',
      archived: false,
      department: { id: 102, name: 'Music' },
    },
    {
      id: 4,
      name: 'Archived Activity',
      code: 'PAYROLL_ARC',
      smsCode: 'ARC',
      activityType: 'Sport',
      archived: true,
      department: { id: 101, name: 'Sports' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockActivityService.getAllRecords.mockResolvedValue(mockActivities);
    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments);
  });

  it('renders the component and loads data', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(mockActivityService.getAllRecords).toHaveBeenCalled();
      expect(mockDepartmentService.getAllRecords).toHaveBeenCalled();
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });
  });

  it('renders all filter inputs on one line', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      // Department filter
      expect(screen.getByLabelText('Filter by Department:')).toBeInTheDocument();
      // Search input
      expect(screen.getByPlaceholderText('Enter activity name...')).toBeInTheDocument();
      // Archived filter
      expect(screen.getByLabelText('Archived Status:')).toBeInTheDocument();
    });
  });

  it('renders table columns for activities', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('SIS code')).toBeInTheDocument();
      expect(screen.getByText('Activity Type')).toBeInTheDocument();
      expect(screen.getByText('Payroll Code')).toBeInTheDocument();
      expect(screen.getByText('Archived')).toBeInTheDocument();
    });
  });

  it('displays all activities sorted by name by default (non-archived)', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      // Should display Basketball, Piano, Swimming (alphabetical order, excluding archived)
      const rows = screen.getAllByTestId(/^row-/);
      expect(rows.length).toBe(3); // 3 non-archived activities

      // Check they are sorted by name
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.getByText('Piano')).toBeInTheDocument();
      expect(screen.getByText('Swimming')).toBeInTheDocument();
      
      // Archived Activity should not be visible by default
      expect(screen.queryByText('Archived Activity')).not.toBeInTheDocument();
    });
  });

  it('sorts activities by name in ascending order', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      const rows = screen.getAllByTestId(/^row-/);
      const activityNames = Array.from(rows)
        .map((row) => row.textContent)
        .filter((text) => text && (text.includes('Basketball') || text.includes('Piano') || text.includes('Swimming')));

      // Activities should be sorted: Basketball, Piano, Swimming
      expect(activityNames[0]).toContain('Basketball');
      expect(activityNames[1]).toContain('Piano');
      expect(activityNames[2]).toContain('Swimming');
    });
  });

  it('filters activities by department', async () => {
    render(<ClipboardActivitiesListPanel />);

    const departmentSelect = screen.getByDisplayValue('All Departments') as HTMLSelectElement;

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    // Filter by Music department (102)
    fireEvent.change(departmentSelect, { target: { value: '102' } });

    await waitFor(() => {
      // Only Piano should be visible (in Music department)
      expect(screen.getByText('Piano')).toBeInTheDocument();
      expect(screen.queryByText('Basketball')).not.toBeInTheDocument();
      expect(screen.queryByText('Swimming')).not.toBeInTheDocument();
    });
  });

  it('filters activities by search name', async () => {
    render(<ClipboardActivitiesListPanel />);

    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    // Search for "ball"
    fireEvent.change(searchInput, { target: { value: 'ball' } });

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.queryByText('Piano')).not.toBeInTheDocument();
      expect(screen.queryByText('Swimming')).not.toBeInTheDocument();
    });
  });

  it('search is case-insensitive', async () => {
    render(<ClipboardActivitiesListPanel />);

    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    // Search for "SWIM"
    fireEvent.change(searchInput, { target: { value: 'SWIM' } });

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
      expect(screen.queryByText('Basketball')).not.toBeInTheDocument();
    });
  });

  it('defaults to showing only non-archived activities', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.queryByText('Archived Activity')).not.toBeInTheDocument();
    });

    const archivedSelect = screen.getByDisplayValue('Non-Archived Only') as HTMLSelectElement;
    expect(archivedSelect.value).toBe('non-archived');
  });

  it('filters to show only archived activities', async () => {
    render(<ClipboardActivitiesListPanel />);

    const archivedSelect = screen.getByDisplayValue('Non-Archived Only') as HTMLSelectElement;

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    // Change to "Archived Only"
    fireEvent.change(archivedSelect, { target: { value: 'archived' } });

    await waitFor(() => {
      expect(screen.getByText('Archived Activity')).toBeInTheDocument();
      expect(screen.queryByText('Basketball')).not.toBeInTheDocument();
      expect(screen.queryByText('Swimming')).not.toBeInTheDocument();
    });
  });

  it('shows all activities (archived and non-archived) when "All" is selected', async () => {
    render(<ClipboardActivitiesListPanel />);

    const archivedSelect = screen.getByDisplayValue('Non-Archived Only') as HTMLSelectElement;

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    // Change to "All (Include Archived)"
    fireEvent.change(archivedSelect, { target: { value: 'all' } });

    await waitFor(() => {
      // All 4 activities should be visible, including archived
      const rows = screen.getAllByTestId(/^row-/);
      expect(rows.length).toBe(4);
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.getByText('Piano')).toBeInTheDocument();
      expect(screen.getByText('Swimming')).toBeInTheDocument();
      expect(screen.getByText('Archived Activity')).toBeInTheDocument();
    });
  });

  it('combines multiple filters (department + search)', async () => {
    render(<ClipboardActivitiesListPanel />);

    const departmentSelect = screen.getByDisplayValue('All Departments') as HTMLSelectElement;
    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    // Filter by Sports department
    fireEvent.change(departmentSelect, { target: { value: '101' } });

    // Search for "ball"
    fireEvent.change(searchInput, { target: { value: 'ball' } });

    await waitFor(() => {
      // Only Basketball should be visible (Sports dept + contains "ball")
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.queryByText('Swimming')).not.toBeInTheDocument();
      expect(screen.queryByText('Piano')).not.toBeInTheDocument();
    });
  });

  it('shows "no activities" message when no matches are found', async () => {
    render(<ClipboardActivitiesListPanel />);

    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(
        screen.getByText('No activities match your filters. Try adjusting your search criteria.')
      ).toBeInTheDocument();
    });
  });

  it('displays department options in alphabetical order', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      const departmentSelect = screen.getByDisplayValue('All Departments') as HTMLSelectElement;
      const options = Array.from(departmentSelect.options).map((opt) => opt.text);

      // Check that options are in alphabetical order (excluding "All Departments")
      expect(options).toEqual(['All Departments', 'Arts', 'Music', 'Sports']);
    });
  });

  it('handles error loading data', async () => {
    const errorMessage = 'Failed to load activities';
    mockActivityService.getAllRecords.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockToaster.showToast).toHaveBeenCalled();
    });
  });

  it('displays loading spinner initially', () => {
    // Mock with a promise that never resolves to keep it in loading state
    mockActivityService.getAllRecords.mockImplementation(
      () => new Promise(() => {})
    );
    mockDepartmentService.getAllRecords.mockImplementation(
      () => new Promise(() => {})
    );

    render(<ClipboardActivitiesListPanel />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
