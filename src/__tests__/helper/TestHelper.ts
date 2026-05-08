const prepareEnv = (newEnv = {}) => {
  const oldEnv = {...process.env};

  beforeEach(() => {
    process.env = {
      ...oldEnv,
      ...newEnv,
    };
  });

  afterAll(() => {
    process.env = oldEnv;
  });
};

const getFakeParams = () => ({
  fakeAppToken: 'app-token',
  fakeUrlPath: '/fake-path',
  fakeUrl: 'https://api.example.test',
  fakeId: '123',
  fakeParams: {
    fakeParams: 'value',
  },
  fakeConfig: {
    headers: {
      fakeConfig: 'value',
    },
  },
  fakeResp: {
    fakeResp: 'value',
  },
});

const TestHelper = {
  getFakeParams,
  prepareEnv,
};

export default TestHelper;
