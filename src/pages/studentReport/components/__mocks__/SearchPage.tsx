import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SearchPage');

export const SearchPageKey = key;
export const SearchPageTestId = testId;

const SearchPage = ComponentTestHelper.mockComponent(
  SearchPageKey,
  SearchPageTestId
);

export default SearchPage;
