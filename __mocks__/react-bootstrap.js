const ComponentTestHelper = require('../src/__tests__/helper/ComponentTestHelper').default;

const actual = jest.requireActual('react-bootstrap');
const {key: TabKey, testId: TabTestId} = ComponentTestHelper.getKeyAndTestId('Tab');
const {key: TabsKey, testId: TabsTestId} = ComponentTestHelper.getKeyAndTestId('Tabs');

const Tab = ComponentTestHelper.mockComponent(TabKey, TabTestId);
const Tabs = ComponentTestHelper.mockComponent(TabsKey, TabsTestId);

module.exports = {
  ...actual,
  __esModule: true,
  Tab,
  Tabs,
  TabKey,
  TabTestId,
  TabsKey,
  TabsTestId,
};
