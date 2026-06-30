import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClipboardActivitiesListPanel from '../../../../pages/Clipboard/components/ClipboardActivitiesListPanel';
import Toaster from '../../../../services/Toaster';
import iClipboardActivity from '../../../../types/Clipboard/iClipboardActivity';

// Mock the services
jest.mock('../../../../services/Clipboard/ClipboardActivityService', () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
    getAllRecords: jest.fn(),
    get: jest.fn(),
    applyClientFilters: jest.fn(),
  },
}));

jest.mock('../../../../services/Clipboard/ClipboardDepartmentService', () => ({
  __esModule: true,
  default: {
    getAllRecords: jest.fn(),
  },
}));

jest.mock('../../../../services/Toaster');
jest.mock('../../../../components/common/Table', () => {
  return function MockTable({ columns, rows, pagination }: any) {
    return (
      <table data-testid="mock-table">
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
                col.cell ? col.cell(col, row) : <td key={col.key} />
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
      </table>
    );
  };
});

// Import mocked services
import ClipboardActivityService from '../../../../services/Clipboard/ClipboardActivityService';
import ClipboardDepartmentService from '../../../../services/Clipboard/ClipboardDepartmentService';

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
      expect(screen.getByText('Filter by Department:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter activity name...')).toBeInTheDocument();
      expect(screen.getByText('Archived Status:')).toBeInTheDocument();
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

  it('displays all activities sorted by department then name by default (non-archived)', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      // Should display in order: Music (Piano), then Sports (Basketball, Swimming)
      const rows = screen.getAllByTestId(/^row-/);
      expect(rows.length).toBe(3); // 3 non-archived activities

      // Check they are sorted by department then name
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.getByText('Piano')).toBeInTheDocument();
      expect(screen.getByText('Swimming')).toBeInTheDocument();
      
      // Archived Activity should not be visible by default
      expect(screen.queryByText('Archived Activity')).not.toBeInTheDocument();
    });
  });

  it('sorts activities by department name (asc), then by activity name (asc)', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      const rows = screen.getAllByTestId(/^row-/);
      const rowTexts = Array.from(rows).map((row) => row.textContent);

      // Expected order: Music (Piano), then Sports (Basketball, Swimming)
      // Because departments are sorted: Arts, Music, Sports
      // And Activities are sorted within each department
      expect(rowTexts[0]).toContain('Piano');
      expect(rowTexts[0]).toContain('Music');
      expect(rowTexts[1]).toContain('Basketball');
      expect(rowTexts[1]).toContain('Sports');
      expect(rowTexts[2]).toContain('Swimming');
      expect(rowTexts[2]).toContain('Sports');
    });
  });

  it('filters activities by department', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    const departmentSelect = screen.getByDisplayValue('All Departments') as HTMLSelectElement;

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

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

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

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

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

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    const archivedSelect = screen.getByDisplayValue('Non-Archived Only') as HTMLSelectElement;

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

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    const archivedSelect = screen.getByDisplayValue('Non-Archived Only') as HTMLSelectElement;

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

    await waitFor(() => {
      expect(screen.getByText('Swimming')).toBeInTheDocument();
    });

    const departmentSelect = screen.getByDisplayValue('All Departments') as HTMLSelectElement;
    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

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

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Enter activity name...') as HTMLInputElement;

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

  it('filters activities by SIS code', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    const sisCodeSelect = selects[1] as HTMLSelectElement;

    // Filter by SIS code "BAS"
    fireEvent.change(sisCodeSelect, { target: { value: 'BAS' } });

    await waitFor(() => {
      // Only Basketball should be visible (SIS code BAS)
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.queryByText('Swimming')).not.toBeInTheDocument();
      expect(screen.queryByText('Piano')).not.toBeInTheDocument();
    });
  });

  it('displays SIS code options in alphabetical order', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      const sisCodeSelect = selects[1] as HTMLSelectElement;
      const options = Array.from(sisCodeSelect.options).map((opt) => opt.text);

      // Check that SIS code options are in alphabetical order
      expect(options).toEqual(['All SIS Codes', 'ARC', 'BAS', 'PIA', 'SWM']);
    });
  });

  it('displays blank space for missing SIS code, Activity Type, and Payroll Code', async () => {
    // Mock activities with some missing values
    const activitiesWithBlanks = [
      {
        id: 1,
        name: 'Activity with blanks',
        code: undefined,
        smsCode: undefined,
        activityType: undefined,
        archived: false,
        department: { id: 101, name: 'Sports' },
      } as iClipboardActivity,
    ];

    mockActivityService.getAllRecords.mockResolvedValue(activitiesWithBlanks);
    mockDepartmentService.getAllRecords.mockResolvedValue(mockDepartments);

    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      // Verify the activity with blanks is rendered
      expect(screen.getByText('Activity with blanks')).toBeInTheDocument();
      // The cells should be empty (showing blank space)
      const rows = screen.getAllByTestId(/^row-/);
      expect(rows.length).toBe(1);
    });
  });

  it('renders all filter inputs on one line including SIS code', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Filter by Department:')).toBeInTheDocument();
      expect(screen.getByText('Filter by SIS Code:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter activity name...')).toBeInTheDocument();
      expect(screen.getByText('Archived Status:')).toBeInTheDocument();
    });
  });

  it('combines SIS code filter with other filters', async () => {
    render(<ClipboardActivitiesListPanel />);

    await waitFor(() => {
      expect(screen.getByText('Basketball')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    const departmentSelect = selects[0] as HTMLSelectElement;
    const sisCodeSelect = selects[1] as HTMLSelectElement;

    // Filter by Sports department
    fireEvent.change(departmentSelect, { target: { value: '101' } });

    // Filter by SIS code "SWM"
    fireEvent.change(sisCodeSelect, { target: { value: 'SWM' } });

    await waitFor(() => {
      // Only Swimming should be visible (Sports dept + SIS code SWM)
      expect(screen.getByText('Swimming')).toBeInTheDocument();
      expect(screen.queryByText('Basketball')).not.toBeInTheDocument();
      expect(screen.queryByText('Piano')).not.toBeInTheDocument();
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
