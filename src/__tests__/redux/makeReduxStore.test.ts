import store from '../../redux/makeReduxStore';

describe('makeReduxStore', () => {
  test('exposes app and auth slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('app');
    expect(state).toHaveProperty('auth');
  });
});
