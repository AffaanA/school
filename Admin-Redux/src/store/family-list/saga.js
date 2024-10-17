import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_FAMILY_LIST } from "./actionTypes";

import {
  getFamilyListSuccess,
  getFamilyListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getFamilyList } from "../../helpers/django_api_helper";

function* fetchFamilyList(object) {
  try {
    const response = yield call(getFamilyList, object.payload);
    yield put(getFamilyListSuccess(response));
  } catch (error) {
    yield put(getFamilyListFail(error));
  }
}

function* FamilySaga() {
  yield takeEvery(
    GET_FAMILY_LIST,
    fetchFamilyList
  );
}

export default FamilySaga;
