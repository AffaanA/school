import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_DEFAULTERS_LIST,
  UPDATE_DEFAULTERS_LIST,
} from "./actionTypes";

import {
  getDefaultersListSuccess,
  getDefaultersListFail,
  updateDefaultersListSuccess,
  updateDefaultersListFail,
} from "./actions";

// Include both helper file with needed methods
import { getDefaultersList, updateDefaultersList } from "../../helpers/django_api_helper";

// Fetch defaulters list
function* fetchDefaultersList(object) {
  try {
    const response = yield call(getDefaultersList, object.payload);
    yield put(getDefaultersListSuccess(response));
  } catch (error) {
    yield put(getDefaultersListFail(error));
  }
}
function* updateDefaultersListSaga(action) {
  try {
    console.log("Saga received action payload:", action.payload);
    const response = yield call(updateDefaultersList, action.payload);
    console.log("API response:", response);
    yield put(updateDefaultersListSuccess(response));
  } catch (error) {
    console.error("API call failed:", error);
    yield put(updateDefaultersListFail(error));
  }
}


function* DefaultersListSaga() {
  yield takeEvery(GET_DEFAULTERS_LIST, fetchDefaultersList);
  yield takeEvery(UPDATE_DEFAULTERS_LIST, updateDefaultersListSaga); // Watch for the update action
}

export default DefaultersListSaga;
