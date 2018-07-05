import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import cardsSagas from './card/saga';
import devSagas from '../customApp/redux/sagas';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    cardsSagas(),
    devSagas()
  ]);
}
