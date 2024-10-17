import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SCHOOL_GRADES, UPDATE_SCHOOL_GRADES } from "./actionTypes";

import {
  getSchoolGradesSuccess,
  getSchoolGradesFail,
  updateSchoolGradesSuccess,
  updateSchoolGradesFail,
} from "./actions";
import {
  getSchoolGrades,
  updateSchoolGrades,
} from "../../../helpers/django_api_helper";

function* fetchSchoolGrades(object) {
  try {
    const response = yield call(getSchoolGrades, object.payload);
    yield put(getSchoolGradesSuccess(response));
  } catch (error) {
    yield put(getSchoolGradesFail(error));
  }
}

function* onUpdateSchoolGrades({ payload: { schoolGrades, id } }) {
  try {
    const response = yield call(updateSchoolGrades, schoolGrades, id);
    yield put(updateSchoolGradesSuccess(response));
  } catch (error) {
    yield put(updateSchoolGradesFail(error));
  }
}

function* schoolGradesSaga() {
  yield takeEvery(GET_SCHOOL_GRADES, fetchSchoolGrades);
  yield takeEvery(UPDATE_SCHOOL_GRADES, onUpdateSchoolGrades);
}

export default schoolGradesSaga;
