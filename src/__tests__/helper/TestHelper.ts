import {faker} from '@faker-js/faker';

const TEST_FAKER_SEED = 20260511;

const resetFaker = () => {
  faker.seed(TEST_FAKER_SEED);
};

const prepareEnv = (newEnv = {}) => {
  const oldEnv = {...process.env};

  beforeEach(() => {
    resetFaker();
    process.env = {
      ...oldEnv,
      ...newEnv,
    };
  });

  afterAll(() => {
    process.env = oldEnv;
  });
};

const getFakeParams = () => {
  resetFaker();

  return {
    fakeAppToken: faker.string.alphanumeric(24),
    fakeUrlPath: `/${faker.lorem.slug(2)}`,
    fakeUrl: faker.internet.url(),
    fakeId: faker.string.uuid(),
    fakeParams: {
      fakeParams: faker.lorem.word(),
    },
    fakeConfig: {
      headers: {
        fakeConfig: faker.lorem.word(),
      },
    },
    fakeResp: {
      fakeResp: faker.lorem.word(),
    },
  };
};

const TestHelper = {
  faker,
  getFakeParams,
  prepareEnv,
  resetFaker,
};

export default TestHelper;
