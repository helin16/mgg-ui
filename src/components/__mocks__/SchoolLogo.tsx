import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('SchoolLogo');

export const SchoolLogoKey = key;
export const SchoolLogoTestId = testId;

const SchoolLogo = ComponentTestHelper.mockComponent(
  SchoolLogoKey,
  SchoolLogoTestId
);

export default SchoolLogo;
