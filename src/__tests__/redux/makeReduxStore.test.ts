import store from '../../redux/makeReduxStore';
import {setIsProd} from '../../redux/reduxers/app.slice';
import {removedAuthentication, userAuthenticated} from '../../redux/reduxers/auth.slice';

describe('makeReduxStore', () => {
  test('exposes app and auth slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('app');
    expect(state).toHaveProperty('auth');
  });

  test('wires dispatched actions into the configured reducers', () => {
    store.dispatch(setIsProd({isProd: true, backendSchoolBoxUrl: 'https://sb'}));
    store.dispatch(userAuthenticated({user: {synergyId: 7} as any}));

    expect(store.getState().app).toEqual({
      isProd: true,
      backendSchoolBoxUrl: 'https://sb',
    });
    expect(store.getState().auth.user).toEqual({synergyId: 7});

    store.dispatch(removedAuthentication());
    expect(store.getState().auth.user).toBeUndefined();
  });
});
