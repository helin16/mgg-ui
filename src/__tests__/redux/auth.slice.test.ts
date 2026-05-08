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
});
