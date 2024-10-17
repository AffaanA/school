import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_CLASSES_LIST } from "./actionTypes";

import {
  getClassesListSuccess,
  getClassesListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getClassesList } from "../../helpers/django_api_helper";

function* fetchClassesList(object) {
  try {
    const response = yield call(getClassesList, object.payload);
    yield put(getClassesListSuccess(response));
  } catch (error) {
    yield put(getClassesListFail(error));
  }
}

function* ClassesListSaga() {
  yield takeEvery(
    GET_CLASSES_LIST,
    fetchClassesList
  );
}

export default ClassesListSaga;
