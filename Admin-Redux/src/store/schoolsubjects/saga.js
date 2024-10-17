import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SCHOOL_SUBJECTS, UPDATE_SCHOOL_SUBJECTS ,   DELETE_SUBJECT, GET_CLASS_SUBJECTS
} from "./actionTypes";

import {
  getSchoolSubjectsSuccess,
  getSchoolSubjectsFail,
  getClassSubjectsSuccess,
  getClassSubjectsFail,
  updateSchoolSubjectsSuccess,
  updateSchoolSubjectsFail,
deleteSchoolSubjectsFail,
deleteSchoolSubjectsSuccess,


} from "./actions";
import {
  getSchoolSubjects,
  updateSchoolSubjects,
  deleteSchoolSubjects,
  getClassSubjects,
} from "../../helpers/django_api_helper";
import { take } from "lodash";

function* fetchSchoolSubjects(object) {
  try {
    const response = yield call(getSchoolSubjects, object.payload);
    console.log("responseee",response, object.payload)
    yield put(getSchoolSubjectsSuccess(response));
  } catch (error) {
    yield put(getSchoolSubjectsFail(error));
  }
}
function* fetchClassSubjects(object) {
  try {
    const response = yield call(getClassSubjects, object.payload);
    console.log("responseee",response, object.payload)
    yield put(getClassSubjectsSuccess(response));
  } catch (error) {
    yield put(getClassSubjectsFail(error));
  }
}

function* onUpdateSchoolSubjects({ payload: { schoolSubjects, id } }) {
  try {
    const response = yield call(updateSchoolSubjects, schoolSubjects, id);
    yield put(updateSchoolSubjectsSuccess(response));
  } catch (error) {
    yield put(updateSchoolSubjectsFail(error));
  }
}
function* onDeleteSchoolSubjects({ payload: schoolSubjects }) {
  try {
    const response = yield call(deleteSchoolSubjects, schoolSubjects);
    yield put(deleteSchoolSubjectsSuccess(response));
  } catch (error) {
    yield put(deleteSchoolSubjectsFail(error));
  }
}
function* schoolSubjectsSaga() {
  yield takeEvery(GET_SCHOOL_SUBJECTS, fetchSchoolSubjects);
  yield takeEvery(GET_CLASS_SUBJECTS, fetchClassSubjects);
  yield takeEvery(UPDATE_SCHOOL_SUBJECTS, onUpdateSchoolSubjects);
  yield takeEvery(DELETE_SUBJECT, onDeleteSchoolSubjects)
}

export default schoolSubjectsSaga;
