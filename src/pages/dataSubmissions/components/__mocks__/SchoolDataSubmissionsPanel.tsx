import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolDataSubmissionsPanel');

export const SchoolDataSubmissionsPanelKey = key;
export const SchoolDataSubmissionsPanelTestId = testId;

const SchoolDataSubmissionsPanel = ComponentTestHelper.mockComponent(
  SchoolDataSubmissionsPanelKey,
  SchoolDataSubmissionsPanelTestId
);

export default SchoolDataSubmissionsPanel;
