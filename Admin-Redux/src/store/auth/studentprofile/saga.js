import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_STUDENT_PROFILE, UPDATE_STUDENT_PROFILE } from "./actionTypes";

import {
  getStudentProfileSuccess,
  getStudentProfileFail,
  updateStudentProfileSuccess,
  updateStudentProfileFail,
} from "./actions";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../../helpers/django_api_helper";

function* fetchStudentProfile(object) {
  try {
    const response = yield call(getStudentProfile, object.payload);
    console.log("responseee",response, object.payload)
    yield put(getStudentProfileSuccess(response));
  } catch (error) {
    yield put(getStudentProfileFail(error));
  }
}

function* onUpdateStudentProfile({ payload: { studentProfile, id } }) {
  try {
    const response = yield call(updateStudentProfile, studentProfile, id);
    yield put(updateStudentProfileSuccess(response));
  } catch (error) {
    yield put(updateStudentProfileFail(error));
  }
}

function* studentProfileSaga() {
  yield takeEvery(GET_STUDENT_PROFILE, fetchStudentProfile);
  yield takeEvery(UPDATE_STUDENT_PROFILE, onUpdateStudentProfile);
}

export default studentProfileSaga;
