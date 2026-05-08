import ComponentTestHelper from '../../helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('layoutModuleMocks');

export const layoutModuleMocksKey = key;
export const layoutModuleMocksTestId = testId;

const layoutModuleMocks = ComponentTestHelper.mockComponent(
  layoutModuleMocksKey,
  layoutModuleMocksTestId
);

export default layoutModuleMocks;
