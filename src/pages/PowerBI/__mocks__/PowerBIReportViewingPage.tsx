import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('PowerBIReportViewingPage');

export const PowerBIReportViewingPageKey = key;
export const PowerBIReportViewingPageTestId = testId;

const PowerBIReportViewingPage = ComponentTestHelper.mockComponent(
  PowerBIReportViewingPageKey,
  PowerBIReportViewingPageTestId
);

export default PowerBIReportViewingPage;
