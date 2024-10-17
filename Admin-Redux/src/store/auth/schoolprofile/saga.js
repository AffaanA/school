import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SCHOOL_PROFILE, UPDATE_SCHOOL_PROFILE } from "./actionTypes";

import {
  getSchoolProfileSuccess,
  getSchoolProfileFail,
  updateSchoolProfileSuccess,
  updateSchoolProfileFail,
} from "./actions";
import {
  getSchoolProfile,
  updateSchoolProfile,
} from "../../../helpers/django_api_helper";

function* fetchSchoolProfile(object) {
  try {
    const response = yield call(getSchoolProfile, object.payload);
    console.log("responseee",response, object.payload)
    yield put(getSchoolProfileSuccess(response));
  } catch (error) {
    yield put(getSchoolProfileFail(error));
  }
}

function* onUpdateSchoolProfile({ payload: { schoolProfile, id } }) {
  try {
    const response = yield call(updateSchoolProfile, schoolProfile, id);
    yield put(updateSchoolProfileSuccess(response));
  } catch (error) {
    yield put(updateSchoolProfileFail(error));
  }
}

function* schoolProfileSaga() {
  yield takeEvery(GET_SCHOOL_PROFILE, fetchSchoolProfile);
  yield takeEvery(UPDATE_SCHOOL_PROFILE, onUpdateSchoolProfile);
}

export default schoolProfileSaga;
