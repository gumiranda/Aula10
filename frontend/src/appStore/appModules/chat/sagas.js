import {all, takeLatest, call, put, select} from 'redux-saga/effects';
import {Alert} from 'react-native';
import api from '../../../services/api';
import {getSuccess, getFailure} from './list';

export function* getChats({payload}) {
  try {
    const {nextPage, page} = payload;
    const response = yield call(api.get, `chat/page/${page}`);
    if (response.data) {
      const {chatsCount, chats} = response.data;
      if (!nextPage) {
        yield put(getSuccess({chatsList: chats, chatsTotal: chatsCount}));
      } else {
        const {chatsList} = yield select(state => state.chat);
        yield put(
          getSuccess({
            chatsList: [...chatsList, ...chats],
            chatsTotal: chatsCount,
          }),
        );
      }
    } else {
      yield put(getFailure());
    }
  } catch (err) {
    Alert.alert('Erro', 'Confira seus dados');
    yield put(getFailure());
  }
}

export default all([takeLatest('@chat/LIST_REQUEST', getChats)]);
