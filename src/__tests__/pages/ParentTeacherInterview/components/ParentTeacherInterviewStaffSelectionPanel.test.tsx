import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ParentTeacherInterviewStaffSelectionPanel from '../../../../pages/ParentTeacherInterview/components/ParentTeacherInterviewStaffSelectionPanel';

const staffRows = [
  {
    StaffID: 1001,
    StaffNameInternal: 'Ada Lovelace',
    SchoolStaffCode: 'AL',
    StaffOccupEmail: 'ada@example.com',
    StaffCategory: 'TEACH',
    StaffCategoryDescription: 'Teaching Staff',
  },
  {
    StaffID: 1002,
    StaffNameInternal: 'Grace Hopper',
    SchoolStaffCode: 'GH',
    StaffOccupEmail: 'grace@example.com',
    StaffCategory: 'LEAD',
    StaffCategoryDescription: 'Leadership',
  },
] as any[];

const categoryRows = [
  {Code: 'TEACH', Description: 'Teaching Staff'},
  {Code: 'LEAD', Description: 'Leadership'},
] as any[];

describe('ParentTeacherInterviewStaffSelectionPanel', () => {
  test('renders rows and forwards search/category changes', () => {
    const onSearchTextChange = jest.fn();
    const onCategoryCodeChange = jest.fn();

    render(
      <ParentTeacherInterviewStaffSelectionPanel
        categoryCode={''}
        categories={categoryRows}
        searchText={''}
        selectedStaffIds={[]}
        staffs={staffRows}
        onCategoryCodeChange={onCategoryCodeChange}
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

    fireEvent.change(screen.getByLabelText('Search staff'), {target: {value: 'Ada'}});
    expect(onSearchTextChange).toHaveBeenCalledWith('Ada');

    fireEvent.change(screen.getByLabelText('Filter by category'), {target: {value: 'LEAD'}});
    expect(onCategoryCodeChange).toHaveBeenCalledWith('LEAD');
  });

  test('supports row selection, header selection, and next gating', () => {
    const onToggleStaff = jest.fn();
    const onToggleAllVisible = jest.fn();
    const onNext = jest.fn();

    render(
      <ParentTeacherInterviewStaffSelectionPanel
        categoryCode={''}
        categories={categoryRows}
        searchText={''}
        selectedStaffIds={[1001]}
        staffs={staffRows}
        onCategoryCodeChange={jest.fn()}
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
        categoryCode={''}
        categories={categoryRows}
        searchText={''}
        selectedStaffIds={[]}
        staffs={staffRows}
        onCategoryCodeChange={jest.fn()}
        onSearchTextChange={jest.fn()}
        onToggleAllVisible={jest.fn()}
        onToggleStaff={jest.fn()}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByRole('button', {name: 'Next'})).toBeDisabled();
  });
});
