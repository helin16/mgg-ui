import AppService, {iConfigParams} from '../../services/AppService';
import TestHelper from './TestHelper';

type ServiceFn = (...args: any[]) => Promise<any>;
const EMPTY = '__empty__';

const expectArgsToMatch = (calls: any[][], expectedArgs: any[]) => {
  expect(calls).toHaveLength(1);
  const actualArgs = calls[0];
  expect(actualArgs).toHaveLength(expectedArgs.length);

  expectedArgs.forEach((expected, index) => {
    if (expected === EMPTY) {
      expect([undefined, {}]).toContainEqual(actualArgs[index]);
      return;
    }
    expect(actualArgs[index]).toEqual(expected);
  });
};

const testGetAll = (endPoint: string, getAllFn: ServiceFn, defaultConfig: iConfigParams = {}) =>
  describe(`getAll: GET ${endPoint}`, () => {
    const {fakeParams, fakeConfig, fakeResp} = TestHelper.getFakeParams();

    test.each([
      {
        params: undefined,
        config: undefined,
        expectedParams: EMPTY,
        expectedConfig: Object.keys(defaultConfig).length === 0 ? EMPTY : defaultConfig,
      },
      {
        params: fakeParams,
        config: fakeConfig,
        expectedParams: fakeParams,
        expectedConfig: fakeConfig,
      },
    ])('%j', async item => {
      AppService.get = jest.fn().mockResolvedValueOnce({data: fakeResp}) as any;

      const result = await getAllFn(item.params, item.config);

      expect(result).toEqual(fakeResp);
      expectArgsToMatch((AppService.get as any).mock.calls, [
        endPoint,
        item.expectedParams,
        item.expectedConfig,
      ]);
    });
  });

const testGet = (endPoint: string, getFn: ServiceFn, defaultConfig: iConfigParams = {}) =>
  describe(`get: GET ${endPoint}/:id`, () => {
    const {fakeId, fakeParams, fakeConfig, fakeResp} = TestHelper.getFakeParams();

    test.each([
      {
        params: undefined,
        config: undefined,
        expectedParams: EMPTY,
        expectedConfig: Object.keys(defaultConfig).length === 0 ? EMPTY : defaultConfig,
      },
      {
        params: fakeParams,
        config: fakeConfig,
        expectedParams: fakeParams,
        expectedConfig: fakeConfig,
      },
    ])('%j', async item => {
      AppService.get = jest.fn().mockResolvedValueOnce({data: fakeResp}) as any;

      const result = await getFn(fakeId, item.params, item.config);

      expect(result).toEqual(fakeResp);
      expectArgsToMatch((AppService.get as any).mock.calls, [
        `${endPoint}/${fakeId}`,
        item.expectedParams,
        item.expectedConfig,
      ]);
    });
  });

const testCreate = (endPoint: string, createFn: ServiceFn, defaultConfig: iConfigParams = {}) =>
  describe(`create: POST ${endPoint}`, () => {
    const {fakeParams, fakeConfig, fakeResp} = TestHelper.getFakeParams();

    test.each([
      {
        params: undefined,
        config: undefined,
        expectedParams: {},
        expectedConfig: Object.keys(defaultConfig).length === 0 ? EMPTY : defaultConfig,
      },
      {
        params: fakeParams,
        config: fakeConfig,
        expectedParams: fakeParams,
        expectedConfig: fakeConfig,
      },
    ])('%j', async item => {
      AppService.post = jest.fn().mockResolvedValueOnce({data: fakeResp}) as any;

      const result = await createFn(item.params, item.config);

      expect(result).toEqual(fakeResp);
      expectArgsToMatch((AppService.post as any).mock.calls, [
        endPoint,
        item.expectedParams,
        item.expectedConfig,
      ]);
    });
  });

const testUpdate = (endPoint: string, updateFn: ServiceFn, defaultConfig: iConfigParams = {}) =>
  describe(`update: PUT ${endPoint}/:id`, () => {
    const {fakeId, fakeParams, fakeConfig, fakeResp} = TestHelper.getFakeParams();

    test.each([
      {
        params: undefined,
        config: undefined,
        expectedParams: {},
        expectedConfig: Object.keys(defaultConfig).length === 0 ? EMPTY : defaultConfig,
      },
      {
        params: fakeParams,
        config: fakeConfig,
        expectedParams: fakeParams,
        expectedConfig: fakeConfig,
      },
    ])('%j', async item => {
      AppService.put = jest.fn().mockResolvedValueOnce({data: fakeResp}) as any;

      const result = await updateFn(fakeId, item.params, item.config);

      expect(result).toEqual(fakeResp);
      expectArgsToMatch((AppService.put as any).mock.calls, [
        `${endPoint}/${fakeId}`,
        item.expectedParams,
        item.expectedConfig,
      ]);
    });
  });

const testDeactivate = (endPoint: string, deactivateFn: ServiceFn, defaultConfig: iConfigParams = {}) =>
  describe(`deactivate: DELETE ${endPoint}/:id`, () => {
    const {fakeId, fakeParams, fakeConfig, fakeResp} = TestHelper.getFakeParams();

    test.each([
      {
        params: undefined,
        config: undefined,
        expectedParams: EMPTY,
        expectedConfig: Object.keys(defaultConfig).length === 0 ? EMPTY : defaultConfig,
      },
      {
        params: fakeParams,
        config: fakeConfig,
        expectedParams: fakeParams,
        expectedConfig: fakeConfig,
      },
    ])('%j', async item => {
      AppService.delete = jest.fn().mockResolvedValueOnce({data: fakeResp}) as any;

      const result = await deactivateFn(fakeId, item.params, item.config);

      expect(result).toEqual(fakeResp);
      expectArgsToMatch((AppService.delete as any).mock.calls, [
        `${endPoint}/${fakeId}`,
        item.expectedParams,
        item.expectedConfig,
      ]);
    });
  });

const testCustom = ({
  name,
  serviceFn,
  appMethod,
  callArgs,
  expectedArgs,
  response,
}: {
  name: string;
  serviceFn: ServiceFn;
  appMethod: 'get' | 'post' | 'put' | 'delete';
  callArgs: any[];
  expectedArgs: any[];
  response?: any;
}) =>
  describe(name, () => {
    test('', async () => {
      const fakeResp = response === undefined ? TestHelper.getFakeParams().fakeResp : response;
      (AppService as any)[appMethod] = jest.fn().mockResolvedValueOnce({data: fakeResp});

      const result = await serviceFn(...callArgs);

      expect(result).toEqual(fakeResp);
      expect((AppService as any)[appMethod]).toHaveBeenCalledTimes(1);
      expect((AppService as any)[appMethod]).toHaveBeenLastCalledWith(...expectedArgs);
    });
  });

const ServiceTestHelper = {
  testGetAll,
  testGet,
  testCreate,
  testUpdate,
  testDeactivate,
  testCustom,
};

export default ServiceTestHelper;
