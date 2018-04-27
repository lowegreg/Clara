import { all, takeEvery, put, fork, select, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken, clearToken, getProfile } from '../../helpers/utility';
import actions from './actions';
import { loginAPI, getDashboards, getUser } from './helper'

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*() {
    const state = yield select();
    const credentials =  state.Auth._root.entries[1][1]
    
    try {
      var responseBody = yield call(loginAPI, credentials.identifier, credentials.password)
      if (responseBody.jwt) {
        var user = yield call(getUser, responseBody.user._id, responseBody.jwt)  
        var profile = {
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role.name,
          dashboards: user.dashboards,
        };

        yield put({
          type: actions.LOGIN_SUCCESS,
          token: responseBody.jwt,
          profile: profile
        });
      } else {
        yield put({ 
          type: actions.LOGIN_ERROR,
          message: responseBody.message
         });
      }
    } catch (e) {
      console.log(e);
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.token);
    yield localStorage.setItem('profile', JSON.stringify(payload.profile))
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*(payload) {
    yield localStorage.setItem('message', payload.message);
  });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/'));
  });
}
export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
    const token = getToken().get('idToken');
    const profile = getProfile().get('profile');
    if (token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token,
        profile,
      });
    }
  });
}

//Gets the updated user dashboards and sets it for the new user
export function* updateUser() {
  yield takeEvery(actions.UPDATE_USER_RESQUEST, function*() {
    const state = yield select();
    //array of the inital state fronm reducer
    const params = state.Auth._root.entries;
    var dashboards = yield call(getDashboards, params[3][1].userId, params[0][1])
    if(!dashboards.error){
      var updateProfile = getProfile().get('profile');
      updateProfile.dashboards = dashboards;
      yield localStorage.setItem('profile', JSON.stringify(updateProfile));
      
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateUser),
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout)
  ]);
}
