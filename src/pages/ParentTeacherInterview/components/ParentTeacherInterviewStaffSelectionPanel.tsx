import React, {useEffect, useState} from 'react';
import {Alert, Button, Form} from 'react-bootstrap';
import Table, {iTableColumn} from '../../../components/common/Table';
import LoadingBtn from '../../../components/common/LoadingBtn';
import SelectBox from '../../../components/common/SelectBox';
import SectionDiv from '../../../components/common/SectionDiv';
import PopupModal from '../../../components/common/PopupModal';
import iSynLuDepartment from '../../../types/Synergetic/Lookup/iSynLuDepartment';
import iVStaff from '../../../types/Synergetic/iVStaff';
import iSynLuStaffCategory from '../../../types/Synergetic/Lookup/iSynLuStaffCategory';

type iStaffClassSummary = {
  ClassCode: string;
  ClassDescription: string;
  StudentCount: number;
};

type iParentTeacherInterviewStaffSelectionPanel = {
  categoryCodes: string[];
  categories: iSynLuStaffCategory[];
  departmentCodes: string[];
  departments: iSynLuDepartment[];
  searchText: string;
  selectedStaffIds: number[];
  staffs: iVStaff[];
  eligibilityRuleText: string;
  staffClassesByStaffId: {[key: number]: iStaffClassSummary[]};
  activeStaffClassesStaffId: number | null;
  onCategoryCodesChange: (value: string[]) => void;
  onDepartmentCodesChange: (value: string[]) => void;
  onSearchTextChange: (value: string) => void;
  onToggleAllVisible: (checked: boolean) => void;
  onToggleStaff: (staffId: number, checked: boolean) => void;
  onNext: () => void;
  onOpenStaffClasses: (staffId: number) => void;
  onCloseStaffClasses: () => void;
};

