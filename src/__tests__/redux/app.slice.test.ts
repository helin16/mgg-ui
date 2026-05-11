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

  test('merges the payload into an existing state', () => {
    expect(
      appReducer(
        {isProd: false, backendSchoolBoxUrl: 'https://old'},
        setIsProd({isProd: true, backendSchoolBoxUrl: 'https://new'})
      )
    ).toEqual({
      isProd: true,
      backendSchoolBoxUrl: 'https://new',
    });
  });
});
