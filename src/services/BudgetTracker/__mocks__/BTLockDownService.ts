export const getAll = jest.fn(() => Promise.resolve([]));
export const create = jest.fn(() => Promise.resolve({}));

const BTLockDownService = {
  getAll,
  create,
};

export default BTLockDownService;