const ParentTeacherInterviewStaffSelectionPanel = ({
  categoryCodes,
  categories,
  departmentCodes,
  departments,
  searchText,
  selectedStaffIds,
  staffs,
  eligibilityRuleText,
  staffClassesByStaffId,
  activeStaffClassesStaffId,
  onCategoryCodesChange,
  onDepartmentCodesChange,
  onSearchTextChange,
  onToggleAllVisible,
  onToggleStaff,
  onNext,
  onOpenStaffClasses,
  onCloseStaffClasses,
}: iParentTeacherInterviewStaffSelectionPanel) => {
  const [showEligibilityRule, setShowEligibilityRule] = useState(true);

  useEffect(() => {
    setShowEligibilityRule(true);
  }, [eligibilityRuleText]);

  const categoryOptions = categories.map(category => ({
    value: category.Code,
    label: `${category.Code} - ${category.Description}`,
  }));
  const departmentOptions = departments.map(department => ({
    value: department.Code,
    label: `${department.Code} - ${department.Description}`,
  }));
  const departmentDescriptionByCode = departments.reduce((map, department) => {
    return {
      ...map,
      [department.Code]: department.Description,
    };
  }, {} as {[key: string]: string});
  const selectedCategoryOptions = categoryOptions.filter(option => categoryCodes.includes(option.value));
  const selectedDepartmentOptions = departmentOptions.filter(option => departmentCodes.includes(option.value));
  const selectedStaffIdMap = selectedStaffIds.reduce((map, staffId) => {
    return {
      ...map,
      [staffId]: true,
    };
  }, {} as {[key: number]: boolean});
  const allVisibleSelected = staffs.length > 0 && staffs.every(staff => selectedStaffIdMap[staff.StaffID] === true);
  const activeStaffClasses = activeStaffClassesStaffId === null ? [] : (staffClassesByStaffId[activeStaffClassesStaffId] || []);
  const activeStaff = activeStaffClassesStaffId === null
    ? null
    : staffs.find(staff => staff.StaffID === activeStaffClassesStaffId) || null;

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
    {
      key: 'StaffDepartment',
      sort: 7,
      header: 'Department',
      cell: (_, staff) => (
        <td key={`StaffDepartment-${staff.StaffID}`}>
          {departmentDescriptionByCode[`${staff.StaffDepartment || ''}`] || staff.StaffDepartment || null}
        </td>
      ),
    },
    {
      key: 'Classes',
      sort: 8,
      header: 'Classes',
      cell: (_, staff) => {
        const staffClasses = staffClassesByStaffId[staff.StaffID] || [];
        return (
          <td key={`Classes-${staff.StaffID}`}>
            <Button
              variant={'link'}
              className={'p-0 align-baseline'}
              onClick={() => onOpenStaffClasses(staff.StaffID)}
            >
              {staffClasses.length}
            </Button>
          </td>
        );
      },
    },
  ];

  const classColumns: iTableColumn<iStaffClassSummary>[] = [
    {
      key: 'ClassCode',
      sort: 1,
      header: 'ClassCode',
      cell: (_, row) => <td key={`ClassCode-${row.ClassCode}`}>{row.ClassCode}</td>,
    },
    {
      key: 'ClassDescription',
      sort: 2,
      header: 'ClassDescription',
      cell: (_, row) => <td key={`ClassDescription-${row.ClassCode}`}>{row.ClassDescription}</td>,
    },
    {
      key: 'StudentCount',
      sort: 3,
      header: 'No of students',
      cell: (_, row) => <td key={`StudentCount-${row.ClassCode}`}>{row.StudentCount}</td>,
    },
  ];

  return (
    <SectionDiv className={'no-top'}>
      {showEligibilityRule ? (
        <Alert
          variant={'warning'}
          dismissible
          onClose={() => setShowEligibilityRule(false)}
        >
          {eligibilityRuleText}
        </Alert>
      ) : null}
      <SectionDiv className={'no-top margin-bottom'}>
        <div className={'row g-3 align-items-start'}>
          <div className={'col-lg-4 col-md-6'}>
            <Form.Group className={'h-100 d-flex flex-column justify-content-end'}>
              <Form.Label>Search staff</Form.Label>
              <Form.Control
                aria-label={'Search staff'}
                placeholder={'Search by Staff ID or Staff Name'}
                value={searchText}
                onChange={event => onSearchTextChange(event.target.value)}
              />
            </Form.Group>
          </div>
          <div className={'col-lg-4 col-md-6'}>
            <Form.Group className={'h-100 d-flex flex-column justify-content-end'}>
              <Form.Label>Category</Form.Label>
              <SelectBox
                className={'pti-category-select'}
                placeholder={'All categories'}
                isMulti
                isClearable
                options={categoryOptions}
                value={selectedCategoryOptions}
                onChange={(options: Array<{value: string}> | null) =>
                  onCategoryCodesChange((options || []).map(option => option.value))
                }
              />
            </Form.Group>
          </div>
          <div className={'col-lg-4 col-md-6'}>
            <Form.Group className={'h-100 d-flex flex-column justify-content-end'}>
              <Form.Label>Department</Form.Label>
              <SelectBox
                className={'pti-department-select'}
                placeholder={'All departments'}
                isMulti
                isClearable
                options={departmentOptions}
                value={selectedDepartmentOptions}
                onChange={(options: Array<{value: string}> | null) =>
                  onDepartmentCodesChange((options || []).map(option => option.value))
                }
              />
            </Form.Group>
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

      <PopupModal
        show={activeStaffClassesStaffId !== null}
        handleClose={onCloseStaffClasses}
        title={activeStaff ? `${activeStaff.StaffNameInternal} Classes` : 'Classes'}
      >
        <Table
          columns={classColumns}
          hover
          responsive
          striped
          rows={activeStaffClasses}
        />
      </PopupModal>
    </SectionDiv>
  );
};

export default ParentTeacherInterviewStaffSelectionPanel;
