import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId(
  'BTGLJournalListPanel'
);

export const BTGLJournalListPanelKey = key;
export const BTGLJournalListPanelTestId = testId;

const BTGLJournalListPanel = ComponentTestHelper.mockComponent(
  BTGLJournalListPanelKey,
  BTGLJournalListPanelTestId
);

export default BTGLJournalListPanel;
