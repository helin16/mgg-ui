import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SectionDiv');

export const SectionDivKey = key;
export const SectionDivTestId = testId;

const SectionDiv = ComponentTestHelper.mockComponent(
  SectionDivKey,
  SectionDivTestId
);

export default SectionDiv;
