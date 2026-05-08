import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayLocationSelector');

export const CampusDisplayLocationSelectorKey = key;
export const CampusDisplayLocationSelectorTestId = testId;

const CampusDisplayLocationSelector = ComponentTestHelper.mockComponent(
  CampusDisplayLocationSelectorKey,
  CampusDisplayLocationSelectorTestId
);

export default CampusDisplayLocationSelector;
