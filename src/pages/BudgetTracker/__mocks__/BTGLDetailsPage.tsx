import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('BTGLDetailsPage');

export const BTGLDetailsPageKey = key;
export const BTGLDetailsPageTestId = testId;

const BTGLDetailsPage = ComponentTestHelper.mockComponent(
  BTGLDetailsPageKey,
  BTGLDetailsPageTestId
);

export default BTGLDetailsPage;
