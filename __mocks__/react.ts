const actual = jest.requireActual('react');
const mockedReact = {
  ...actual,
  useEffect: jest.fn(),
};

module.exports = {
  ...mockedReact,
  __esModule: true,
  default: mockedReact,
};
