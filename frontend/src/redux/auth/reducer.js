import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({ idToken: null, credentials: {}, errorMessage: null, profile: {}, dashboardTitle: '' });

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return state.set('idToken', action.token)
        .set('profile', action.profile);
    case actions.LOGIN_REQUEST:
      return state.set('credentials', action.credentials);
    case actions.LOGOUT:
      return initState;
    case actions.LOGIN_ERROR:
      return state.set('errorMessage', action.message);
    case actions.CREATE_DASHBOARD_REQUEST:
      return state.set('dashboardTitle', action.dashboardTitle);
    default:
      return state;
  }
}
