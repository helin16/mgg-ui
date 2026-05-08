import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SearchPanel');

export const SearchPanelKey = key;
export const SearchPanelTestId = testId;

const SearchPanel = ComponentTestHelper.mockComponent(
  SearchPanelKey,
  SearchPanelTestId
);

export default SearchPanel;
