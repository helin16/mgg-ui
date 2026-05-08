import appReducer, {setIsProd} from '../../redux/reduxers/app.slice';

describe('app.slice', () => {
  test('handles setIsProd', () => {
    expect(
      appReducer(undefined, setIsProd({isProd: true, backendSchoolBoxUrl: 'https://sb'}))
    ).toEqual({
      isProd: true,
      backendSchoolBoxUrl: 'https://sb',
    });
  });
});
