import authReducer, {
  removedAuthentication,
  userAuthenticated,
} from '../../redux/reduxers/auth.slice';

describe('auth.slice', () => {
  test('handles authenticate and remove', () => {
    const user = {synergyId: 123, Given1: 'Lin'} as any;
    const authenticated = authReducer(undefined, userAuthenticated({user}));
    expect(authenticated.user).toEqual(user);

    const removed = authReducer(authenticated, removedAuthentication());
    expect(removed.user).toBeUndefined();
  });

  test('overwrites an existing user when re-authenticated', () => {
    const firstUser = {synergyId: 1, Given1: 'Old'} as any;
    const nextUser = {synergyId: 2, Given1: 'New'} as any;

    const state = authReducer({user: firstUser}, userAuthenticated({user: nextUser}));

    expect(state.user).toEqual(nextUser);
  });
});
