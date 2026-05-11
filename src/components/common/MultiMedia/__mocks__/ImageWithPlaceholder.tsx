import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ImageWithPlaceholder');

export const ImageWithPlaceholderKey = key;
export const ImageWithPlaceholderTestId = testId;

const ImageWithPlaceholder = ComponentTestHelper.mockComponent(
  ImageWithPlaceholderKey,
  ImageWithPlaceholderTestId
);

export const getImagePlaceHolder = jest.fn(() => 'image-placeholder');

export default ImageWithPlaceholder;
