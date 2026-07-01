import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynStudentProfileSelector');

export const SynStudentProfileSelectorKey = key;
export const SynStudentProfileSelectorTestId = testId;

const sampleStudent = {
  ID: 101,
  StudentID: 'S101',
  StudentGiven1: 'Ada',
  StudentSurname: 'Lovelace',
  DebtorID: 201,
};

const SynStudentProfileSelector = (props: any) => {
  ComponentTestHelper.mockComponent(SynStudentProfileSelectorKey, SynStudentProfileSelectorTestId)(props);

  return (
    <div data-testid={SynStudentProfileSelectorTestId}>
      <button type="button" onClick={() => props?.onChange?.([sampleStudent])}>
        Pick Student
      </button>
      <button type="button" onClick={() => props?.onChange?.([])}>
        Clear Students
      </button>
    </div>
  );
};

export default SynStudentProfileSelector;
