import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SCHOOL_FEE, UPDATE_SCHOOL_FEE } from "./actionTypes";

import {
  getSchoolFeeSuccess,
  getSchoolFeeFail,
  updateSchoolFeeSuccess,
  updateSchoolFeeFail,
} from "./actions";
import {
  getSchoolFee,
  updateSchoolFee,
} from "../../helpers/django_api_helper";

function* fetchSchoolFee({ payload: { id, queryParams }}) {
  try {
    const response = yield call(getSchoolFee, id, queryParams);
    console.log("responseee",response)
    yield put(getSchoolFeeSuccess(response));
  } catch (error) {
    yield put(getSchoolFeeFail(error));
  }
}

function* onUpdateSchoolFee({ payload: { schoolFee, id } }) {
  try {
    const response = yield call(updateSchoolFee, schoolFee, id);
    yield put(updateSchoolFeeSuccess(response));
  } catch (error) {
    yield put(updateSchoolFeeFail(error));
  }
}

function* schoolFeeSaga() {
  yield takeEvery(GET_SCHOOL_FEE, fetchSchoolFee);
  yield takeEvery(UPDATE_SCHOOL_FEE, onUpdateSchoolFee);
}

export default schoolFeeSaga;
