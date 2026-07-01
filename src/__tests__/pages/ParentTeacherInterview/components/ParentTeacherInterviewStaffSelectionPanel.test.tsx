import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ParentTeacherInterviewStaffSelectionPanel from '../../../../pages/ParentTeacherInterview/components/ParentTeacherInterviewStaffSelectionPanel';

jest.mock('../../../../components/common/SelectBox', () => {
  return function MockSelectBox({options = [], value = [], onChange, placeholder}: any) {
    return (
      <select
        aria-label={placeholder === 'All departments' ? 'Filter by department' : 'Filter by category'}
        multiple
        data-placeholder={placeholder}
        value={value.map((option: any) => option.value)}
        onChange={(event) => {
          const selectedValues = Array.from(event.currentTarget.selectedOptions).map((option: any) => option.value);
          const selectedOptions = options.filter((option: any) => selectedValues.includes(option.value));
          onChange(selectedOptions);
        }}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
});

const staffRows = [
  {
    StaffID: 1001,
    StaffNameInternal: 'Ada Lovelace',
    SchoolStaffCode: 'AL',
    StaffOccupEmail: 'ada@example.com',
    StaffCategory: 'TCHO',
    StaffCategoryDescription: 'Teaching Staff',
    StaffDepartment: 'TS',
  },
  {
    StaffID: 1002,
    StaffNameInternal: 'Grace Hopper',
    SchoolStaffCode: 'GH',
    StaffOccupEmail: 'grace@example.com',
    StaffCategory: 'LEAD',
    StaffCategoryDescription: 'Leadership',
    StaffDepartment: 'SCI',
  },
] as any[];

const categoryRows = [
  {Code: 'TCHO', Description: 'Teaching Staff'},
  {Code: 'LEAD', Description: 'Leadership'},
] as any[];

const departmentRows = [
  {Code: 'TS', Description: 'Teaching Staff'},
  {Code: 'SCI', Description: 'Science'},
] as any[];

describe('ParentTeacherInterviewStaffSelectionPanel', () => {
  test('renders rows and forwards search/category changes', () => {
    const onSearchTextChange = jest.fn();
    const onCategoryCodesChange = jest.fn();
    const onDepartmentCodesChange = jest.fn();

    render(
      <ParentTeacherInterviewStaffSelectionPanel
        categoryCodes={[]}
        categories={categoryRows}
        departmentCodes={[]}
        departments={departmentRows}
        searchText={''}
        selectedStaffIds={[]}
        staffs={staffRows}
        onCategoryCodesChange={onCategoryCodesChange}
        onDepartmentCodesChange={onDepartmentCodesChange}
        onSearchTextChange={onSearchTextChange}
        onToggleAllVisible={jest.fn()}
        onToggleStaff={jest.fn()}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByText('grace@example.com')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'Department'})).toBeInTheDocument();
    expect(screen.getAllByText('Teaching Staff').length).toBeGreaterThan(0);
    expect(screen.getByText('Science')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search staff'), {target: {value: 'Ada'}});
    expect(onSearchTextChange).toHaveBeenCalledWith('Ada');

    const categorySelect = screen.getByLabelText('Filter by category') as HTMLSelectElement;
    Array.from(categorySelect.options).forEach(option => {
      option.selected = option.value === 'TCHO' || option.value === 'LEAD';
    });
    fireEvent.change(categorySelect);
    expect(onCategoryCodesChange).toHaveBeenCalledWith(['TCHO', 'LEAD']);

    const departmentSelect = screen.getByLabelText('Filter by department') as HTMLSelectElement;
    Array.from(departmentSelect.options).forEach(option => {
      option.selected = option.value === 'SCI';
    });
    fireEvent.change(departmentSelect);
    expect(onDepartmentCodesChange).toHaveBeenCalledWith(['SCI']);
  });

  test('supports row selection, header selection, and next gating', () => {
    const onToggleStaff = jest.fn();
    const onToggleAllVisible = jest.fn();
    const onNext = jest.fn();

    render(
      <ParentTeacherInterviewStaffSelectionPanel
        categoryCodes={[]}
        categories={categoryRows}
        departmentCodes={[]}
        departments={departmentRows}
        searchText={''}
        selectedStaffIds={[1001]}
        staffs={staffRows}
        onCategoryCodesChange={jest.fn()}
        onDepartmentCodesChange={jest.fn()}
        onSearchTextChange={jest.fn()}
        onToggleAllVisible={onToggleAllVisible}
        onToggleStaff={onToggleStaff}
        onNext={onNext}
      />
    );

    fireEvent.click(screen.getByLabelText('Select Ada Lovelace'));
    expect(onToggleStaff).toHaveBeenCalledWith(1001, false);

    fireEvent.click(screen.getByLabelText('Select all visible staff'));
    expect(onToggleAllVisible).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole('button', {name: 'Next'}));
    expect(onNext).toHaveBeenCalled();
  });

  test('disables next when no rows are selected', () => {
    render(
      <ParentTeacherInterviewStaffSelectionPanel
        categoryCodes={[]}
        categories={categoryRows}
        departmentCodes={[]}
        departments={departmentRows}
        searchText={''}
        selectedStaffIds={[]}
        staffs={staffRows}
        onCategoryCodesChange={jest.fn()}
        onDepartmentCodesChange={jest.fn()}
        onSearchTextChange={jest.fn()}
        onToggleAllVisible={jest.fn()}
        onToggleStaff={jest.fn()}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByRole('button', {name: 'Next'})).toBeDisabled();
  });
});
