import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SynFileSemesterSelector');

export const SynFileSemesterSelectorKey = key;
export const SynFileSemesterSelectorTestId = testId;
export const SynFileSemesterSelectorOption = {
  data: {
    FileSemestersSeq: 99,
    StartDate: '2026-03-01T00:00:00Z',
    EndDate: '2026-03-31T00:00:00Z',
    FileYear: 2026,
    FileSemester: 1,
  },
};

const SynFileSemesterSelector = (props: any) => {
  ComponentTestHelper.mockComponent(
    SynFileSemesterSelectorKey,
    SynFileSemesterSelectorTestId
  )(props);

  return (
    <div data-testid={SynFileSemesterSelectorTestId}>
      <button type="button" onClick={() => props?.onSelect?.(SynFileSemesterSelectorOption)}>
        Pick Semester
      </button>
      <button type="button" onClick={() => props?.onSelect?.(null)}>
        Clear Semester
      </button>
    </div>
  );
};

export default SynFileSemesterSelector;
