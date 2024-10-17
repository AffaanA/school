import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_STUDENTS_LIST } from "./actionTypes";

import {
  getStudentsListSuccess,
  getStudentsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getStudentsList } from "../../helpers/django_api_helper";

function* fetchStudentsList(object) {
  try {
    const response = yield call(getStudentsList, object.payload);
    yield put(getStudentsListSuccess(response));
  } catch (error) {
    yield put(getStudentsListFail(error));
  }
}

function* StudentsListSaga() {
  yield takeEvery(
    GET_STUDENTS_LIST,
    fetchStudentsList
  );
}

export default StudentsListSaga;
