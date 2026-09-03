import appReducer, {setImpersonation, setIsProd} from '../../redux/reduxers/app.slice';

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

  test('setImpersonation sets isImpersonating true', () => {
    expect(
      appReducer(undefined, setImpersonation({isImpersonating: true}))
    ).toEqual({isImpersonating: true});
  });

  test('setImpersonation sets isImpersonating false', () => {
    expect(
      appReducer({isImpersonating: true}, setImpersonation({isImpersonating: false}))
    ).toEqual({isImpersonating: false});
  });

  test('setImpersonation does not disturb isProd / backendSchoolBoxUrl', () => {
    expect(
      appReducer(
        {isProd: true, backendSchoolBoxUrl: 'https://sb'},
        setImpersonation({isImpersonating: true})
      )
    ).toEqual({
      isProd: true,
      backendSchoolBoxUrl: 'https://sb',
      isImpersonating: true,
    });
  });
});
