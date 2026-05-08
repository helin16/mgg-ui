import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId(
  'BTGLJournalInMonthPanel'
);

export const BTGLJournalInMonthPanelKey = key;
export const BTGLJournalInMonthPanelTestId = testId;

const BTGLJournalInMonthPanel = ComponentTestHelper.mockComponent(
  BTGLJournalInMonthPanelKey,
  BTGLJournalInMonthPanelTestId
);

export default BTGLJournalInMonthPanel;
