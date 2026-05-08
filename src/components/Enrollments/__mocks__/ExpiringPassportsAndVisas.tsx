import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ExpiringPassportsAndVisas');

export const ExpiringPassportsAndVisasKey = key;
export const ExpiringPassportsAndVisasTestId = testId;

const ExpiringPassportsAndVisas = ComponentTestHelper.mockComponent(
  ExpiringPassportsAndVisasKey,
  ExpiringPassportsAndVisasTestId
);

export default ExpiringPassportsAndVisas;
