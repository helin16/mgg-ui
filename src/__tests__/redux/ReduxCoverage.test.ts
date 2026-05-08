import store from '../../redux/makeReduxStore';
import appReducer, { setIsProd } from '../../redux/reduxers/app.slice';
import authReducer, {
  removedAuthentication,
  userAuthenticated,
} from '../../redux/reduxers/auth.slice';

describe('redux coverage', () => {
  test('store exposes app and auth slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('app');
    expect(state).toHaveProperty('auth');
  });

  test('app reducer handles setIsProd', () => {
    expect(
      appReducer(undefined, setIsProd({ isProd: true, backendSchoolBoxUrl: 'https://sb' }))
    ).toEqual({
      isProd: true,
      backendSchoolBoxUrl: 'https://sb',
    });
  });

  test('auth reducer handles authenticate and remove', () => {
    const user = { synergyId: 123, Given1: 'Lin' } as any;
    const authenticated = authReducer(undefined, userAuthenticated({ user }));
    expect(authenticated.user).toEqual(user);

    const removed = authReducer(authenticated, removedAuthentication());
    expect(removed.user).toBeUndefined();
  });
});
