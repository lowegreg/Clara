import { all, takeEvery, put, fork, select, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken, clearToken } from '../../helpers/utility';
import actions from './actions';

function loginAPI(user, password, code) {
  return fetch('http://localhost:1337/auth/local',  {
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: "POST",
    body: `identifier=${user}&password=${password}`,
  })
  .then(response => response.json())
  .catch(error => error)
  .then(data => data)
}

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*() {
    const state = yield select();
    const credentials =  state.Auth._root.entries[1][1]
    
    try {
      var responseBody = yield call(loginAPI, credentials.identifier, credentials.password)
      if (responseBody.jwt) {
          yield put({
          type: actions.LOGIN_SUCCESS,
          token: responseBody.jwt,
          profile: 'Profile'
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
    if (token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token,
        profile: 'Profile'
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout)
  ]);
}
