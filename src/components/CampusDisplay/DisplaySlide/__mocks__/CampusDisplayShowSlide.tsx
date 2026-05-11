import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('CampusDisplayShowSlide');

export const CampusDisplayShowSlideKey = key;
export const CampusDisplayShowSlideTestId = testId;

const CampusDisplayShowSlide = ComponentTestHelper.mockComponent(
  CampusDisplayShowSlideKey,
  CampusDisplayShowSlideTestId
);

export default CampusDisplayShowSlide;
