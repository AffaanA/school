import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_TEACHERS_LIST } from "./actionTypes";

import {
  getTeachersListSuccess,
  getTeachersListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getTeachersList } from "../../helpers/django_api_helper";

function* fetchTeachersList(object) {
  try {
    const response = yield call(getTeachersList, object.payload);
    yield put(getTeachersListSuccess(response));
  } catch (error) {
    yield put(getTeachersListFail(error));
  }
}

function* TeachersSaga() {
  yield takeEvery(
    GET_TEACHERS_LIST,
    fetchTeachersList
  );
}

export default TeachersSaga;
