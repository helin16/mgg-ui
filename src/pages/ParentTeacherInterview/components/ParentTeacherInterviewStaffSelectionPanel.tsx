import React from 'react';
import {Form} from 'react-bootstrap';
import Table, {iTableColumn} from '../../../components/common/Table';
import LoadingBtn from '../../../components/common/LoadingBtn';
import SectionDiv from '../../../components/common/SectionDiv';
import iVStaff from '../../../types/Synergetic/iVStaff';
import iSynLuStaffCategory from '../../../types/Synergetic/Lookup/iSynLuStaffCategory';

type iParentTeacherInterviewStaffSelectionPanel = {
  categoryCode: string;
  categories: iSynLuStaffCategory[];
  searchText: string;
  selectedStaffIds: number[];
  staffs: iVStaff[];
  onCategoryCodeChange: (value: string) => void;
  onSearchTextChange: (value: string) => void;
  onToggleAllVisible: (checked: boolean) => void;
  onToggleStaff: (staffId: number, checked: boolean) => void;
  onNext: () => void;
};

const ParentTeacherInterviewStaffSelectionPanel = ({
  categoryCode,
  categories,
  searchText,
  selectedStaffIds,
  staffs,
  onCategoryCodeChange,
  onSearchTextChange,
  onToggleAllVisible,
  onToggleStaff,
  onNext,
}: iParentTeacherInterviewStaffSelectionPanel) => {
  const selectedStaffIdMap = selectedStaffIds.reduce((map, staffId) => {
    return {
      ...map,
      [staffId]: true,
    };
  }, {} as {[key: number]: boolean});
  const allVisibleSelected = staffs.length > 0 && staffs.every(staff => selectedStaffIdMap[staff.StaffID] === true);

  const columns: iTableColumn<iVStaff>[] = [
    {
      key: 'selected',
      sort: 1,
      header: () => (
        <th key={'selected'}>
          <Form.Check
            aria-label={'Select all visible staff'}
            checked={allVisibleSelected}
            onChange={event => onToggleAllVisible(event.target.checked)}
          />
        </th>
      ),
      cell: (_, staff) => (
        <td key={`selected-${staff.StaffID}`}>
          <Form.Check
            aria-label={`Select ${staff.StaffNameInternal}`}
            checked={selectedStaffIdMap[staff.StaffID] === true}
            onChange={event => onToggleStaff(staff.StaffID, event.target.checked)}
          />
        </td>
      ),
    },
    {
      key: 'StaffID',
      sort: 2,
      header: 'ID',
      cell: (_, staff) => <td key={`StaffID-${staff.StaffID}`}>{staff.StaffID}</td>,
    },
    {
      key: 'StaffNameInternal',
      sort: 3,
      header: 'Staff Name',
      cell: (_, staff) => <td key={`StaffNameInternal-${staff.StaffID}`}>{staff.StaffNameInternal}</td>,
    },
    {
      key: 'SchoolStaffCode',
      sort: 4,
      header: 'Staff Code',
      cell: (_, staff) => <td key={`SchoolStaffCode-${staff.StaffID}`}>{staff.SchoolStaffCode}</td>,
    },
    {
      key: 'StaffOccupEmail',
      sort: 5,
      header: 'Staff Email',
      cell: (_, staff) => <td key={`StaffOccupEmail-${staff.StaffID}`}>{staff.StaffOccupEmail}</td>,
    },
    {
      key: 'StaffCategoryDescription',
      sort: 6,
      header: 'Category',
      cell: (_, staff) => (
        <td key={`StaffCategoryDescription-${staff.StaffID}`}>
          {staff.StaffCategoryDescription || staff.StaffCategory}
        </td>
      ),
    },
  ];

  return (
    <SectionDiv className={'no-top'}>
      <SectionDiv className={'no-top margin-bottom'}>
        <h5>Select Teaching Staff</h5>
        <div className={'row g-3 align-items-end'}>
          <div className={'col-md-6'}>
            <Form.Label>Search staff</Form.Label>
            <Form.Control
              aria-label={'Search staff'}
              placeholder={'Search by Staff ID or Staff Name'}
              value={searchText}
              onChange={event => onSearchTextChange(event.target.value)}
            />
          </div>
          <div className={'col-md-4'}>
            <Form.Label>Category</Form.Label>
            <Form.Select
              aria-label={'Filter by category'}
              value={categoryCode}
              onChange={event => onCategoryCodeChange(event.target.value)}
            >
              <option value={''}>All categories</option>
              {categories.map(category => (
                <option key={category.Code} value={category.Code}>
                  {category.Code} - {category.Description}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      </SectionDiv>

      <p>{staffs.length} staff shown. {selectedStaffIds.length} selected.</p>

      <Table
        columns={columns}
        hover
        responsive
        striped
        rows={staffs}
      />

      <div className={'text-end mt-3'}>
        <LoadingBtn
          variant={'primary'}
          onClick={onNext}
          disabled={selectedStaffIds.length <= 0}
        >
          Next
        </LoadingBtn>
      </div>
    </SectionDiv>
  );
};

export default ParentTeacherInterviewStaffSelectionPanel;
